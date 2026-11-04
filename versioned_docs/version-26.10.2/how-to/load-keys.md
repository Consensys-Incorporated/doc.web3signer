---
title: Load signing keys
description: Load BLS12-381 and secp256k1 signing keys.
sidebar_position: 3
---

# Load signing keys

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Supported from '@site/src/components/Supported';

Load signing keys using a [key configuration file], or bulk load using the [`eth1` and `eth2` subcommands].
Web3Signer supports loading keys with the following methods:

| Key storage                          | Key configuration file | Bulk load with `eth1` | Bulk load with `eth2` |
|--------------------------------------|:----------------------:|:---------------------:|:---------------------:|
| [Keystore files]                     |      <Supported />     |      <Supported />     |      <Supported />     |
| **Vaults**                           |                        |                       |                       |
| [Hashicorp Vault]                    |      <Supported />     |                       |                       |
| [Azure Key Vault]                    |      <Supported />     |      <Supported />     |      <Supported />     |
| [AWS Secrets Manager]                |      <Supported />     |                       |      <Supported />     |
| [AWS KMS]                            |      <Supported />     |      <Supported />     |                       |
| [GCP Secret Manager]                 |                        |                       |      <Supported />     |

:::note
You can bulk load in combination with using key configuration files.
:::

## Use key configuration files

For each signing key, define the parameters to access the key in a [key configuration file].
You can create a separate configuration file for each key, or specify multiple configurations in a
single file by adding a triple-dash separator (`---`) between configurations.

The configuration file must be YAML-formatted, and can use any naming format, but must have the `.yaml` extension.

Place one or more key configuration files in a single directory which you specify when starting Web3Signer.
Use the [`--key-store-path`](../reference/cli/options.md#key-config-path-key-store-path) option to specify the
location of the key configuration files.

```bash
web3signer --key-store-path=/Users/me/keyFiles/ eth2
```

## Bulk load keys

### Azure Key Vault

You can bulk load keys that are stored in Azure Key Vault using the Web3Signer
[`eth1` subcommand options](../reference/cli/subcommands.md#eth1) or
[`eth2` subcommand options](../reference/cli/subcommands.md#eth2).

For `eth1` bulk loading, Web3Signer creates Azure keys connections in bulk mode. The Azure keys
connections are used to perform remote signing using SECP keys. Web3Signer does not download the private keys
for `eth1` bulk loading with Azure.

For `eth2` bulk loading, Web3Signer bulk loads the BLS keys from Azure Secrets. The bulk loading
mode supports loading multiple consensus layer keys from the same Azure secret, if keys are stored with a line
terminating character such as `\n`.
This saves cost when dealing with a large number of keys.
Up to 200 keys can be stored under a secret name.

<Tabs>

  <TabItem value="Consensus layer client" label="Consensus layer client" default>

```bash
web3signer eth2 --azure-vault-enabled=true --azure-client-id=87efaa5b-4029-4b54-98bb2e2e8a11 \
--azure-client-secret=0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z \
--azure-tenant-id=34255fb0-379b-4a1a-bd47-d211ab86df81 \
--azure-vault-name=AzureKeyVault
```

  </TabItem>
  <TabItem value="Execution layer client" label="Execution layer client" >

```bash
web3signer eth1 --azure-vault-enabled=true --azure-client-id=87efaa5b-4029-4b54-98bb2e2e8a11 \
--azure-client-secret=0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z \
--azure-tenant-id=34255fb0-379b-4a1a-bd47-d211ab86df81 \
--azure-vault-name=AzureKeyVault
```

  </TabItem>
</Tabs>

### AWS Secrets Manager

You can bulk load consensus layer keys that are stored in AWS Secrets Manager using the Web3Signer
[`eth2` subcommand options](../reference/cli/subcommands.md#eth2).

The AWS bulk load mode supports loading multiple consensus layer keys from the same secret, if keys
are stored with a line terminating character such as `\n`.
This saves cost when dealing with a large number of keys.
Up to 200 keys can be stored under a secret name.

```bash
web3signer eth2 --aws-secrets-enabled=true --aws-secrets-access-key-id=AKIA...EXAMPLE \
--aws-secrets-secret-access-key=sk...EXAMPLE \
--aws-secrets-region=us-east-2
```

### AWS Key Management Service

You can bulk load execution layer keys that are stored in the AWS Key Management Service (KMS) using
the Web3Signer [`eth1` subcommand options](../reference/cli/subcommands.md#eth1).

```bash
web3signer eth1 --aws-kms-enabled=true --aws-kms-access-key-id=AKIA...EXAMPLE \
--aws-kms-secret-access-key=sk...EXAMPLE \
--aws-secrets-region=us-east-2
```

### GCP Secret Manager

You can bulk load consensus layer keys that are stored in the GCP Secret Manager using
the Web3Signer [`eth2` subcommand options](../reference/cli/subcommands.md#eth2).

```bash
web3signer eth2 --gcp-secrets-enabled=true --gcp-project-id=AKIA...EXAMPLE
```

### Keystore files

You can bulk load consensus layer or execution layer keys that are stored as keystore files using the Web3Signer
[`eth1` subcommand options](../reference/cli/subcommands.md#eth1) or
[`eth2` subcommand options](../reference/cli/subcommands.md#eth2).

<Tabs>

  <TabItem value="Consensus layer client" label="Consensus layer client" default>

```bash
web3signer eth2 --keystores-path=/Users/me/keystores \
--keystores-passwords-path=/Users/me/passwds
```

  </TabItem>
  <TabItem value="Execution layer client" label="Execution layer client" >

```bash
web3signer eth1 --keystores-path=/Users/me/keystores \
--keystores-passwords-path=/Users/me/passwds
```

  </TabItem>
</Tabs>

Use the `eth1` or `eth2` `--keystores-password-file` or `--keystores-passwords-path` command line option to specify
keystore passwords.

<!-- Link -->

[key configuration file]: ../reference/key-config-file-params.md
[`eth1` and `eth2` subcommands]: ../reference/cli/subcommands.md
[Azure Key Vault]: #azure-key-vault
[AWS Secrets Manager]: #aws-secrets-manager
[keystore files]: #keystore-files
[AWS KMS]: #aws-key-management-service
[GCP Secret Manager]: #gcp-secret-manager
[Hashicorp Vault]: #use-key-configuration-files
