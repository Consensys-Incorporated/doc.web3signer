---
title: Load Launchpad keystores
description: Load keystores generated using the consensus layer Launchpad tool.
sidebar_position: 1
---

# Load Launchpad keystores

The Staking Launchpad tool is used to create validators that participate in the consensus layer
proof-of-stake network. The tool generates an encrypted keystore file containing the validator details.
Load this keystore into Web3Signer to sign attestations and blocks with the validator details.

This tutorial uses Teku and Web3Signer to run validators created on the `holesky` testnet.

**Prerequisites**:

- [Teku installed].
- [Web3Signer installed].
- Web3Signer [slashing protection database].

## 1. Sync the Teku beacon node

Sync the Teku beacon chain node before submitting your deposit to avoid incurring inactivity
penalties if the validator is unable to perform its duties when the deposit is processed and activated.

```bash
teku --network=holesky --metrics-enabled --rest-api-enabled
```

## 2. Generate validators

This step generates a validator on the `holesky` testnet.
Use the [Holeksy Staking Launchpad](https://holesky.launchpad.ethereum.org/en/) and follow the
step-by-step process to deposit your funds and generate the keystore.

The process includes installing the consensus layer deposit CLI tool, to generate your validator
keystores locally.
Keystores are generated in the `eth2deposit-cli-<version>/validator_keys` folder.
In this example we generated a keystore named `keystore-m_12381_3600_0_0_0-1606109670.json`

:::caution important
Remember the password used to create the keystore because you'll need it later.
:::

## 3. Create password file

Create a plain text file that stores the password to decrypt the keystore.
In this example we create the `keystore-m_12381_3600_0_0_0-1606109670.txt` file in the
`eth2deposit-cli-<version>/validator_keys` directory:

```txt title="keystore-m_12381_3600_0_0_0-1606109670.txt"
validatorPassword
```

:::note
If using Linux or macOS, we recommend setting the file ownership and permission to `400` for
the user running Web3Signer.
:::

## 4. Create the key configuration file

Create a [key configuration file] for each keystore file.
The key configuration file defines the type of signing key being used, and access details.
Store all key configuration files in a single directory.
In this example, the files are stored in `Users/me/keys`:

```yaml title="validator.yaml"
type: "file-keystore"
keystoreFile: "/Users/me/eth2deposit-cli-ed5a6d3-darwin-amd64/validator_keys/validator_keys/keystore-m_12381_3600_0_0_0-1606109670.json"
keystorePasswordFile: "/Users/me/eth2deposit-cli-ed5a6d3-darwin-amd64/validator_keys/validator_keys/keystore-m_12381_3600_0_0_0-1606109670.txt"
```

:::caution important
The configuration files must be YAML-formatted.
You can use any naming format, but it must have the `.yaml` extension.
:::

## 5. Start Web3Signer

Start Web3Signer and specify the location of the key configuration files and [slashing protection database].

```bash
web3signer --key-store-path=/Users/me/keys eth2 --network=holesky --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" --slashing-protection-db-username=postgres --slashing-protection-db-password=password
```

:::note
Set the [`--slashing-protection-enabled`](../reference/cli/subcommands.md#slashing-protection-enabled)
`eth2` subcommand option to `false` to disable slashing protection.
However, we don't recommend this on Mainnet.
:::

## 5. Start Teku

Start Teku and specify the public keys of the validators that Web3Signer signs attestations and
blocks for, and specify the Web3Signer address.

```bash
teku --network=holesky \
--eth1-endpoint=http://localhost:8545 \
--validators-external-signer-public-keys=0xa99a...e44c,0xb89b...4a0b \
--validators-external-signer-url=http://localhost:9000
```

<!-- links -->

[Teku installed]: https://docs.teku.consensys.net/get-started/install/install-binaries
[Web3Signer installed]: ../get-started/install-binaries.md
[slashing protection database]: ../how-to/configure-slashing-protection.md
[key configuration file]: ../reference/key-config-file-params.md
