#!/usr/bin/env node
/**
 * Post-build script: copy source .md files for the stable docs version into the
 * build output so that appending ".md" to any documentation URL returns the raw
 * markdown source.
 *
 * doc.web3signer is versioned. The stable version (the one `lastVersion` points
 * to in docusaurus.config.js) is served at the site root. Its source lives in
 * `versioned_docs/version-<stable>/`, NOT in `docs/` (which is the development
 * version served under /development/).
 *
 * Docusaurus URL mapping (routeBasePath "/", stable version at root):
 *   versioned_docs/version-<stable>/path/to/page.md       → build/path/to/page.md
 *   versioned_docs/version-<stable>/path/to/dir/index.md  → build/path/to/dir.md
 *
 * A page's `slug` frontmatter overrides the file path. For example the stable
 * index.md uses `slug: /`, so it resolves to the site root, which is left to
 * static/index.md (the agent landing page served for `Accept: text/markdown`
 * at /).
 *
 * This lets agents request, e.g.:
 *   https://docs.web3signer.consensys.io/get-started/install-binaries.md
 *
 * Only the stable (root) version is covered. The development version and
 * archived versions are intentionally not exported as raw markdown.
 *
 * This script also repairs the home page entry in the generated llms.txt. See
 * fixLlmsTxtHomeLink below.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const VERSIONS_JSON = path.join(ROOT_DIR, "versions.json");
const CONFIG_FILE = path.join(ROOT_DIR, "docusaurus.config.js");
const VERSIONED_DOCS_DIR = path.join(ROOT_DIR, "versioned_docs");
const BUILD_DIR = path.join(ROOT_DIR, "build");

// Docusaurus exclude patterns (from docusaurus.config.js)
const SKIP_PREFIXES = ["_"];

// Directive prepended after frontmatter so agents that fetch .md URLs
// can discover the documentation index and other markdown pages.
const AGENT_DIRECTIVE =
  "> For AI agents: a documentation index is available at " +
  "[/llms.txt](/llms.txt). " +
  "Append `.md` to any documentation URL to get the markdown source.\n\n";

let copied = 0;
let skipped = 0;

function getStableVersion() {
  // The site root serves whatever `lastVersion` points to in
  // docusaurus.config.js, so derive the stable version from that. This keeps the
  // raw .md export aligned with the HTML served at / even right after a new
  // version is frozen (prepended to versions.json) but before `lastVersion` is
  // bumped to match.
  const config = fs.readFileSync(CONFIG_FILE, "utf8");
  const match = config.match(/lastVersion:\s*["']([^"']+)["']/);
  if (match) {
    return match[1];
  }

  // Fallback: when `lastVersion` is unset, Docusaurus serves the latest frozen
  // version (the first entry in versions.json) at the site root.
  const versions = JSON.parse(fs.readFileSync(VERSIONS_JSON, "utf8"));
  const stable = Array.isArray(versions) ? versions[0] : undefined;
  if (!stable) {
    throw new Error(
      "copy-md-to-build: no stable version found (no lastVersion in " +
        "docusaurus.config.js and versions.json is empty)"
    );
  }
  return stable;
}

function shouldSkip(relPath) {
  return relPath
    .split(path.sep)
    .some((segment) => SKIP_PREFIXES.some((prefix) => segment.startsWith(prefix)));
}

/**
 * Insert the agent directive after the YAML frontmatter block (--- ... ---).
 * If no frontmatter is present, prepend to the start of the file.
 */
function addDirective(content) {
  // Frontmatter starts at position 0 with "---\n" and ends with "\n---\n"
  if (content.startsWith("---\n") || content.startsWith("---\r\n")) {
    const closingIdx = content.indexOf("\n---\n", 3);
    if (closingIdx !== -1) {
      const insertAt = closingIdx + 5; // after "\n---\n"
      return (
        content.slice(0, insertAt) + "\n" + AGENT_DIRECTIVE + content.slice(insertAt)
      );
    }
  }
  return AGENT_DIRECTIVE + content;
}

/**
 * Extract the `slug` frontmatter value, if present, so the output path matches
 * the page's published URL (Docusaurus honors `slug` over the file path).
 */
function getSlug(content) {
  if (!(content.startsWith("---\n") || content.startsWith("---\r\n"))) {
    return null;
  }
  const closingIdx = content.indexOf("\n---\n", 3);
  if (closingIdx === -1) {
    return null;
  }
  const frontmatter = content.slice(0, closingIdx);
  const match = frontmatter.match(/^slug:\s*(.+?)\s*$/m);
  if (!match) {
    return null;
  }
  return match[1].trim().replace(/^["']|["']$/g, "");
}

/**
 * Compute the route path (no leading slash, no extension) for a doc, honoring
 * `slug` frontmatter. Returns "" for docs that resolve to the site root.
 */
function getRoutePath(rel, fileName, slug) {
  if (slug) {
    if (slug.startsWith("/")) {
      return slug.replace(/^\/+/, "");
    }
    const dir = path.dirname(rel).split(path.sep).join("/");
    return dir === "." ? slug : `${dir}/${slug}`;
  }
  if (fileName === "index.md") {
    const parentRel = path.dirname(rel).split(path.sep).join("/");
    return parentRel === "." ? "" : parentRel;
  }
  return rel.split(path.sep).join("/").replace(/\.md$/, "");
}

/**
 * Point the llms.txt home page entry at a URL that resolves.
 *
 * docusaurus-plugin-llms derives the home page URL from its source path
 * (docs/index.md) rather than its `slug: /` frontmatter, and then treats the
 * docs directory as a route prefix, so it emits `<site>/docs.md` — a route that
 * does not exist. The home page markdown is published at /index.md (from
 * static/index.md), so rewrite the entry to that.
 */
function fixLlmsTxtHomeLink() {
  const llmsTxtPath = path.join(BUILD_DIR, "llms.txt");

  if (!fs.existsSync(llmsTxtPath)) {
    console.warn("copy-md-to-build: build/llms.txt not found, skipping home link fix");
    return;
  }

  const config = fs.readFileSync(CONFIG_FILE, "utf8");
  const urlMatch = config.match(/^\s*url:\s*["']([^"']+)["']/m);
  if (!urlMatch) {
    throw new Error("copy-md-to-build: no `url` found in docusaurus.config.js");
  }
  const siteUrl = urlMatch[1].replace(/\/+$/, "");

  const brokenLink = `${siteUrl}/docs.md`;
  const homeLink = `${siteUrl}/index.md`;
  const content = fs.readFileSync(llmsTxtPath, "utf8");

  // A miss means the plugin no longer emits the bad URL, so there is nothing to
  // rewrite. Warn rather than fail so a plugin fix does not break the build.
  if (!content.includes(brokenLink)) {
    console.warn(
      `copy-md-to-build: ${brokenLink} not found in llms.txt, no home link rewritten`
    );
    return;
  }

  fs.writeFileSync(llmsTxtPath, content.replaceAll(brokenLink, homeLink), "utf8");
  console.log(`copy-md-to-build: rewrote llms.txt home link to ${homeLink}`);
}

function walk(dir, sourceRoot) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, sourceRoot);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const rel = path.relative(sourceRoot, fullPath);

      if (shouldSkip(rel)) {
        skipped++;
        continue;
      }

      const content = fs.readFileSync(fullPath, "utf8");
      const routePath = getRoutePath(rel, entry.name, getSlug(content));

      // The site root is reserved for static/index.md (the agent landing page),
      // so never overwrite build/index.md from the docs tree.
      if (routePath === "") {
        skipped++;
        continue;
      }

      const destPath = path.join(BUILD_DIR, ...`${routePath}.md`.split("/"));
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, addDirective(content), "utf8");
      copied++;
    }
  }
}

const stableVersion = getStableVersion();
const stableDir = path.join(VERSIONED_DOCS_DIR, `version-${stableVersion}`);

if (!fs.existsSync(stableDir)) {
  throw new Error(`copy-md-to-build: stable docs directory not found: ${stableDir}`);
}

walk(stableDir, stableDir);
console.log(
  `copy-md-to-build: stable version ${stableVersion} — copied ${copied} files, skipped ${skipped} files`
);

fixLlmsTxtHomeLink();
