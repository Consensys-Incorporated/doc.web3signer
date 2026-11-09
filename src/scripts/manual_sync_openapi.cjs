/**
 * Manual OpenAPI sync script (Option A: specs are build-time only; generated docs are committed).
 *
 * Fix #1 applied: upstream branch is `master` (not `main`).
 *
 * What it does:
 * - Sparse clones the upstream repo and checks out only `openapi-specs/`
 * - Copies `openapi-specs/eth1` + `openapi-specs/eth2` into `src/openapi-specs/`
 * - Normalizes `servers:` (node scripts/normalize_openapi_servers.cjs)
 * - Bundles both specs using pinned Redocly CLI
 * - Cleans and regenerates API docs under `docs/reference/api/**`
 */

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execSync } = require("node:child_process");

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: "inherit", ...opts });
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

// scripts live under `src/scripts/` → repo root is two levels up
const repoRoot = path.resolve(__dirname, "../..");

// Adjust these constants if folder structure changes in the future.
const CONFIG = {
  upstreamRepo: "https://github.com/Consensys-Incorporated/web3signer.git",
  upstreamRef: "master",
  upstreamDir: "openapi-specs",
  eth1Dir: "eth1",
  eth2Dir: "eth2",
  specFile: "web3signer.yaml",
  targetRoot: "src/openapi-specs",
  redoclyVersion: "2.12.6",
};

const targetRootAbs = path.join(repoRoot, CONFIG.targetRoot);
const targetEth1Abs = path.join(targetRootAbs, CONFIG.eth1Dir);
const targetEth2Abs = path.join(targetRootAbs, CONFIG.eth2Dir);

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "doc-web3signer-openapi-"));
const tmpRepoDir = path.join(tmpDir, "web3signer");

try {
  console.log(`Using upstream: ${CONFIG.upstreamRepo}@${CONFIG.upstreamRef}`);
  console.log(`Temporary clone dir: ${tmpRepoDir}`);

  sh(
    `git clone --depth 1 --filter=blob:none --sparse --branch ${CONFIG.upstreamRef} ${CONFIG.upstreamRepo} ${tmpRepoDir}`
  );
  sh(`git -C ${tmpRepoDir} sparse-checkout set ${CONFIG.upstreamDir}`);

  ensureDir(targetRootAbs);
  rmrf(targetEth1Abs);
  rmrf(targetEth2Abs);

  const srcEth1 = path.join(tmpRepoDir, CONFIG.upstreamDir, CONFIG.eth1Dir);
  const srcEth2 = path.join(tmpRepoDir, CONFIG.upstreamDir, CONFIG.eth2Dir);

  if (!fs.existsSync(srcEth1) || !fs.existsSync(srcEth2)) {
    throw new Error(
      `Upstream directories not found. Expected:\n- ${srcEth1}\n- ${srcEth2}`
    );
  }

  sh(`cp -R ${srcEth1} ${targetRootAbs}/`);
  sh(`cp -R ${srcEth2} ${targetRootAbs}/`);

  // Normalize servers
  sh(
    `node ${path.join(repoRoot, "src", "scripts", "normalize_openapi_servers.cjs")}`
  );

  // Bundle with pinned Redocly
  const eth1SpecAbs = path.join(targetEth1Abs, CONFIG.specFile);
  const eth2SpecAbs = path.join(targetEth2Abs, CONFIG.specFile);
  const eth1BundledAbs = path.join(targetRootAbs, `${CONFIG.eth1Dir}-bundled.yaml`);
  const eth2BundledAbs = path.join(targetRootAbs, `${CONFIG.eth2Dir}-bundled.yaml`);

  sh(
    `npx --yes @redocly/cli@${CONFIG.redoclyVersion} bundle ${eth2SpecAbs} -o ${eth2BundledAbs}`,
    { cwd: repoRoot }
  );
  sh(
    `npx --yes @redocly/cli@${CONFIG.redoclyVersion} bundle ${eth1SpecAbs} -o ${eth1BundledAbs}`,
    { cwd: repoRoot }
  );

  // Regenerate docs output
  sh(`npm run clean-api-docs`, { cwd: repoRoot });
  sh(`npm run gen-api-docs`, { cwd: repoRoot });

  console.log("Manual OpenAPI sync complete.");
  console.log("Reminder: commit changes under docs/reference/api/** (Option A).");
} finally {
  rmrf(tmpDir);
}


