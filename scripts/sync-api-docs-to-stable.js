#!/usr/bin/env node
/**
 * Copy the generated REST operation pages into the current stable snapshot.
 *
 * `gen-api-docs` writes them to `docs/reference/api/`, which Docusaurus serves
 * as the development version. The stable version only renders files in
 * `versioned_docs/version-<lastVersion>/`. This copies the eth1 and eth2
 * trees there so both versions serve the same operations.
 *
 * The next `docs:version` copies `docs/` on its own. Running this again after
 * that refreshes the current stable API pages from `docs/`. Older snapshots
 * are left alone.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const CONFIG_FILE = path.join(ROOT_DIR, "docusaurus.config.js");

const CATEGORIES = {
  eth2: { label: "Consensus layer", position: 3 },
  eth1: { label: "Execution layer", position: 4 },
};

function stableVersion() {
  const config = fs.readFileSync(CONFIG_FILE, "utf8");
  const match = config.match(/lastVersion:\s*["']([^"']+)["']/);
  if (!match) {
    throw new Error(
      "sync-api-docs-to-stable: no lastVersion in docusaurus.config.js",
    );
  }
  return match[1];
}

function syncTree(version, name, category) {
  const source = path.join(ROOT_DIR, "docs", "reference", "api", name);
  const destination = path.join(
    ROOT_DIR,
    "versioned_docs",
    `version-${version}`,
    "reference",
    "api",
    name,
  );
  if (!fs.existsSync(source)) {
    throw new Error(`sync-api-docs-to-stable: missing ${source}`);
  }
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
  // The stable sidebar autogenerates Reference. Development names these groups
  // in sidebars.js, so the snapshot needs the labels here. clean-api-docs
  // deletes *.json under docs/reference/api, so the files live only in the snapshot.
  fs.writeFileSync(
    path.join(destination, "_category_.json"),
    `${JSON.stringify({ label: category.label, position: category.position }, null, 2)}\n`,
  );
}

function main() {
  const version = stableVersion();
  for (const [name, category] of Object.entries(CATEGORIES)) {
    syncTree(version, name, category);
  }
  console.log(
    `sync-api-docs-to-stable: copied eth1 and eth2 API docs into version-${version}`,
  );
}

main();
