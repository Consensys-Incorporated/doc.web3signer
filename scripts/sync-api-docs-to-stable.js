#!/usr/bin/env node
/**
 * Point every docs version at the one REST API reference.
 *
 * `gen-api-docs` writes the operation pages to `docs/reference/api/` at build
 * time. Those pages are gitignored. The API reference is not versioned: stable
 * and development both serve those files.
 * Each snapshot under versioned_docs gets a symlink for eth1 and eth2 instead
 * of its own copy. A later `docs:version` copies
 * `docs/` into the new snapshot; running this again replaces that copy with a
 * link, so the new version stays on the same API pages.
 *
 * Sidebar labels live in the source tree. `clean-api-docs` deletes `*.json`
 * directly under each output directory, so this writes `_category_.json` after
 * generation.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");

const CATEGORIES = {
  eth2: { label: "Consensus layer", position: 3 },
  eth1: { label: "Execution layer", position: 4 },
};

function writeCategory(source, category) {
  fs.writeFileSync(
    path.join(source, "_category_.json"),
    `${JSON.stringify({ label: category.label, position: category.position }, null, 2)}\n`,
  );
}

function linkTree(versionDir, name, category) {
  const source = path.join(ROOT_DIR, "docs", "reference", "api", name);
  if (!fs.existsSync(source)) {
    throw new Error(`sync-api-docs-to-stable: missing ${source}`);
  }
  writeCategory(source, category);

  const destination = path.join(versionDir, "reference", "api", name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.rmSync(destination, { recursive: true, force: true });
  const relative = path.relative(path.dirname(destination), source);
  fs.symlinkSync(relative, destination);
}

function main() {
  const versionsDir = path.join(ROOT_DIR, "versioned_docs");
  const versions = fs
    .readdirSync(versionsDir)
    .filter((name) => name.startsWith("version-"));
  if (versions.length === 0) {
    throw new Error("sync-api-docs-to-stable: no versioned_docs snapshots");
  }
  for (const version of versions) {
    for (const [name, category] of Object.entries(CATEGORIES)) {
      linkTree(path.join(versionsDir, version), name, category);
    }
  }
  console.log(
    `sync-api-docs-to-stable: linked eth1 and eth2 API docs for ${versions.join(", ")}`,
  );
}

main();
