---
sidebar_label: Use Azure Key Vault
description: Store keys in Azure Key Vault.
sidebar_position: 2
---

# Use Web3Signer with Azure Key Vault

Web3Signer supports using [Azure Key Vault](https://azure.microsoft.com/en-au/services/key-vault/)
to sign payloads in the following ways:

- Using Azure Key Vault to perform the signing operation. Supports SECP256K1 signing keys only.
- Fetching the keys from Azure Key Vault and signing locally.

Web3Signer supports the following authentication modes:

- [Azure Active Directory managed identity]:
  - System-assigned identities
  - User-assigned identities
- [Client secret].

:::info Important
The Azure Active Directory managed identity authentication modes can only be used when fetching keys
from Azure Key Vault and signing locally with Web3Signer.
:::

## Store a private key in Azure Key Vault

[Register Web3Signer as an application] and [add a signing key in Azure Key Vault].

Take note of the following to specify when [configuring the signing key configuration file] or
[bulk loading signing keys]:

- Vault name, which is part of the URL (for example `https://<vaultname>.vault.azure.net`).
- Client credentials, which can include:
  - Client ID
  - Client secret
  - Tenant ID

:::note
Depending on the authentication mode, not all client credentials are available.
:::

- Key name, which is the name of the secret.

After storing keys, [load keys into Web3Signer using a key configuration file, or bulk loading keys](../../load-keys.md).

<!-- links -->

[configuring the signing key configuration file]: ../../load-keys.md#use-key-configuration-files
[bulk loading signing keys]: ../../load-keys.md#azure-key-vault
[Register Web3Signer as an application]: https://docs.microsoft.com/en-us/azure/key-vault/general/authentication
[add a signing key in Azure Key Vault]: https://docs.microsoft.com/en-us/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault
[Client secret]: https://docs.microsoft.com/en-us/azure/key-vault/secrets/about-secrets
[Azure Active Directory managed identity]: https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=dotnet
