---
description: Learn how Web3Signer is structured, where keys live, and how instances coordinate.
sidebar_position: 1
keywords: [remote signing, slashing protection database, high availability]
---

# Architecture

Web3Signer is a signing service that uses private keys to sign payloads on request, so the
clients that need signatures, and the machines hosting them, can run at a lower level of trust than
the signer.

## Signing modes

Web3Signer runs in one of two signing modes, and each mode serves one layer of Ethereum.
Signing for both layers requires one instance per mode.

| Mode | Signing keys | Layer | API | Slashing protection |
| --- | --- | --- | --- | --- |
| [`eth2`](../reference/cli/subcommands.md#eth2) | BLS12-381 | Consensus layer | [REST](../reference/api/rest.md) | Enabled by default |
| [`eth1`](../reference/cli/subcommands.md#eth1) | secp256k1 | Execution layer | [JSON-RPC](../reference/api/json-rpc.md), [REST](../reference/api/rest.md) | Not applicable |

### `eth2` mode (consensus layer)

In `eth2` mode, Web3Signer signs consensus layer payloads with BLS12-381 keys.
Your validator client sends requests over the [REST API](../reference/api/rest.md) to sign blocks,
attestations, and sync committee messages.
Web3Signer computes what it signs from the full payload, so a client can't obtain a signature over
data that Web3Signer hasn't checked.
Signatures that carry slashing risk are checked and recorded in a
[slashing protection](./slashing-protection.md) database, which is enabled by default and shared by
every instance signing for the same validators.

<p align="center">

![A Web3Signer instance in eth2 mode. The validator client sends REST requests to the consensus REST API, which signs with keys loaded from the key store and records signatures in the slashing protection database.](/img/architecture-eth2.svg)

</p>

### `eth1` mode (execution layer)

In `eth1` mode, Web3Signer signs execution layer payloads. It does two jobs:

- JSON-RPC proxy. Web3Signer implements the
  [JSON-RPC signing methods](../reference/api/json-rpc.md) and forwards every other
  request to your execution client.
  Your application sends its calls to Web3Signer and never holds a key.
  JSON-RPC calls identify the key by its Ethereum address.
- REST signing. Web3Signer signs data you supply over the
  [REST API](../reference/api/rest.md).
  Callers identify the key by its secp256k1 public key.
  This endpoint needs no execution client.

Web3Signer doesn't inspect the data it signs in `eth1` mode.
Slashing protection does not apply, because only consensus layer duties are slashable.

<p align="center">

![A Web3Signer instance in eth1 mode. The application sends JSON-RPC and REST signing requests to the execution signing API, which uses keys from the key store and forwards other JSON-RPC calls to the execution client.](/img/architecture-eth1.svg)

</p>

## Where signing keys live

Web3Signer works with a key store in one of two ways, and the choice determines whether your
private keys are held in Web3Signer's memory or stay inside the key store.

- **Web3Signer loads the private key from the key store.**
  Raw key files, keystore files, HashiCorp Vault, Azure Key Vault secrets, AWS Secrets Manager, and
  GCP Secret Manager work this way.
  Web3Signer fetches or decrypts the key at startup and holds it in memory for the life of the
  process.
- **The private key stays in the key store.**
  Azure Key Vault keys and AWS KMS work this way.
  Web3Signer holds only the public key and sends each signing operation to the key store.
  These key stores support execution layer signing only (`eth1` mode).

Consensus layer signing always loads the private key into memory.
A vault protects your BLS12-381 keys at rest and in transit, but Web3Signer must hold them in memory
to sign, so treat the host that runs Web3Signer as sensitive no matter where you
[store your keys](../how-to/store-keys/index.md).

Web3Signer reads its key configuration at startup.
To change the loaded keys on a running instance, use the
[reload endpoint](../how-to/manage-keys.md#reload-new-keys) or, in `eth2` mode, the
[key manager API](../how-to/manage-keys.md#manage-keys-using-key-manager-api).

## Running multiple instances

Web3Signer keeps no durable state of its own.
It loads keys from a key store and, in `eth2` mode, records signing history in an external
slashing protection database.
You can therefore replace an instance at any time, or run several instances behind a load balancer.
The following example shows multiple instances in `eth2` mode, with every instance connected to the
same slashing protection database.

<p align="center">

![Three Web3Signer instances in eth2 mode behind a load balancer, sharing one slashing protection database](/img/multiple-instances.svg)

</p>

Every instance is active and signs the requests the load balancer sends it.
The instances never communicate with each other, and no instance is elected to sign on behalf of the
others.
The database provides the safety guarantee.
When two instances load the same keys and receive requests for the same validator, the database
serializes those requests, so each request is checked against the signing history already recorded.
A request that conflicts with a recorded signature is refused.
A request identical to one already signed is signed again, because repeating a signature carries no
slashing risk.

Instances that load the same keys must share one slashing protection database.
Instances that use separate databases hold separate views of signing history and can sign
conflicting messages for the same validator.
Instances that load different keys don't need to share a database.

For sizing, load balancing, and tuning guidance, see
[run Web3Signer at scale](../how-to/run-at-scale.md).

## Controlling access to Web3Signer

Web3Signer doesn't limit which loaded keys a client can use.
If a request reaches the signing API and names a key the instance loaded, Web3Signer signs it.
To protect your keys, [restrict which clients can reach the API](../get-started/key-best-practices.md).

Web3Signer listens on `localhost` by default, so only processes on the same machine can reach the
API until you set [`--http-listen-host`](../reference/cli/options.md#http-listen-host).
It also rejects any request whose `Host` header is not in the
[`--http-host-allowlist`](../reference/cli/options.md#http-host-allowlist), which allows only
`localhost` and `127.0.0.1` by default.
The reload endpoint and the key manager API share this port with the signing endpoints, so access to
the port grants access to all of them.
[Metrics](../how-to/monitor/metrics.md) use a separate port and are disabled by default.

Use [TLS](../how-to/configure-tls.md) to encrypt connections, and client certificates to accept
only trusted clients.
With or without TLS, Web3Signer doesn't limit which loaded keys a client can use.

## Monitoring and recovery

Three behaviors are worth knowing before you plan monitoring and recovery:

- When a key fails to load, Web3Signer skips that key, starts as normal, and serves the keys it did
  load, so a partly loaded instance looks healthy from the outside.
- When the slashing protection database is unreachable, block and attestation requests fail instead
  of being signed without a check, so availability of the database is part of the availability of
  your signing service.
- When an instance restarts, it reloads every key from its original source, so startup time grows
  with the number of keys you load.
  Signing history survives the restart because it lives in the database rather than in the instance.

The `/healthcheck` endpoint reports the status of key loading and of the slashing protection
database, so it tells you whether an instance loaded everything you expect and can reach the
database.
