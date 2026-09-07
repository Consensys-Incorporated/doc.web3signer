---
title: Store signing keys
description: Store BLS12-381 and secp256k1 signing keys in Web3Signer.
sidebar_position: 2
keywords: [Hashicorp Vault, Azure Key Vault, AWS Secrets Manager, GCP Secret Manager]
---

# Store signing keys

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Supported from '@site/src/components/Supported';

Web3Signer supports BLS12-381 (`Eth2`) or secp256k1 (`Eth1`) signing keys stored in the following ways:

| Key storage                          | SECP256K1     | BLS          |
|--------------------------------------|:-------------:|:------------:|
| Raw files                            | <Supported /> | <Supported /> |
| [Keystore files]                     | <Supported /> | <Supported /> |
| **Vaults**                           |               |              |
| [Hashicorp Vault]                    | <Supported /> | <Supported /> |
| [Azure Key Vault]                    | <Supported /> | <Supported /> |
| [AWS Secrets Manager]                |               | <Supported /> |
| [AWS KMS]                            | <Supported /> |               |
| [GCP Secret Manager]                 |               | <Supported /> |

Web3Signer supports `Eth1` signing from vaults, but must load private keys into memory for `Eth2` signing.
Follow [best practices](../../get-started/key-best-practices.md) when storing private keys.

After storing keys, [load keys into Web3Signer](../load-keys.md).

<!-- links -->

[Keystore files]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2335.md
[HashiCorp Vault]: vaults/hashicorp.md
[Azure Key Vault]: vaults/azure.md
[AWS Secrets Manager]: vaults/aws/secrets-manager-consensus-layer.md
[AWS KMS]: vaults/aws/kms-execution-layer.md
[GCP Secret Manager]: vaults/gcp.md
