# OpenAPI specifications

The REST API reference is generated from the OpenAPI specs in the
[Web3Signer repository](https://github.com/Consensys-Incorporated/web3signer)
(`openapi-specs/eth1` and `openapi-specs/eth2`). Nothing in this directory except this file is
committed.

## How the specs are fetched

`npm start` and `npm run build` run `npm run gen-api-docs`, which first runs
`scripts/fetch-openapi-specs.js`. The script:

1. Fetches `openapi-specs/` from Web3Signer at the tag that matches `lastVersion` in
   `docusaurus.config.js`.
2. Normalizes the `servers` list (`src/scripts/normalize_openapi_servers.cjs`).
3. Bundles each spec with Redocly into `eth1-bundled.yaml` and `eth2-bundled.yaml`.

If the bundles already match the requested tag, the fetch is skipped, so `npm start` works
offline after the first run.

To preview the reference from another tag, branch, or commit, set `WEB3SIGNER_SPEC_REF`:

```bash
WEB3SIGNER_SPEC_REF=master npm start
```

## Updating the API reference

Freeze the docs version and bump `lastVersion`. The next build fetches the specs for that release.

## Generated documentation

`gen-api-docs` writes the operation pages to:

- `docs/reference/api/eth2/` - Consensus layer API docs
- `docs/reference/api/eth1/` - Execution layer API docs

Those pages are gitignored. The API reference is not versioned. `gen-api-docs` then runs
`scripts/sync-api-docs-to-stable.js`, which links `eth1` and `eth2` in every
`versioned_docs/version-*/reference/api/` directory at those folders. Stable and development
serve the same pages. The Markdown files agents fetch (`.md` URLs) are written at build time by
`scripts/api-markdown-to-build.js` and are not committed.
