---
description: Understand TLS connections, certificate trust, and transport security in Web3Signer.
sidebar_position: 3
---

# TLS communication

Transport Layer Security (TLS) encrypts communication and helps peers verify who they are
connecting to. Web3Signer has different roles depending on the connection: it receives signing
requests from clients, but connects as a client to downstream services. The relevant settings and
trust decisions differ for each connection.

## Inbound: clients connecting to Web3Signer

A validator client calls Web3Signer's **consensus layer REST signing API**. Web3Signer can also
receive execution layer JSON-RPC requests. In both cases, Web3Signer is the TLS server, not the
validator client or execution node.

Web3Signer uses a password-protected PKCS #12 keystore for its TLS certificate and private key.
Configure it with
[`--tls-keystore-file`](../reference/cli/options.md#tls-keystore-file) and
[`--tls-keystore-password-file`](../reference/cli/options.md#tls-keystore-password-file).

The choice of which clients to trust matters for a service that can sign with validator keys:

- **Known clients:** [`--tls-known-clients-file`](../reference/cli/options.md#tls-known-clients-file)
  lists allowed client certificate Common Names and SHA-256 fingerprints. This lets the operator
  trust specific certificates, including self-signed ones.
- **CA-signed clients:** [`--tls-allow-ca-clients`](../reference/cli/options.md#tls-allow-ca-clients)
  accepts client certificates chaining to a CA in the Java trust store. This can include public
  CAs, not just certificates issued for your validator infrastructure.
- **Any client:** [`--tls-allow-any-client`](../reference/cli/options.md#tls-allow-any-client)
  allows clients to connect without restricting them to the known-clients list. It cannot be
  combined with the other two client-trust options.

:::warning

For a signing service, consider restricting access to specifically trusted client certificates
rather than permitting broad CA trust or any client. TLS client trust does **not** impose
per-key authorization: see [Web3Signer's architecture](./architecture.md) for the distinction
between access to the signing API and access to loaded signing keys.

:::

See [Configure TLS](../how-to/configure-tls.md) for the known-clients file and setup steps.

## Outbound: Web3Signer connecting to an execution node

In `eth1` mode, Web3Signer can connect over TLS to a downstream execution node such as Besu,
using HTTP JSON-RPC. Here, **Web3Signer is the TLS client**; the downstream node must separately
be configured to accept TLS connections.

[`--downstream-http-tls-enabled`](../reference/cli/subcommands.md#downstream-http-tls-enabled)
enables this connection. The optional client keystore and its password are configured with
[`--downstream-http-tls-keystore-file`](../reference/cli/subcommands.md#downstream-http-tls-keystore-file)
and
[`--downstream-http-tls-keystore-password-file`](../reference/cli/subcommands.md#downstream-http-tls-keystore-password-file).
[`--downstream-http-tls-known-servers-file`](../reference/cli/subcommands.md#downstream-http-tls-known-servers-file)
identifies trusted servers by host, port, and certificate fingerprint.

[`--downstream-http-tls-ca-auth-enabled`](../reference/cli/subcommands.md#downstream-http-tls-ca-auth-enabled)
defaults to `true`, allowing certificates trusted by the Java trust store **even when a known
servers file is set**. Set it to `false` to accept only the pinned server fingerprints. This is a
different trust choice from inbound client authentication.

## Outbound: Web3Signer connecting to HashiCorp Vault

The TLS configuration for HashiCorp Vault is specified **per signing-key configuration**, using
[`tlsEnabled` and `tlsKnownServersPath`](../reference/key-config-file-params.md#hashicorp-vault).
The known-servers file contains host, port, and SHA-256 certificate fingerprints.

Unlike the execution-node connection, this Vault configuration does **not** offer an option to
disable acceptance of certificates trusted by the Java trust store. A known-servers file alone
does not enforce exclusive fingerprint pinning. See
[Store keys in HashiCorp Vault](../how-to/store-keys/vaults/hashicorp.md) for details.

## Certificates, rotation, and limits

The PKCS #12 keystores above store local TLS certificate material; known-clients and
known-servers files describe which **remote peers** are trusted. If a peer's certificate changes,
review and update the corresponding fingerprints or CA trust configuration. If Web3Signer's own
certificate changes, update its keystore and password file as needed. Coordinate changes on both
ends and confirm whether your deployed version requires a restart; do not assume certificates or
trust files are hot-reloaded.

TLS protects traffic **in transit**. It does not replace authorization for signing requests,
protect signing keys in process memory, or make a compromised host safe. The PostgreSQL connection
used for [slashing protection](../how-to/configure-slashing-protection.md) is a separate channel,
configured through a database JDBC URL rather than these HTTP TLS flags.
