#!/usr/bin/env node
/**
 * Write a Markdown file for each generated API operation into the build output.
 *
 * Development pages are served under /development/. The stable snapshot is
 * served at the site root. The stable eth1 and eth2 folders are symlinks to
 * docs/reference/api, so both exports are the same unversioned API reference:
 *
 *   docs/reference/api/eth2/sign.api.mdx
 *     → build/development/reference/api/eth2/sign.md
 *   versioned_docs/version-<stable>/reference/api/eth2/sign.api.mdx
 *     → build/reference/api/eth2/sign.md
 *
 * These files are build output. They are not committed. Copy page and
 * View as Markdown on an API page open the file for that page's URL.
 */

const fs = require("fs");
const path = require("path");
const {
  readOperationFile,
  renderOperationMarkdown,
} = require("./render-api-markdown");

const ROOT_DIR = path.join(__dirname, "..");
const CONFIG_FILE = path.join(ROOT_DIR, "docusaurus.config.js");
const BUILD_DIR = path.join(ROOT_DIR, "build");

function readConfig() {
  return fs.readFileSync(CONFIG_FILE, "utf8");
}

function stableVersion(config) {
  const match = config.match(/lastVersion:\s*["']([^"']+)["']/);
  if (!match) {
    throw new Error(
      "api-markdown-to-build: no lastVersion in docusaurus.config.js",
    );
  }
  return match[1];
}

function currentVersionPath(config) {
  const match = config.match(/current:\s*\{[^}]*path:\s*["']([^"']+)["']/s);
  return match ? match[1] : "development";
}

function siteUrl(config) {
  const match = config.match(/^\s*url:\s*["']([^"']+)["']/m);
  if (!match) {
    throw new Error("api-markdown-to-build: no url in docusaurus.config.js");
  }
  return match[1].replace(/\/+$/, "");
}

function walkOperations(dir, found = []) {
  if (!fs.existsSync(dir)) {
    return found;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const isDirectory =
      entry.isDirectory() ||
      (entry.isSymbolicLink() && fs.statSync(fullPath).isDirectory());
    if (isDirectory) {
      if (entry.name.startsWith("_")) {
        continue;
      }
      walkOperations(fullPath, found);
    } else if (entry.isFile() && entry.name.endsWith(".api.mdx")) {
      found.push(fullPath);
    }
  }
  return found;
}

function routeFor(filePath, sourceRoot, page) {
  const relativeDir = path.dirname(path.relative(sourceRoot, filePath));
  const id = page.id || path.basename(filePath).replace(/\.api\.mdx$/, "");
  const route = path.join(relativeDir, id).split(path.sep).join("/");
  return route;
}

function writeTree(sourceRoot, urlPrefix) {
  const written = [];
  // Walk only the generated operation directories. Routes stay relative to the
  // docs root, so sign.api.mdx is /reference/api/eth2/sign.md.
  const apiRoot = path.join(sourceRoot, "reference", "api");
  for (const filePath of walkOperations(apiRoot)) {
    const page = readOperationFile(fs.readFileSync(filePath, "utf8"));
    if (!page) {
      throw new Error(`api-markdown-to-build: no operation in ${filePath}`);
    }
    const route = routeFor(filePath, sourceRoot, page);
    const urlPath = urlPrefix ? `${urlPrefix}/${route}` : route;
    const destination = path.join(BUILD_DIR, `${urlPath}.md`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const markdown = renderOperationMarkdown(page);
    fs.writeFileSync(destination, markdown);
    written.push({
      urlPath,
      title: page.title || page.operation.operationId || route,
      description: page.description || page.operation.description || "",
      markdown,
    });
  }
  return written;
}

function appendAgentIndex(stablePages, config) {
  if (stablePages.length === 0) {
    return;
  }
  const base = siteUrl(config);
  const llmsTxt = path.join(BUILD_DIR, "llms.txt");
  const llmsFull = path.join(BUILD_DIR, "llms-full.txt");
  const links = stablePages
    .slice()
    .sort((left, right) => left.urlPath.localeCompare(right.urlPath))
    .map((page) => {
      const description = page.description.replace(/\s+/g, " ").trim();
      const suffix = description ? `: ${description}` : "";
      return `- [${page.title}](${base}/${page.urlPath}.md)${suffix}`;
    });

  if (fs.existsSync(llmsTxt)) {
    fs.appendFileSync(llmsTxt, `\n\n## REST API\n\n${links.join("\n")}\n`);
  } else {
    console.warn(
      "api-markdown-to-build: build/llms.txt not found, skipping index links",
    );
  }

  if (fs.existsSync(llmsFull)) {
    const bodies = stablePages
      .map((page) => page.markdown.trim())
      .join("\n\n---\n\n");
    fs.appendFileSync(llmsFull, `\n\n---\n\n${bodies}\n`);
  } else {
    console.warn(
      "api-markdown-to-build: build/llms-full.txt not found, skipping full text",
    );
  }
}

function main() {
  const config = readConfig();
  const version = stableVersion(config);
  const development = writeTree(
    path.join(ROOT_DIR, "docs"),
    currentVersionPath(config),
  );
  const stable = writeTree(
    path.join(ROOT_DIR, "versioned_docs", `version-${version}`),
    "",
  );
  appendAgentIndex(stable, config);
  console.log(
    `api-markdown-to-build: wrote ${development.length} development and ${stable.length} stable API markdown files`,
  );
}

main();
