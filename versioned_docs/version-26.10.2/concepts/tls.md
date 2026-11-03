---
description: Learn about secure communication using TLS in Web3Signer.
sidebar_position: 3
---

# TLS communication

Web3Signer supports TLS to secure inbound and outbound HTTP JSON-RPC requests, and communication
with HashiCorp Vault.

Private keys and certificates for client and server TLS connections must be stored in
password-protected PKCS #12 keystores.
You must configure the server (in this example, [Besu](https://besu.hyperledger.org/)) to accept TLS connections.

Use the command line options to configure TLS on [HTTP JSON-RPC requests](../how-to/configure-tls.md)
and [HashiCorp Vault](../how-to/store-keys/vaults/hashicorp.md).
