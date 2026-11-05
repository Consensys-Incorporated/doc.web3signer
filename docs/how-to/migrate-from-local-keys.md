---
title: Migrate from local validator keys to Web3Signer
description: Migrate a validator from local signing keys to Web3Signer, including slashing protection history import and safe cutover.
sidebar_position: 7
---

# Migrate from local validator keys to Web3Signer

Migrate a consensus layer validator from signing with local keys to signing through
[Web3Signer]. This guide connects the individual documented steps into one sequence:
exporting slashing protection history, importing it into Web3Signer, loading the keys,
reconfiguring the validator client, and cutting over safely.

:::caution Important
Migration is the highest-risk moment in adopting Web3Signer. A validator that starts
signing with Web3Signer before its previous setup has fully stopped, or that moves
across without its signing history, risks a slashing penalty. Work through the steps
in order, and do not skip the cutover checks.
:::

## Before you start

Confirm the following before making any change:

- Web3Signer is installed and you can reach its [command line options].
- A PostgreSQL slashing protection database is available for Web3Signer, with the
  schema loaded. See [Configure slashing protection].
- You have the validator's signing keys available in a form Web3Signer can load
  (keystore files, or a supported vault). See [Load signing keys].
- Your validator client supports exporting slashing protection data in the
  [validator client interchange format] (EIP-3076). EIP-3076 is in Last Call status,
  not Final, so check the current specification before relying on a specific field.
- You can stop the validator client, or at least stop it from signing, for the duration
  of the migration.

## Step 1: Export slashing protection history

Export the validator's existing signing history from the validator client, in the
[EIP-3076 interchange format]. This history records what the validator has already
signed, which Web3Signer needs in order to avoid signing a conflicting block or
attestation.

Use your validator client's own documentation for the exact export command and flags,
because those change without notice. Linking outward keeps this guide accurate.

The result is a JSON file you keep for the next step (commonly named
`interchange.json`).

:::note
Do not delete or overwrite the exported file until the migration is verified.
:::

## Step 2: Import the history into Web3Signer

Import the exported interchange file into the Web3Signer slashing protection database
using the [`eth2 import`] subcommand. Additional entries are added to the existing
database; nothing is removed.

```bash
web3signer eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
  --slashing-protection-db-username=postgres \
  --slashing-protection-db-password=password \
  import --from=/path/to/interchange.json
```

Supply the PostgreSQL connection details for your own database. If the database uses a
non-default port, include the port number in the database URL.

## Step 3: Load the validator keys into Web3Signer

Place the validator's signing keys where Web3Signer can find them, and start
Web3Signer pointing at the key store and the slashing protection database.

Using a key configuration directory:

```bash
web3signer --key-store-path=/path/to/keyFiles/ eth2 \
  --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
  --slashing-protection-db-username=postgres \
  --slashing-protection-db-password=password
```

Alternatively, bulk load keys using the [`eth2` subcommand options], or use a supported
vault (Hashicorp Vault, Azure Key Vault, AWS Secrets Manager, AWS KMS, GCP Secret
Manager). See [Load signing keys] for the full set of options.

:::note
Web3Signer must be running and able to sign before you reconfigure the validator
client. Confirm it is healthy (for example, via the slashing protection database
health check) before continuing.
:::

## Step 4: Reconfigure the validator client to use the remote signer

Point the validator client at Web3Signer instead of its local keys. The validator client
now asks Web3Signer to sign, and Web3Signer consults the slashing protection database
before signing.

The exact option depends on the validator client. Consult your client's documentation
for how to enable an external signer or remote signer, and provide the Web3Signer URL
and the public keys to sign for. Link outward rather than restating client flags, because
those change without notice.

Only configure the keys that are now loaded in Web3Signer. Do not leave the same keys
configured for local signing in another process.

## Step 5: Cutover

1. Stop the previous signing setup completely. This includes any other validator client
   process, backup signer, or watchtower that could sign for the same keys.
2. Confirm nothing else is signing for those keys: check running processes, and check
   the validator client logs for signing activity.
3. Start the reconfigured validator client.
4. Watch the first few duties (attestations, proposals) complete without errors.

Do not run the old and new setups in parallel. Both signing for the same keys, even
briefly, is the condition that causes a slashing penalty.

## Step 6: Verify the migration

After the cutover:

- Confirm Web3Signer is signing successfully for the validator (no errors in the
  Web3Signer logs).
- Confirm duties are being performed on chain as expected.
- Export the Web3Signer slashing protection database to a file using
  [`eth2 export`], and confirm it contains the expected signing history. Keep this
  export as a backup.

```bash
web3signer eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
  --slashing-protection-db-username=postgres \
  --slashing-protection-db-password=password \
  export --to=/path/to/backup-interchange.json
```

## After data loss or a restore to an earlier state

If the slashing protection database is lost, or restored to an earlier point in time,
Web3Signer no longer knows what has already been signed. The recovery sequence, and
any waiting period before resuming signing, is specific to validator behaviour and must
be confirmed with a maintainer before publishing. Do not infer a procedure from
PostgreSQL documentation alone.

If you are in this situation, open an issue or contact the Web3Signer maintainers and
do not resume signing until the recovery steps are confirmed.

## Related pages

- [Configure slashing protection]
- [Load signing keys]
- [Manage keys]
- [Run Web3Signer at scale]

<!-- links -->

[Web3Signer]: https://github.com/Consensys-Incorporated/web3signer
[command line options]: ../reference/cli/options.md
[Configure slashing protection]: ./configure-slashing-protection.md
[Load signing keys]: ./load-keys.md
[Manage keys]: ./manage-keys.md
[Run Web3Signer at scale]: ./run-at-scale.md
[validator client interchange format]: https://eips.ethereum.org/EIPS/eip-3076
[EIP-3076 interchange format]: https://eips.ethereum.org/EIPS/eip-3076
[`eth2 import`]: ../reference/cli/subcommands.md#eth2-import
[`eth2` subcommand options]: ../reference/cli/subcommands.md#eth2
[`eth2 export`]: ../reference/cli/subcommands.md#eth2-export
