---
description: Learn how Web3Signer slashing protection uses signing history and watermarks.
sidebar_position: 2
keywords: [slashing protection, watermark, EIP-3076, slashing protection database]
---

# Slashing protection

[Slashing](https://ethereum.org/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/#slashing)
reduces a validator's stake and removes it from the active set when the validator signs
conflicting messages.
Web3Signer provides slashing protection by recording each signed block and attestation, and refusing
a request that would be slashable, or that falls outside the [signing range](#watermarks) (watermark).

A record stores the validator, the slot or epochs, and the signing root.
The signing root is the hash of the message that was signed.

:::note
Web3Signer signs other consensus layer payloads, including sync committee messages, without
recording them or refusing them.
:::

Slashing protection is enabled by default, and Web3Signer stores those records in a PostgreSQL
database.
Web3Signer needs that database while slashing protection is enabled.
[Configure slashing protection](../how-to/configure-slashing-protection.md) or set
[`--slashing-protection-enabled`](../reference/cli/subcommands.md#slashing-protection-enabled)
to `false` to run without it.

## Watermarks

The database also stores two watermarks: low watermark and high watermark.
A watermark is a saved slot or epoch number.
Web3Signer refuses to sign before the low watermark, or from the high watermark onward.

Web3Signer sets an empty low watermark from the first block or attestation that the validator signs.
The high watermark stays empty until you set it.
Until set, Web3Signer does not stop signing at any slot or epoch.
Change either value with [`watermark-repair`](../reference/cli/subcommands.md#watermark-repair).
A low watermark can be raised and cannot be lowered.

### Low watermark

Set the low watermark at a future slot and epoch when Web3Signer takes over from another signer.
Stop that signer at the same point, and [import its history](#exporting-and-importing-signing-history).
[Pruning the database](#pruning-the-database) also raises the low watermark.

Web3Signer stores a low watermark for each validator in the slashing protection database.
That low watermark is a block slot, an attestation source epoch, and an attestation target epoch.
A request at the saved slot or epoch is still eligible.

### High watermark

Set the high watermark at a future slot and epoch when this Web3Signer must stop, such as when
its keys move to another signer.
Signing stays stopped until you remove it.
For a handover, set the outgoing signer's high watermark and the incoming signer's low watermark
to the same slot and epoch.

The high watermark is one slot and one epoch for the whole database, and it applies to every
validator.
Web3Signer refuses a request at that point even when no conflicting signature is stored.

## Slashing protection database

The database is the only record of signed messages and watermarks.
Instances that sign for the same validators must share it.
See [running multiple instances](./architecture.md#running-multiple-instances).

If the database cannot be reached, block and attestation requests fail instead of being signed.
If you lose the database, or replace it with an older copy, Web3Signer can sign a message it no
longer has on record.

### Exporting and importing signing history

Export the signing history when you move a validator from a validator client to Web3Signer, from
Web3Signer to a validator client, or from one Web3Signer database to another.
Import that history into the signer that takes over.
Web3Signer uses the slashing protection interchange format version 5 defined in
[EIP-3076](https://eips.ethereum.org/EIPS/eip-3076).

For import and export steps, see
[Import or export a slashing protection database](../how-to/configure-slashing-protection.md#import-or-export-a-slashing-protection-database).

### Pruning the database

The database grows with every new block and attestation.
[Pruning](../how-to/configure-slashing-protection.md#prune-the-slashing-protection-database)
raises the low watermark, then deletes signed blocks and attestations earlier than that
watermark.
