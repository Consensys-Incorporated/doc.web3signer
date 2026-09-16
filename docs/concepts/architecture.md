---
description: Learn how Web3Signer is structured, where keys live, and how instances coordinate.
sidebar_position: 1
keywords: [remote signing, slashing protection database, high availability]
---

# Architecture

Web3Signer is a signing service that holds validator keys and signs payloads on request.
Clients send a signing request over HTTP and receive a signature in response.
The private keys stay in Web3Signer, so you can run validator clients, and the machines that host
them, at a lower level of trust than the signer.

Each instance keeps its loaded keys in memory and stores nothing else locally.
The only persistent component is the [slashing protection](./slashing-protection.md) database, which
every instance signing for the same validators shares.
Because Web3Signer holds no durable state of its own, you can replace an instance at any time, and
you can run several instances at once.

Web3Signer loads its keys from a key store, and records consensus signing history in the slashing
protection database.
For execution layer signing, it also sits in front of an execution client and forwards the requests
it does not sign.
Your application sends its JSON-RPC calls to Web3Signer instead of to the execution client, and
receives the same responses, without ever holding a key.

<p align="center">

![Web3Signer components and the systems it connects to](/img/architecture.svg)

</p>

## Signing modes

Web3Signer starts in one of two modes, and each mode serves one layer of Ethereum.

| Mode | Signing keys | Layer | API | Slashing protection |
| --- | --- | --- | --- | --- |
| [`eth2`](../reference/cli/subcommands.md#eth2) | BLS12-381 | Consensus layer | [REST](../reference/api/rest.md) | Enabled by default |
| [`eth1`](../reference/cli/subcommands.md#eth1) | secp256k1 | Execution layer | [JSON-RPC](../reference/api/json-rpc.md), [REST](../reference/api/rest.md) | Not applicable |

Each Web3Signer process runs in a single mode.
Signing for both layers requires one instance per mode.

The modes differ in more than the signing algorithm.
In `eth2` mode, Web3Signer is the endpoint your validator client talks to, and it signs consensus
payloads such as blocks, attestations, and sync committee messages.
In `eth1` mode, Web3Signer signs execution layer payloads and forwards the remaining JSON-RPC
requests to your execution client.

Slashing protection applies only to `eth2` mode, because only consensus layer duties are slashable.

## What Web3Signer checks before signing

A consensus signing request carries the payload to sign and its fork information, not a bare hash.
The request can also include a signing root, but Web3Signer computes the signing root from the
payload rather than trusting the supplied value, and rejects the request when the two disagree.
A client cannot obtain a signature over data that Web3Signer has not inspected.

Block and attestation requests then pass the slashing protection check, and Web3Signer returns the
signature only if that check succeeds.
Other payload types, such as sync committee messages and voluntary exits, are signed without a
database check, because those duties carry no slashing risk.

## Where signing keys live

Web3Signer works with a key store in one of two ways, and the difference determines where your
private keys can be exposed.

### Web3Signer loads the key

Raw key files, keystore files, HashiCorp Vault, Azure Key Vault secrets, AWS Secrets Manager, and
GCP Secret Manager all supply the private key to Web3Signer.
Web3Signer fetches or decrypts the key at startup and holds it in memory for the life of the
process.

### The key stays in the key store

Azure Key Vault keys and AWS KMS never release the private key.
Web3Signer holds only the public key and sends each signing operation to the key store.
Both options apply to execution layer signing only.

Consensus layer signing always uses the first model.
A vault protects your BLS12-381 keys at rest and in transit, but Web3Signer must hold them in memory
to sign, so treat the host that runs Web3Signer as sensitive no matter where you
[store your keys](../how-to/store-keys/index.md).

Web3Signer reads its key configuration at startup.
To change the loaded keys on a running instance, use the reload endpoint or the
[key manager API](../how-to/manage-keys.md).

## Running multiple instances

Web3Signer is designed to run as several instances behind a load balancer, with every instance
connected to the same slashing protection database.

<p align="center">

![Three Web3Signer instances behind a load balancer, sharing one slashing protection database](/img/multiple-instances.svg)

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
