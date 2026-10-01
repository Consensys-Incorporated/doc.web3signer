---
description: Learn how Web3Signer is structured, where keys live, and how instances coordinate.
sidebar_position: 1
keywords: [remote signing, slashing protection database, high availability]
---

# Architecture

Web3Signer is a signing service that holds private keys and signs payloads on request, so the
clients that need signatures, and the machines hosting them, can run at a lower level of trust than
the signer.
It starts in one of two modes, and each mode serves one layer of Ethereum.

## Signing modes

| Mode | Signing keys | Layer | API | Slashing protection |
| --- | --- | --- | --- | --- |
| [`eth2`](../reference/cli/subcommands.md#eth2) | BLS12-381 | Consensus layer | [REST](../reference/api/rest.md) | Enabled by default |
| [`eth1`](../reference/cli/subcommands.md#eth1) | secp256k1 | Execution layer | [JSON-RPC](../reference/api/json-rpc.md), [REST](../reference/api/rest.md) | Not applicable |

Each Web3Signer process runs in a single mode.
Signing for both layers requires one instance per mode.

In `eth2` mode, Web3Signer signs consensus layer payloads with BLS12-381 keys.
It is the endpoint your validator client talks to over the [REST API](../reference/api/rest.md), and
it signs blocks, attestations, and sync committee messages.
Signatures that carry slashing risk are checked and recorded in a
[slashing protection](./slashing-protection.md) database, which is enabled by default and shared by
every instance signing for the same validators.

In `eth1` mode, Web3Signer signs execution layer payloads with secp256k1 keys.
It does two jobs:

- JSON-RPC proxy. Web3Signer implements the
  [JSON-RPC signing methods](../reference/api/json-rpc.md) and forwards every other
  request to your execution client.
  Your application sends its calls to Web3Signer and never holds a key.
- REST signing. Web3Signer signs data you supply over the
  [REST API](../reference/api/rest.md).
  Callers name the key by its secp256k1 public key.
  JSON-RPC calls name the same key by its Ethereum address.
  This endpoint needs no execution client.

Slashing protection does not apply, because only consensus layer duties are slashable.

<p align="center">

![eth2 column from the validator client through the consensus REST API to the slashing protection database, and eth1 column from the application through execution signing, with JSON-RPC forwarded to the execution client. The key store and loaded keys are shared.](/img/architecture.svg)

</p>

## Shared components

Both modes share the same core.
Web3Signer loads its keys from a key store at startup, and stores nothing else locally.
Because an instance keeps no durable state of its own, you can replace an instance at any time, and
you can run several instances at once.

## What Web3Signer checks before signing

### Consensus signing

A consensus signing request carries the payload to sign and its fork information, not a bare hash.
The request can also include a signing root, but Web3Signer computes the signing root from the
payload rather than trusting the supplied value, and rejects the request when the two disagree.
A client cannot obtain a signature over data that Web3Signer has not inspected.

Block and attestation requests then pass the slashing protection check, and Web3Signer returns the
signature only if that check succeeds.
Other payload types, such as sync committee messages and voluntary exits, are signed without a
database check, because those duties carry no slashing risk.

### Execution layer signing

`eth1` mode checks that the request names a key Web3Signer has loaded.
Web3Signer returns an error when the key is missing.
It does not inspect the data it signs.

What Web3Signer signs depends on the request:

- A transaction is built from the fields in the request and the chain ID set by
  [`--chain-id`](../reference/cli/subcommands.md#chain-id).
  When [`eth_sendTransaction`](../reference/api/json-rpc.md#eth_sendtransaction) omits a nonce,
  Web3Signer fills it in from the execution client.
- [`eth_sign`](../reference/api/json-rpc.md#eth_sign) signs the message in the request.
- The REST endpoint signs the `data` you supply.
  The request field `applyHash` defaults to `true` and hashes `data` with Keccak-256 before
  signing.
  Set `applyHash` to `false` to sign a 32-byte digest unchanged.

## Where signing keys live

Web3Signer works with a key store in one of two ways, and the difference determines where your
private keys can be exposed.

- **Web3Signer loads the key.**
  Raw key files, keystore files, HashiCorp Vault, Azure Key Vault secrets, AWS Secrets Manager, and
  GCP Secret Manager supply the private key.
  Web3Signer fetches or decrypts the key at startup and holds it in memory for the life of the
  process.
- **The key stays in the key store.**
  Azure Key Vault keys and AWS KMS never release the private key.
  Web3Signer holds only the public key and sends each signing operation to the key store.
  Both options apply to execution layer signing only (`eth1` mode).

Consensus layer signing always loads the private key into memory.
A vault protects your BLS12-381 keys at rest and in transit, but Web3Signer must hold them in memory
to sign, so treat the host that runs Web3Signer as sensitive no matter where you
[store your keys](../how-to/store-keys/index.md).

Web3Signer reads its key configuration at startup.
To change the loaded keys on a running instance, use the reload endpoint or the
[key manager API](../how-to/manage-keys.md).

## Running multiple instances

Web3Signer can run as several instances behind a load balancer.
The following example shows multiple instances in `eth2` mode, with every instance connected to the
same slashing protection database.

<p align="center">

![Three Web3Signer instances in eth2 mode behind a load balancer, sharing one slashing protection database](/img/multiple-instances.svg)

</p>

Every instance is active and signs the requests the load balancer sends it.
The instances never communicate with each other, and no instance is elected to sign on behalf of the
others.
The database provides the safety guarantee.
When two instances hold the same keys and receive conflicting requests for the same validator, the
database serializes those requests, so the second request is checked against the entry that the
first request recorded, and is refused.

The shared database is therefore a requirement rather than a convenience.
Instances that use separate databases hold separate views of signing history and can sign
conflicting messages for the same validator.

For sizing, load balancing, and tuning guidance, see
[run Web3Signer at scale](../how-to/run-at-scale.md).

## Access to the signing API

Web3Signer does not check which client is asking for which key.
If a request reaches the signing port and names a key the instance loaded, Web3Signer signs it.
There is no permission model behind the API, so restricting who can connect to the port is your
main control.

Web3Signer listens on `localhost` by default, so only processes on the same machine can reach the
API until you set [`--http-listen-host`](../reference/cli/options.md#http-listen-host).
It also rejects any request whose `Host` header is not in the
[`--http-host-allowlist`](../reference/cli/options.md#http-host-allowlist), which allows only
`localhost` and `127.0.0.1` by default.
The reload endpoint and the key manager API share this port with the signing endpoints, so access to
the port grants access to all of them.
[Metrics](../how-to/monitor/metrics.md) use a separate port and are disabled by default.

Web3Signer supports [TLS](./tls.md) to encrypt these connections, and client certificates to
restrict signing to known clients.

## Failure modes

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
