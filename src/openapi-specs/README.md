# OpenAPI specifications

This directory contains OpenAPI specifications synced from the [Web3Signer repository](https://github.com/Consensys-Incorporated/web3signer).

> **Note:** These specs are in `src/` because they are only used at build time to generate the API documentation. They are not included in the final site output.

## Files

- `eth2/` - Original ETH2 OpenAPI spec files (synced from Web3Signer)
- `eth1/` - Original ETH1 OpenAPI spec files (synced from Web3Signer)
- `eth2-bundled.yaml` - Bundled ETH2 spec with all `$ref` resolved
- `eth1-bundled.yaml` - Bundled ETH1 spec with all `$ref` resolved

## Syncing

These files are automatically synced from the Web3Signer repository via the `sync-openapi.yml` GitHub Action workflow.

To manually sync:

1. Run the workflow from the Actions tab, or
2. Run locally (fetch + normalize + bundle + regenerate):

   ```bash
   # From the repo root
   cd doc.web3signer

   # One-shot manual sync (fetches from upstream, normalizes servers, bundles, cleans, regenerates)
   node src/scripts/manual_sync_openapi.cjs
   ```

> Note: `src/openapi-specs/**` is intentionally ignored by git (build-time input only). The committed output is `docs/reference/api/**`.

## Generated documentation

The generated API documentation is output to:

- `docs/reference/api/eth2/` - Consensus layer API docs
- `docs/reference/api/eth1/` - Execution layer API docs

The API reference is not versioned. `npm run gen-api-docs` then runs
`scripts/sync-api-docs-to-stable.js`, which links `eth1` and `eth2` in every
`versioned_docs/version-*/reference/api/` directory at those folders. Stable and development
serve the same pages. The Markdown files agents fetch (`.md` URLs) are written at build time by
`scripts/api-markdown-to-build.js` and are not committed.
