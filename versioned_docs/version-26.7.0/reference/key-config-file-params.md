---
sidebar_label: Key configuration file parameters
description: Signing key configuration file parameters
sidebar_position: 3
---

# Signing key configuration file parameters

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A [signing key configuration file] is a YAML file that defines the parameters to access one or more
signing keys.

:::note
You can specify multiple key configurations in a single configuration file by adding a triple-dash
separator (`---`) between configurations.

Specify a maximum file size limit for your signing key configuration file with the
[`--key-store-config-file-max-size`](cli/options.md#key-store-config-file-max-size) command line option.
The default size is 100 MB.
:::

## Raw unencrypted files

Stores the private key as an unencrypted value directly in the key configuration file.

```bash
type: "file-raw"
keyType: "SECP256K1"
privateKey: "0x25b1166a43c109cb330af8945d364722757c65ed2bfed5444b5a2f057f82d391"
```

| Key | Description |
| --- | --- |
| **type** | Type of configuration file. Use `file-raw`. |
| **keyType** | Signing key type. Valid options are `BLS` or `SECP256K1`. The default is `BLS`. |
| **privateKey** | Hexadecimal encoded private key string. |

## Keystore file

Use the private key stored in a [keystore file].

```bash
type: "file-keystore"
keyType: "SECP256K1"
keystoreFile: "95e57532ede3c1dd879061153f9cfdcdefa9dc5fb9c954a6677bc6641b8d26e39f70b660bbaa732c47277c0096e11400.json"
keystorePasswordFile: "95e57532ede3c1dd879061153f9cfdcdefa9dc5fb9c954a6677bc6641b8d26e39f70b660bbaa732c47277c0096e11400.password"
```

| Key | Description |
| --- | --- |
| **type** | Type of configuration file. Use `file-keystore`. |
| **keyType** | Signing key type. Valid options are `BLS` or `SECP256K1`. The default is `BLS`. |
| **keystoreFile** | Location of the keystore file. |
| **keystorePasswordFile** | Text file containing the password to decrypt the keystore file. |

## HashiCorp Vault

Use the private key stored in [HashiCorp Vault](../how-to/store-keys/vaults/hashicorp.md).
Supports two authentication methods:

- `TOKEN` - Authenticate using a static Vault token. This is the default.
- `KUBERNETES` - Authenticate using the pod's Kubernetes service account. Web3Signer exchanges the
  service account token for a short-lived Vault client token.

<!-- markdownlint-disable -->

<Tabs>

  <TabItem value="token" label="TOKEN" default>

```bash
type: "hashicorp"
keyType: "SECP256K1"
tlsEnabled: "true"
keyPath: "/v1/secret/data/secretPath"
keyName: "secretName"
tlsKnownServersPath: "/Users/me/project/knownhosts"
serverHost: "localhost"
serverPort: "32895"
timeout: "10000"
token: "s.MuZwBqZ0iE1HzvD64v3HMlhT"
```

  </TabItem>
  <TabItem value="kubernetes" label="KUBERNETES">

```bash
type: "hashicorp"
keyType: "SECP256K1"
tlsEnabled: "true"
keyPath: "/v1/secret/data/secretPath"
keyName: "secretName"
tlsKnownServersPath: "/Users/me/project/knownhosts"
serverHost: "localhost"
serverPort: "32895"
timeout: "10000"
authMethod: "KUBERNETES"
kubernetesRole: "web3signer-role"
```

  </TabItem>
</Tabs>

| Key | Description |
| --- | --- |
| **type** | Type of configuration file. Use `hashicorp`. |
| **keyType** | Signing key type. Valid options are `BLS` or `SECP256K1`. The default is `BLS`. |
| **tlsEnabled** | Enable or disable TLS. The default is `true`. |
| **keyPath** | Path to secret in the HashiCorp Vault containing the private key. Syntax is the same as the path used in [HashiCorp KV Secrets Engine Version 2 HTTP API](https://www.vaultproject.io/api-docs/secret/kv/kv-v2#read-secret-version) |
| **keyName** | Name of the key storing the private key in the vault. |
| **tlsKnownServersPath** | Path to the file containing a list of trusted HashiCorp Vault servers. |
| **serverHost** | Host of the HashiCorp Vault server. |
| **serverPort** | Port of the HashiCorp Vault server. |
| **timeout** | Timeout in milliseconds for requests to the HashiCorp Vault server. |
| **authMethod** | Authentication method used to access HashiCorp Vault. Valid options are `TOKEN` and `KUBERNETES`. The default is `TOKEN`. |
| **token** | The root token displayed by the HashiCorp Vault server. Required when `authMethod` is `TOKEN`. |
| **kubernetesRole** | Vault role bound to the pod's Kubernetes service account. Required when `authMethod` is `KUBERNETES`. |
| **kubernetesAuthPath** | Vault authentication mount path used for the `KUBERNETES` authentication method. The default is `kubernetes`. |
| **kubernetesServiceAccountTokenPath** | Path to the file containing the Kubernetes service account token. The default is `/var/run/secrets/kubernetes.io/serviceaccount/token`. Relative paths are resolved relative to the signing key configuration file directory. |
| **httpProtocolVersion** | Override HTTP protocol version that is used to connect to HashiCorp Vault. Valid values are `HTTP_2` and `HTTP_1_1`. The default is `HTTP_2`. |

<!-- markdownlint-enable -->

## Azure Key Vault

Use the private key stored in [Azure Key Vault](../how-to/store-keys/vaults/azure.md).
Supports two signing options:

- `azure-key` - Performs the signing in Azure Key Vault.
  Supports SECP256K1 signing keys only.
- `azure-secret` - Web3Signer fetches the keys from the vault and signs locally.
  Supports SECP256K1 and BLS12-381 signing keys.

<!-- markdownlint-disable -->

<Tabs>

   <TabItem value="azure-secret" label="azure-secret" default>
```
type: "azure-secret"
keyType: "BLS"
authenticationMode: "USER_ASSIGNED_MANAGED_IDENTITY"
clientId: "***"
tenantId: "***"
vaultName: "AzureKeyVault"
secretName: "SecretName"
```

  </TabItem>
   <TabItem value="azure-key" label="azure-key" >

```yml
type: "azure-key"
clientId: "***"
clientSecret: "***"
tenantId: "***"
vaultName: "AzureKeyVault"
keyName: "KeyName"
```

  </TabItem>
</Tabs>

| Key | Description |
| --- | --- |
| **type** | Type of configuration file. Use `azure-secret` or `azure-key`. |
| **authenticationMode** | Authentication type being used. Can only be used with the `azure-secret` type. Valid options are `CLIENT_SECRET`, `SYSTEM_ASSIGNED_MANAGED_IDENTITY`, and `USER_ASSIGNED_MANAGED_IDENTITY`. The default is `CLIENT_SECRET`. |
| **keyType** | Signing key type. Valid options are `BLS` or `SECP256K1`. The default is `SECP256K1`. |
| **clientId** | ID used to authenticate with Azure Key Vault. Required when using the `azure-key` type, or when using `azure-secret` with the `CLIENT_SECRET` or `USER_ASSIGNED_MANAGED_IDENTITY` authentication modes. |
| **clientSecret** | Secret used to access the vault. Required for the `CLIENT_SECRET` authentication mode. |
| **tenantId** | The tenant ID used to authenticate with Azure Key Vault. |
| **vaultName** | Name of the vault to access. Sub-domain of vault.azure.net. |
| **secretName** | Name of the key stored in the Azure Key Vault under Secrets settings. Required when using the `azure-secret` type. |
| **keyName** | Name of the key stored in the Azure Key Vault under Keys settings. Required when using the `azure-key` type. |

<!-- markdownlint-enable -->

## AWS Secrets Manager

Use the private key stored in [AWS Secrets Manager](../how-to/store-keys/vaults/aws/secrets-manager-consensus-layer.md).
Supports BLS keys for consensus layer signing.

```bash
type: "aws-secret"
authenticationMode: "SPECIFIED"
keyType: "BLS"
accessKeyId: "foo"
secretAccessKey: "bar"
secretName: "SecretName"
region: "us-west-2"
```

| Key | Description |
| --- | --- |
| **type** | Type of configuration file. Use `aws-secret`. |
| **authenticationMode** | Authentication type being used. Valid options are `ENVIRONMENT` and `SPECIFIED`. If using `ENVIRONMENT`, credentials are authenticated using the [default credential provider chain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default). The default authentication type is `SPECIFIED`. |
| **keyType** | Signing key type. Use `BLS`. |
| **accessKeyId** | Your access key ID. |
| **secretAccessKey** | Your secret access key. |
| **secretName** | Name of the secret. |
| **region** | Region to connect to. |

## AWS Key Management Service

Use the private key stored in [AWS Key Management Service (KMS)](../how-to/store-keys/vaults/aws/kms-execution-layer.md).
Supports SECP256K1 keys for execution layer signing.

```bash
type: "aws-kms"
authenticationMode: "SPECIFIED"
accessKeyId: "acc_key_id"
secretAccessKey: "foo"
sessionToken: "sess_token"
kmsKeyId: "bar"
region: "us-east-2"
endpointOverride: "http://localhost:4566"
```

<!-- markdownlint-disable -->

| Key                    | Description                                                                                                                                                                                                                                                                                                                            |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **type**               | Type of configuration file. Use `aws-kms`.                                                                                                                                                                                                                                                                                             |
| **authenticationMode** | Authentication type being used. Valid options are `ENVIRONMENT` and `SPECIFIED`. If using `ENVIRONMENT`, credentials are authenticated using the [default credential provider chain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default). The default authentication type is `SPECIFIED`. |
| **accessKeyId**        | Access key ID.                                                                                                                                                                                                                                                                                                                         |
| **secretAccessKey**    | Secret access key.                                                                                                                                                                                                                                                                                                                     |
| **sessionToken**       | Token provided by [AWS Security Token Service (STS)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_enable-regions.html). Optional depending on AWS configuration.                                                                                                                                                |
| **kmsKeyId**           | AWS Access Key ID to authenticate AWS KMS.                                                                                                                                                                                                                                                                                             |
| **region**             | Region to connect to.                                                                                                                                                                                                                                                                                                                  |
| **endpointOverride**   | Endpoint override for AWS KMS. Useful for local testing against LocalStack.                                                                                                                                                                                                                                                            |

<!-- Links -->

[signing key configuration file]: ../how-to/load-keys.md#use-key-configuration-files
[keystore file]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2335.md
