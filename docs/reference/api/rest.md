---
description: Use for signing consensus layer payloads
sidebar_position: 2
---

# Web3Signer REST API

The Web3Signer REST API exposes:

- **Consensus layer (ETH2) endpoints** — use these to sign consensus layer payloads.
- **Execution layer (ETH1) endpoints** — **basic** signing only; they do **not** perform transaction
    encoding or return a full Ethereum transaction signature.

:::info Recommendation
For execution layer transactions, use the [Web3Signer JSON-RPC API](json-rpc.md) instead of the ETH1 REST endpoints.
:::

## Access the REST API

Web3Signer serves HTTP requests on a configurable host and port. The default base URL is
`http://localhost:9000`, you can configure the default base URL by setting:

- [`--http-listen-host`](../cli/options.md#http-listen-host) to the required host.
- [`--http-listen-port`](../cli/options.md#http-listen-port) to the required port

:::info Important
Your hostname must be added to the [allowlist](../cli/options.md#http-host-allowlist) to call the
REST APIs.
:::

## API reference

View the [REST API documentation] for more information about the available APIs.

<!-- Links -->

[REST API documentation]: https://consensys-incorporated.github.io/web3signer/
