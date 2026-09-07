---
description: Learn more about Web3Signer's architecture.
sidebar_position: 1
---

# Architecture

Web3Signer is a remote signing client comprised of three main components:

- Remote signer
- Slashing database
- APIs

## The remote signer

The remote signer [loads private keys](../how-to/load-keys.md) into memory and responds to signature requests.
If you are using a [vault](../how-to/store-keys/vaults/_category_.json) for execution layer signing, the keys stay at rest.
This component communicates with the slashing database, the APIs, and the keystore (if used), to coordinate remote signing.

## The slashing database

The [slashing database](./slashing-protection.md) is a Postgres database that tracks which keys have signed messages.
Database locking ensures that when multiple Web3Signer instances load the same keys, only one instance is permitted to sign.

## The APIs

Web3Signer supports REST and [JSON-RPC APIs](../reference/api/_category_.json) to sign consensus layer and execution layer payloads
respectively. These connections should be carefully secured. Web3Signer offers [TLS communication](../how-to/configure-tls.md).
