---
description: Learn how slashing protection works in Web3Signer.
sidebar_position: 2
---

# Slashing protection

Slashing refers to penalties that are applied to consensus layer validators that sign conflicting
blocks or attestations.

Web3Signer provides slashing protection to prevent validators from signing blocks and attestations
based on what it knows has already been signed.
A slashing protection database records each block and attestation signed by a validator.

Slashing protection is enabled by default, and you are responsible for [creating and maintaining]
the required PostgreSQL database, or you can disable slashing protection by setting
[`--slashing-protection-enabled`](../reference/cli/subcommands.md#slashing-protection-enabled) to `false`.

:::info

Web3Signer only supports PostgreSQL for creating the slashing protection database.

:::

Multiple Web3Signer instances can connect to the same slashing protection database.
Every instance signs, and the shared database keeps them consistent.
When instances that load the same keys receive conflicting requests for the same validator, the
database serializes those requests, so only the first request is signed.
For more information, see
[running multiple instances](./architecture.md#running-multiple-instances).

<!--links-->

[creating and maintaining]: ../how-to/configure-slashing-protection.md
