#!/usr/bin/env node
/**
 * Fetch the Web3Signer OpenAPI specs and bundle them for `gen-api-docs`.
 *
 * The specs are read from the Web3Signer repository at the tag that matches
 * `lastVersion` in docusaurus.config.js, so freezing a docs version and bumping
 * `lastVersion` also moves the REST reference to that release. Set
 * WEB3SIGNER_SPEC_REF to build from another tag, branch, or commit.
 *
 * Output (gitignored):
 *   src/openapi-specs/eth1/, src/openapi-specs/eth2/   split specs as fetched
 *   src/openapi-specs/eth1-bundled.yaml, eth2-bundled.yaml
 *   src/openapi-specs/.web3signer-ref                   ref of the current bundle
 *
 * When the bundles already match the requested ref, the fetch is skipped so
 * `npm start` works offline after the first run.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT_DIR = path.join(__dirname, "..");
const CONFIG_FILE = path.join(ROOT_DIR, "docusaurus.config.js");
const SPECS_DIR = path.join(ROOT_DIR, "src", "openapi-specs");
const REF_FILE = path.join(SPECS_DIR, ".web3signer-ref");
const REPO_URL = "https://github.com/Consensys-Incorporated/web3signer.git";
const UPSTREAM_DIR = "openapi-specs";
const APIS = ["eth1", "eth2"];

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: "inherit", ...options });
}

function getRef() {
  if (process.env.WEB3SIGNER_SPEC_REF) {
    return process.env.WEB3SIGNER_SPEC_REF;
  }
  const config = fs.readFileSync(CONFIG_FILE, "utf8");
  const match = config.match(/lastVersion:\s*["']([^"']+)["']/);
  if (!match) {
    throw new Error(
      "fetch-openapi-specs: no lastVersion literal in docusaurus.config.js",
    );
  }
  return match[1];
}

function bundlePath(api) {
  return path.join(SPECS_DIR, `${api}-bundled.yaml`);
}

function isCurrent(ref) {
  return (
    fs.existsSync(REF_FILE) &&
    fs.readFileSync(REF_FILE, "utf8").trim() === ref &&
    APIS.every((api) => fs.existsSync(bundlePath(api)))
  );
}

function fetchSpecs(ref, checkoutDir) {
  run("git", ["init", "--quiet", checkoutDir]);
  const git = (...args) => run("git", ["-C", checkoutDir, ...args]);
  git("remote", "add", "origin", REPO_URL);
  git("sparse-checkout", "set", UPSTREAM_DIR);
  git("fetch", "--quiet", "--depth", "1", "--filter=blob:none", "origin", ref);
  git("checkout", "--quiet", "FETCH_HEAD");

  for (const api of APIS) {
    const source = path.join(checkoutDir, UPSTREAM_DIR, api);
    if (!fs.existsSync(source)) {
      throw new Error(
        `fetch-openapi-specs: ${UPSTREAM_DIR}/${api} not found at ${ref}`,
      );
    }
    const destination = path.join(SPECS_DIR, api);
    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(source, destination, { recursive: true });
  }
}

function bundleSpecs() {
  run("node", [
    path.join(ROOT_DIR, "src", "scripts", "normalize_openapi_servers.cjs"),
  ]);
  // The docs build installs with --omit=dev, so this must be the local
  // production copy. npx would otherwise download the unrelated redocly@1.0.0.
  const redocly = path.join(ROOT_DIR, "node_modules", ".bin", "redocly");
  if (!fs.existsSync(redocly)) {
    throw new Error(
      "fetch-openapi-specs: @redocly/cli is not installed. It must be a production dependency.",
    );
  }
  for (const api of APIS) {
    const output = bundlePath(api);
    run(
      redocly,
      [
        "bundle",
        path.join(SPECS_DIR, api, "web3signer.yaml"),
        "--output",
        output,
      ],
      { cwd: ROOT_DIR },
    );
    if (!fs.existsSync(output)) {
      throw new Error(`fetch-openapi-specs: bundle did not write ${output}`);
    }
  }
}

function main() {
  const ref = getRef();
  if (isCurrent(ref)) {
    console.log(`fetch-openapi-specs: specs for Web3Signer ${ref} are current`);
    return;
  }

  console.log(`fetch-openapi-specs: fetching Web3Signer ${ref}`);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "web3signer-specs-"));
  try {
    fetchSpecs(ref, path.join(tmpDir, "web3signer"));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
  bundleSpecs();
  fs.writeFileSync(REF_FILE, `${ref}\n`);
  console.log(`fetch-openapi-specs: bundled specs for Web3Signer ${ref}`);
}

main();
