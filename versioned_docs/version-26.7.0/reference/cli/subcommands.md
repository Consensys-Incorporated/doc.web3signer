---
title: Subcommands
description: Web3Signer subcommands reference
sidebar_position: 2
---

# Subcommands

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Use the Web3Signer subcommands to specify the platform being used:

- `web3signer [options] eth2 [Eth2 options]`
- `web3signer [options] eth2 export [Eth2 export options]`
- `web3signer [options] eth2 import [Eth2 import options]`
- `web3signer [options] eth1`
- `web3signer [options] watermark-repair [watermark repair options]`

:::note
This documentation has been updated in line with the name changes [recommended by the Ethereum
Foundation](https://blog.ethereum.org/2022/01/24/the-great-eth2-renaming/).
The `eth1` subcommands relate to the execution layer, previously called “Ethereum 1.0.”
The `eth2` subcommands relate to the consensus layer, previously called “Ethereum 2.0.”
:::

## Specify subcommand options

The subcommand must be specified on the command line, but the subcommand options can be specified:

- On the command line.
- As environment variables. For each subcommand option, the equivalent environment variable is:
  - Uppercase.
  - `_` replaces `-`.
  - Has a `WEB3SIGNER_` + `<SIGNING_OPTION>_` prefix.
- In a [YAML configuration file](../../how-to/use-configuration-file-starting-web3signer.md).

For example, you can set the `--chain-id` option for the `eth1` subcommand in an environment
variable `export WEB3SIGNER_ETH1_CHAIN_ID=2017`, but the subcommand must be specified in the
command line.

## View help

To view the command line help for the subcommands:

- [`web3signer help eth1`](#eth1)
- [`web3signer help eth2`](#eth2)
- [`web3signer help watermark-repair`](#watermark-repair)

## Options

### `eth1`

#### `aws-connection-cache-size`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-connection-cache-size=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-connection-cache-size=5
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_CONNECTION_CACHE_SIZE=5
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-connection-cache-size: 5
```

  </TabItem>
</Tabs>

<!-- markdown-link-check-disable-next-line -->
When [loading multiple keys from AWS Secrets Manager](../../how-to/store-keys/vaults/aws/secrets-manager-consensus-layer.md#cache-aws-secrets-manager-when-loading-multiple-keys),
set to the maximum number of connections to cache.
The default is `1`.

#### `aws-endpoint-override`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-endpoint-override=<ENDPOINT_URL>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-endpoint-override=http://localstack:4566
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_ENDPOINT_OVERRIDE=http://localstack:4566
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-endpoint-override="http://localstack:4566"
```

  </TabItem>
</Tabs>

Endpoint override for AWS KMS.
Useful for local testing against LocalStack.

#### `aws-kms-access-key-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-access-key-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-access-key-id=AKIA...EXAMPLE
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_ACCESS_KEY_ID=AKIA...EXAMPLE
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-access-key-id: "AKIA...EXAMPLE"
```

  </TabItem>
</Tabs>

AWS Access Key ID to authenticate AWS KMS.
Required when [`--aws-kms-auth-mode`](#aws-kms-auth-mode) is `SPECIFIED`.

#### `aws-kms-auth-mode`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-auth-mode=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-auth-mode=ENVIRONMENT
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_AUTH_MODE=ENVIRONMENT
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-auth-mode: "ENVIRONMENT"
```

  </TabItem>
</Tabs>

Authentication mode for AWS KMS.
Options are `SPECIFIED` and `ENVIRONMENT`.
The default is `SPECIFIED`.

Set [`--aws-kms-access-key-id`](#aws-kms-access-key-id),
[`--aws-kms-secret-access-key`](#aws-kms-secret-access-key), and
[`--aws-kms-region`](#aws-kms-region) if using `SPECIFIED`.

#### `aws-kms-client-cache-size`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-client-cache-size=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-client-cache-size=5
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_CLIENT_CACHE_SIZE=5
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-client-cache-size: "5"
```

  </TabItem>
</Tabs>

AWS KMS client cache size. Set to the total number of credentials
used to access the service plus the number of regions the service is accessed from. The default is `1`.

#### `aws-kms-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-enabled: "true"
```

  </TabItem>
</Tabs>

Set to `true` to enable bulk loading from the AWS KMS. The default is `false`.

#### `aws-kms-region`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-region=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-region=us-east-2
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_REGION=us-east-2
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-region: "us-east-2"
```

  </TabItem>
</Tabs>

AWS region where AWS KMS is available.

Required when [`--aws-kms-auth-mode`](#aws-kms-auth-mode) is `SPECIFIED`.

#### `aws-kms-secret-access-key`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-secret-access-key=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-secret-access-key=sk...EXAMPLE
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_SECRET_ACCESS_KEY=sk...EXAMPLE
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-secret-access-key: "sk...EXAMPLE"
```

  </TabItem>
</Tabs>

AWS secret access key to authenticate AWS KMS.
Required when [`--aws-kms-auth-mode`](#aws-kms-auth-mode) is `SPECIFIED`.

#### `aws-kms-tag`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-kms-tag <NAME>=<VALUE> [--aws-kms-tag <NAME>=<VALUE> ...]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-kms-tag tagName1=tagValue1 --aws-kms-tag tagName2=tagValue2
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AWS_KMS_TAG="tagName1=tagValue1|tagName2=tagValue2"
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.aws-kms-tag: "tagName1=tagValue1|tagName2=tagValue2"
```

  </TabItem>
</Tabs>

Optional tag name and value filters to apply while fetching key IDs from AWS KMS.

On the command line, use `--aws-kms-tag` multiple times to specify multiple filters.
As an environment variable and in the configuration file, use a pipe `|` to specify multiple filters in a single line.
Multiple filters are applied as an `AND` operation.

#### `azure-vault-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-vault-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-vault-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_VAULT_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-vault-enabled: true
```

  </TabItem>
</Tabs>

Enables [bulk loading keys from Azure Key Vault](../../how-to/load-keys.md#azure-key-vault).
The default is `false`.

#### `azure-client-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-client-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-client-id=87efaa5b-4029-4b54-98bb2e2e8a11
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_CLIENT_ID=87efaa5b-4029-4b54-98bb2e2e8a11
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-client-id: "87efaa5b-4029-4b54-98bb2e2e8a11"
```

  </TabItem>
</Tabs>

ID used to authenticate with Azure Key Vault.

Required when [`--azure-vault-auth-mode`](#azure-vault-auth-mode) is `CLIENT_SECRET` or
`USER_ASSIGNED_MANAGED_IDENTITY`.

#### `azure-client-secret`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-client-secret=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-client-secret=0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_CLIENT_SECRET=0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-client-secret: "0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z"
```

  </TabItem>
</Tabs>

The secret used to access the vault along with the ID specified in [`azure-client-id`](#azure-client-id).

#### `azure-response-timeout`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-response-timeout=<AZURE_RESPONSE_TIMEOUT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-response-timeout=40
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_RESPONSE_TIMEOUT=40
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-response-timeout: "40"
```

  </TabItem>
</Tabs>

The response timeout used by the HTTP client (in seconds). The default is 60. You can also set the timeout using
the `timeout` field in the Azure metadata file.

#### `azure-tags`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-tags=<TAG_NAME=TAG_VALUE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-tags=ENV=prod
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_TAGS=ENV=prod
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-tags: "ENV=prod"
```

  </TabItem>
</Tabs>

Tags to filter on with Azure Key Vault.

#### `azure-tenant-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-tenant-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-tenant-id=34255fb0-379b-4a1a-bd47-d211ab86df81
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_TENANT_ID=34255fb0-379b-4a1a-bd47-d211ab86df81
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-tenant-id: "34255fb0-379b-4a1a-bd47-d211ab86df81"
```

  </TabItem>
</Tabs>

The tenant ID of the Azure Portal instance being used.

#### `azure-vault-auth-mode`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-vault-auth-mode=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-vault-auth-mode=USER_ASSIGNED_MANAGED_IDENTITY
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_VAULT_AUTH_MODE=USER_ASSIGNED_MANAGED_IDENTITY
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-vault-auth-mode: "USER_ASSIGNED_MANAGED_IDENTITY"
```

  </TabItem>
</Tabs>

Authentication mode for Azure Vault.
Options are `CLIENT_SECRET`, `SYSTEM_ASSIGNED_MANAGED_IDENTITY`, and `USER_ASSIGNED_MANAGED_IDENTITY`.
The default is `CLIENT_SECRET`.

Set [`--azure-client-id`](#azure-client-id) if using `CLIENT_SECRET` or `USER_ASSIGNED_MANAGED_IDENTITY`.

#### `azure-vault-name`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-vault-name=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-vault-name=AzureKeyVault
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_AZURE_VAULT_NAME=AzureKeyVault
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.azure-vault-name: "AzureKeyVault"
```

  </TabItem>
</Tabs>

Name of the vault to access.
Subdomain of `vault.azure.net`.

#### `chain-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--chain-id=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--chain-id=2017
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_CHAIN_ID=2017
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.chain-id: "2017"
```

  </TabItem>
</Tabs>

ID of the chain to receive the signed transactions. The Besu documentation
lists [chain IDs for public networks](https://besu.hyperledger.org/public-networks/concepts/network-and-chain-id).

#### `downstream-http-host`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-host=<downstreamHttpHost>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-host=192.168.05.14
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_HOST=192.168.05.14
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-host="192.168.05.14"
```

  </TabItem>
</Tabs>

Host to which received requests are forwarded.
The default is `localhost`.

#### `downstream-http-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-path=<downstreamHttpPath>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-path=/v3/d0e63ca5bb1e4eef2284422efbc51a56
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_PATH=/v3/d0e63ca5bb1e4eef2284422efbc51a56
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-path="/v3/d0e63ca5bb1e4eef2284422efbc51a56"
```

  </TabItem>
</Tabs>

Path to which received requests are forwarded.
The default is `/`.

This might be required if connecting to a cloud-based Ethereum client such as [Infura](https://infura.io/).

#### `downstream-http-port`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-port=<downstreamHttpPort>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-port=6174
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_PORT=6174
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-port: 6174
```

  </TabItem>
</Tabs>

Port to which received requests are forwarded.

#### `downstream-http-proxy-host`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-proxy-host=<HOST>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-proxy-host=192.168.05.14
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_PROXY_HOST=192.168.05.14
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-proxy-host: "192.168.05.14"
```

  </TabItem>
</Tabs>

Hostname for proxy.
There's no proxy if set to `null`.
The default is `null`.

#### `downstream-http-proxy-port`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-proxy-port=<PORT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-proxy-port=8545
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_PROXY_PORT=8545
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-proxy-port: 8545
```

  </TabItem>
</Tabs>

Port for proxy.
The default is `80`.

#### `downstream-http-proxy-username`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-proxy-username=<username>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-proxy-username=user
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_PROXY_USERNAME=user
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-proxy-username: "user"
```

  </TabItem>
</Tabs>

Username for proxy.
There's no authentication if set to `null`.
The default is `null`.

#### `downstream-http-proxy-password`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-proxy-password=<password>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-proxy-password=password
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_PROXY_PASSWORD=password
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-proxy-password: "password"
```

  </TabItem>
</Tabs>

Password for proxy.
There's no authentication if set to `null`.
The default is `null`.

#### `downstream-http-request-timeout`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-request-timeout=<downstreamHttpRequestTimeout>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-request-timeout=3000
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_REQUEST_TIMEOUT=3000
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-request-timeout: 3000
```

  </TabItem>
</Tabs>

Timeout period (in milliseconds) for downstream requests.
The default is 5000.

#### `downstream-http-tls-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-tls-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-tls-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_TLS_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-tls-enabled: true
```

  </TabItem>
</Tabs>

Enables or disables [TLS for server connections](../../concepts/tls.md).
The default is `false`.

#### `downstream-http-tls-keystore-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-tls-keystore-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-tls-keystore-file=/Users/me/my_node/keystore.pfx
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_TLS_KEYSTORE_FILE=/Users/me/my_node/keystore.pfx
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-tls-keystore-file: /Users/me/my_node/keystore.pfx
```

  </TabItem>
</Tabs>

Keystore used to present during TLS client authentication with the downstream server.

#### `downstream-http-tls-keystore-password-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-tls-keystore-password-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-tls-keystore-password-file=/Users/me/my_node/keyPassword
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_TLS_KEYSTORE_PASSWORD_FILE=/Users/me/my_node/keyPassword
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-tls-keystore-password-file: /Users/me/my_node/keyPassword
```

  </TabItem>
</Tabs>

File containing the password to decrypt the keystore.

#### `downstream-http-tls-known-servers-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-tls-known-servers-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-tls-known-servers-file=/Users/me/my_node/knownServers
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_DOWNSTREAM_HTTP_TLS_KNOWN_SERVERS_FILE=/Users/me/my_node/knownServers
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-tls-known-servers-file=/Users/me/my_node/knownServers
```

  </TabItem>
</Tabs>

File containing the hostnames, ports, and SHA256 certificate fingerprints of
[trusted servers](../../how-to/configure-tls.md#create-the-known-servers-file).

#### `downstream-http-tls-ca-auth-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--downstream-http-tls-ca-auth-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--downstream-http-tls-ca-auth-enabled=false
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_HTTP_TLS_CA_AUTH_ENABLED=false
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.downstream-http-tls-ca-auth-enabled: false
```

  </TabItem>
</Tabs>

Enables or disables connections to servers with trusted CAs.
The default is `true`.

#### `keystores-password-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--keystores-password-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--keystores-password-file=/Users/me/passwds/keystore_passwords.txt
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_KEYSTORES_PASSWORD_FILE=/Users/me/passwds/keystore_passwords.txt
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.keystores-password-file: "/Users/me/passwds/keystore_passwords.txt"
```

  </TabItem>
</Tabs>

File that contains the password used by all keystores.
Cannot be set if [`--keystores-passwords-path`](#keystores-passwords-path) is also specified.

:::note
Alternatively, use [`--keystores-passwords-path`](#keystores-passwords-path) to specify a directory
containing a separate password file for each keystore.
:::

#### `keystores-passwords-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--keystores-passwords-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--keystores-passwords-path=/Users/me/passwds
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_KEYSTORES_PASSWORDS_PATH=/Users/me/passwds
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.keystores-passwords-path: "/Users/me/passwds"
```

  </TabItem>
</Tabs>

Directory containing password files for corresponding keystores.
Each password file name must match the corresponding keystore filename, but with a `.txt` extension.

Cannot be set if [`--keystores-password-file`](#keystores-password-file) is also specified.

:::note
Alternatively, use [`--keystores-password-file`](#keystores-password-file) to specify a single
password file that contains the password used by all keystores.
:::

#### `keystores-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--keystores-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--keystores-path=/Users/me/keystores
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH1_KEYSTORES_PATH=/Users/me/keystores
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth1.keystores-path: "/Users/me/keystores"
```

  </TabItem>
</Tabs>

Directory that stores the keystore files.
Keystore files must use a `.json` file extension.

Use [`--keystores-password-file`](#keystores-password-file) or
[`--keystores-passwords-path`](#keystores-passwords-path) to specify keystore passwords.

:::caution Important
Restart Web3Signer if you want to pick up new keystores added to the directory since Web3Signer started.
:::

### `eth2`

#### `aws-connection-cache-size`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-connection-cache-size=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-connection-cache-size=5
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_CONNECTION_CACHE_SIZE=5
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-connection-cache-size: 5
```

  </TabItem>
</Tabs>

When [loading multiple keys from AWS Secrets Manager](../../how-to/store-keys/vaults/aws/secrets-manager-consensus-layer.md#cache-aws-secrets-manager-when-loading-multiple-keys),
set to the maximum number of connections to cache.
The default is 1.

#### `aws-endpoint-override`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-endpoint-override=<ENDPOINT_URL>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-endpoint-override=http://localstack:4566
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_ENDPOINT_OVERRIDE=http://localstack:4566
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-endpoint-override="http://localstack:4566"
```

  </TabItem>
</Tabs>

Endpoint override for AWS Secrets Manager.
This is useful for local testing against LocalStack.

#### `aws-secrets-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-enabled: true
```

  </TabItem>
</Tabs>

Enables or disables [bulk loading keys from AWS Secrets Manager](../../how-to/load-keys.md#aws-secrets-manager).
The default is `false`.

#### `aws-secrets-auth-mode`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-auth-mode=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-auth-mode=ENVIRONMENT
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_AUTH_MODE=ENVIRONMENT
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-auth-mode: "ENVIRONMENT"
```

  </TabItem>
</Tabs>

Authentication mode for AWS Secrets Manager.
Options are `SPECIFIED` and `ENVIRONMENT`.
The default is `SPECIFIED`.

Set [`--aws-secrets-access-key-id`](#aws-secrets-access-key-id),
[`--aws-secrets-secret-access-key`](#aws-secrets-secret-access-key), and
[`--aws-secrets-region`](#aws-secrets-region) if using `SPECIFIED`.

#### `aws-secrets-access-key-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-access-key-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-access-key-id=AKIA...EXAMPLE
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_ACCESS_KEY_ID=AKIA...EXAMPLE
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-access-key-id: "AKIA...EXAMPLE"
```

  </TabItem>
</Tabs>

AWS access key ID to authenticate AWS Secrets Manager.

Required when [`--aws-secrets-auth-mode`](#aws-secrets-auth-mode) is `SPECIFIED`.

#### `aws-secrets-secret-access-key`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-secret-access-key=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-secret-access-key=sk...EXAMPLE
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_SECRET_ACCESS_KEY=sk...EXAMPLE
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-secret-access-key: "sk...EXAMPLE"
```

  </TabItem>
</Tabs>

AWS secret access key to authenticate AWS Secrets Manager.

Required when [`--aws-secrets-auth-mode`](#aws-secrets-auth-mode) is `SPECIFIED`.

#### `aws-secrets-region`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-region=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-region=us-east-2
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_REGION=us-east-2
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-region: "us-east-2"
```

  </TabItem>
</Tabs>

AWS region where AWS Secrets Manager is available.

Required when [`--aws-secrets-auth-mode`](#aws-secrets-auth-mode) is `SPECIFIED`.

#### `aws-secrets-prefixes-filter`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-prefixes-filter=<STRING>[,<STRING>,...]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-prefixes-filter=prefix1,prefix2
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_PREFIXES_FILTER=prefix1,prefix2
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-prefixes-filter: ["prefix1","prefix2"]
```

  </TabItem>
</Tabs>

Optional comma-separated list of secret name prefixes filter to apply while fetching secrets from
AWS Secrets Manager.
Applied as `AND` operation with other filters.

#### `aws-secrets-tag`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--aws-secrets-tag <NAME>=<VALUE> [--aws-secrets-tag <NAME>=<VALUE> ...]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--aws-secrets-tag tagName1=tagValue1 --aws-secrets-tag tagName2=tagValue2
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AWS_SECRETS_TAG="tagName1=tagValue1|tagName2=tagValue2"
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.aws-secrets-tag: "tagName1=tagValue1|tagName2=tagValue2"
```

  </TabItem>
</Tabs>

Optional tag name and value filters to apply while fetching secrets from AWS Secrets Manager.

On the command line, use `--aws-secrets-tag` multiple times to specify multiple filters.
As an environment variable and in the configuration file, use a pipe `|` to specify multiple filters in a single line.
Multiple filters are applied as an `AND` operation.

#### `azure-vault-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-vault-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-vault-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_VAULT_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-vault-enabled: true
```

  </TabItem>
</Tabs>

Enables [bulk loading keys from Azure Key Vault](../../how-to/load-keys.md#azure-key-vault).
The default is `false`.

#### `azure-client-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-client-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-client-id=87efaa5b-4029-4b54-98bb2e2e8a11
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_CLIENT_ID=87efaa5b-4029-4b54-98bb2e2e8a11
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-client-id: "87efaa5b-4029-4b54-98bb2e2e8a11"
```

  </TabItem>
</Tabs>

ID used to authenticate with Azure Key Vault.

Required when [`--azure-vault-auth-mode`](#azure-vault-auth-mode) is `CLIENT_SECRET` or
`USER_ASSIGNED_MANAGED_IDENTITY`.

#### `azure-client-secret`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-client-secret=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-client-secret=0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_CLIENT_SECRET=0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-client-secret: "0DgK4V_YA99RPk7.f_1op0-em_a46wSe.Z"
```

  </TabItem>
</Tabs>

The secret used to access the vault along with the ID specified in [`azure-client-id`](#azure-client-id).

#### `azure-response-timeout`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-response-timeout=<AZURE_RESPONSE_TIMEOUT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-response-timeout=40
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_RESPONSE_TIMEOUT=40
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-response-timeout: "40"
```

  </TabItem>
</Tabs>

The response timeout used by the HTTP client (in seconds). The default is 60. You can also set the timeout using the `timeout` field in the Azure metadata file.

#### `azure-tags`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-tags=<TAG_NAME=TAG_VALUE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-tags=ENV=prod
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_TAGS=ENV=prod
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-tags: "ENV=prod"
```

  </TabItem>
</Tabs>

Tags to filter on using Azure Key Vault.

#### `azure-tenant-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-tenant-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-tenant-id=34255fb0-379b-4a1a-bd47-d211ab86df81
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_TENANT_ID=34255fb0-379b-4a1a-bd47-d211ab86df81
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-tenant-id: "34255fb0-379b-4a1a-bd47-d211ab86df81"
```

  </TabItem>
</Tabs>

The tenant ID of the Azure Portal instance being used.

#### `azure-vault-auth-mode`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-vault-auth-mode=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-vault-auth-mode=USER_ASSIGNED_MANAGED_IDENTITY
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_VAULT_AUTH_MODE=USER_ASSIGNED_MANAGED_IDENTITY
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-vault-auth-mode: "USER_ASSIGNED_MANAGED_IDENTITY"
```

  </TabItem>
</Tabs>

Authentication mode for Azure Vault.
Options are `CLIENT_SECRET`, `SYSTEM_ASSIGNED_MANAGED_IDENTITY`, and `USER_ASSIGNED_MANAGED_IDENTITY`.
The default is `CLIENT_SECRET`.

Set [`--azure-client-id`](#azure-client-id) if using `CLIENT_SECRET` or `USER_ASSIGNED_MANAGED_IDENTITY`.

#### `azure-vault-name`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--azure-vault-name=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--azure-vault-name=AzureKeyVault
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_AZURE_VAULT_NAME=AzureKeyVault
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.azure-vault-name: "AzureKeyVault"
```

  </TabItem>
</Tabs>

Name of the vault to access.
Subdomain of `vault.azure.net`.

#### `commit-boost-api-enabled`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--commit-boost-api-enabled[=<BOOLEAN>]
```

  </TabItem>
  <TabItem value="Example" label="Example">

```bash
--commit-boost-api-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable">

```bash
WEB3SIGNER_ETH2_COMMIT_BOOST_API_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file">

```bash
eth2.commit-boost-api-enabled: true
```

  </TabItem>
</Tabs>

Enables or disables the [Commit-Boost API](https://commit-boost.github.io/commit-boost-client/api).
The default is `false`.

You can specify the directory to store the generated Commit-Boost proxy keystores using
[`--proxy-keystores-path`](#proxy-keystores-path).

#### `gcp-project-id`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--gcp-project-id=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--gcp-project-id=my-project
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_GCP_PROJECT_ID=my-project
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.gcp-project-id: "my-project"
```

  </TabItem>
</Tabs>

Globally unique identifier for the Google Cloud Platform (GCP) project where the
secrets to be used by Web3Signer are stored.

#### `gcp-secrets-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--gcp-secrets-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--gcp-secrets-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_GCP_SECRETS_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.gcp-secrets-enabled: true
```

  </TabItem>
</Tabs>

Set to `true` to enable bulk loading from the GCP Secrets Manager service. The default is `false`.

#### `gcp-secrets-filter`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--gcp-secrets-filter=<STRING>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--gcp-secrets-filter=my-secrets-filter
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_GCP_SECRETS_FILTER=my-secrets-filter
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.gcp-secrets-filter: "my-secrets-filter"
```

  </TabItem>
</Tabs>

Filter to use when loading secrets into Web3Signer. [List operation filtering](https://cloud.google.com/secret-manager/docs/filtering) is applied.

Only secrets matching the filter are loaded. If not specified, all secrets from the project identified by
[`--gcp-project-id`](#gcp-project-id) are loaded.

#### `key-manager-api-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--key-manager-api-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--key-manager-api-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_KEY_MANAGER_API_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.key-manager-api-enabled: true
```

  </TabItem>
</Tabs>

Enables the [key manager API](../../how-to/manage-keys.md).
The default is `false`.

#### `keystores-password-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--keystores-password-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--keystores-password-file=/Users/me/passwds/keystore_passwords.txt
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_KEYSTORES_PASSWORD_FILE=/Users/me/passwds/keystore_passwords.txt
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.keystores-password-file: "/Users/me/passwds/keystore_passwords.txt"
```

  </TabItem>
</Tabs>

File that contains the password used by all keystores.
Cannot be set if [`--keystores-passwords-path`](#keystores-passwords-path) is also specified.

:::note
Alternatively, use [`--keystores-passwords-path`](#keystores-passwords-path) to specify a directory
containing a separate password file for each keystore.
:::

#### `keystores-passwords-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--keystores-passwords-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--keystores-passwords-path=/Users/me/passwds
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_KEYSTORES_PASSWORDS_PATH=/Users/me/passwds
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.keystores-passwords-path: "/Users/me/passwds"
```

  </TabItem>
</Tabs>

Directory containing password files for corresponding keystores.
Each password file name must match the corresponding keystore filename, but with a `.txt` extension.

Cannot be set if [`--keystores-password-file`](#keystores-password-file) is also specified.

:::note
Alternatively, use [`--keystores-password-file`](#keystores-password-file) to specify a single
password file that contains the password used by all keystores.
:::

#### `keystores-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--keystores-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--keystores-path=/Users/me/keystores
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_KEYSTORES_PATH=/Users/me/keystores
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.keystores-path: "/Users/me/keystores"
```

  </TabItem>
</Tabs>

Directory that stores the keystore files.
Keystore files must use a `.json` file extension.

Use [`--keystores-password-file`](#keystores-password-file) or
[`--keystores-passwords-path`](#keystores-passwords-path) to specify keystore passwords.

:::caution Important
Restart Web3Signer if you want to pick up new keystores added to the directory since Web3Signer started.
:::

#### `network`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--network=<NETWORK>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--network=mainnet
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_NETWORK=mainnet
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.network: "mainnet"
```

  </TabItem>
</Tabs>

Predefined network configuration.
Accepts a predefined network name, or file path or URL to a YAML configuration file.
See the [consensus specification] for examples.

The default is `mainnet`.

:::caution Important
If Teku connects to a network other than `mainnet`, then this option must be specified, and it must
match the [`--network` value of the connected Teku client](https://docs.teku.consensys.net/how-to/use-external-signer/use-web3signer).
:::

Possible values are:

| Network    | Chain            | Type       | Description                                      |
| :--------- | :--------------- | :--------- | :----------------------------------------------- |
| `mainnet`  | Consensus layer  | Production | Ethereum main network.                           |
| `minimal`  | Consensus layer  | Test       | Used for local testing and development networks. |
| `sepolia`  | Consensus layer  | Test       | Multi-client [permissioned](https://notes.ethereum.org/zvkfSmYnT0-uxwwEegbCqg) testnet.|
| `holesky`  | Consensus layer  | Test       | Multi-client testnet.                            |
| `hoodi`    | Consensus layer  | Test       | Multi-client testnet.                            |
| `lukso`    | Consensus layer  | Production | Lukso main network.                              |
| `gnosis`   | Consensus layer  | Production | Gnosis main network.                             |
| `chiado`   | Consensus layer  | Test       | Multi-client Gnosis testnet.                     |

#### `proxy-keystores-password-file`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--proxy-keystores-password-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example">

```bash
--proxy-keystores-password-file=password.txt
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable">

```bash
WEB3SIGNER_ETH2_PROXY_KEYSTORES_PASSWORD_FILE=password.txt
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file">

```bash
eth2.proxy-keystores-password-file: "password.txt"
```

  </TabItem>
</Tabs>

The path to the password file used to encrypt or decrypt the proxy keystores
located at [`--proxy-keystores-path`](#proxy-keystores-path),
when using the [Commit-Boost API](https://commit-boost.github.io/commit-boost-client/api).

[`--commit-boost-api-enabled`](#commit-boost-api-enabled) must be set
to `true`.

#### `proxy-keystores-path`

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--proxy-keystores-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example">

```bash
--proxy-keystores-path=/home/me/proxy-keystores
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable">

```bash
WEB3SIGNER_ETH2_PROXY_KEYSTORES_PATH=/home/me/proxy-keystores
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file">

```bash
eth2.proxy-keystores-path: "/home/me/proxy-keystores"
```

  </TabItem>
</Tabs>

The path to a directory to store the generated proxy keystores when using the
[Commit-Boost API](https://commit-boost.github.io/commit-boost-client/api).
The Web3Signer process should have read-write access to this directory.

[`--commit-boost-api-enabled`](#commit-boost-api-enabled) must be set
to `true`.

Specify a password file for the proxy keystores using
[`--proxy-keystores-password-file`](#proxy-keystores-password-file).

#### `slashing-protection-db-health-check-interval-milliseconds`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-db-health-check-interval-milliseconds=<INTERVAL>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-db-health-check-interval-milliseconds=20000
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_DB_HEALTH_CHECK_INTERVAL_MILLISECONDS=20000
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-db-health-check-interval-milliseconds: 20000
```

  </TabItem>
</Tabs>

Milliseconds between the slashing protection database health checks.
The default is 30000.

The service responds with a `200` message if healthy, and `503` if unhealthy.

#### `slashing-protection-db-health-check-timeout-milliseconds`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-db-health-check-timeout-milliseconds=<INTERVAL>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-db-health-check-timeout-milliseconds=2000
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_DB_HEALTH_CHECK_TIMEOUT_MILLISECONDS=2000
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-db-health-check-timeout-milliseconds: 2000
```

  </TabItem>
</Tabs>

Milliseconds after which to fail the database health check.
For example, if the health check connects to the slashing protection database, but does not report
back in a timely manner.

The default is 3000.

#### `slashing-protection-db-password`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-db-password=<PASSWORD>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-db-password=changeme
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_DB_PASSWORD=changeme
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-db-password: "changeme"
```

  </TabItem>
</Tabs>

The password to connect to the slashing protection database.

#### `slashing-protection-db-pool-configuration-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-db-pool-configuration-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-db-pool-configuration-file=/Users/me/config/HikariConfig.properties
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_DB_POOL_CONFIGURATION_FILE=/Users/me/config/HikariConfig.properties
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-db-pool-configuration-file: "/Users/me/config/HikariConfig.properties"
```

  </TabItem>
</Tabs>

[HikariCP connection pool configuration file](https://github.com/brettwooldridge/HikariCP#gear-configuration-knobs-baby).

Web3Signer uses HikariCP to manage database connections, and uses the default configuration values.
The defaults perform well in most deployments, but you can override them using this option.

#### `slashing-protection-db-url`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-db-url=<JDBC_URL>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-db-url=jdbc:postgresql://localhost/web3signer
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_DB_URL=jdbc:postgresql://localhost/web3signer
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-db-url: "jdbc:postgresql://localhost/web3signer"
```

  </TabItem>
</Tabs>

The Java Database Connectivity (JDBC) URL of the slashing protection database.

:::note
If using a non-default port number for your PostgreSQL database, then [include the port number in the database URL].
:::

#### `slashing-protection-db-username`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-db-username=<USERNAME>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-db-username=postgres
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_DB_USERNAME=postgres
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-db-username: "postgres"
```

  </TabItem>
</Tabs>

The username to use when connecting to the slashing protection database.

#### `slashing-protection-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-enabled=false
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_ENABLED=false
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-enabled: false
```

  </TabItem>
</Tabs>

Enables Web3Signer [slashing protection].
If `true`, then all signing operations are validated against historical data before signing.

The default is `true`.

#### `slashing-protection-pruning-at-boot-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-pruning-at-boot-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-pruning-at-boot-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_PRUNING_AT_BOOT_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```yaml
eth2.slashing-protection-pruning-at-boot-enabled: true
```

  </TabItem>
</Tabs>

When set to `true`, [slashing protection database pruning](../../how-to/configure-slashing-protection.md#prune-the-slashing-protection-database)
is enabled at startup and at the defined [pruning intervals](#slashing-protection-pruning-interval).

The default is `false`.

#### `slashing-protection-pruning-db-pool-configuration-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-pruning-db-pool-configuration-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-pruning-db-pool-configuration-file=/Users/me/config/HikariConfig.properties
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_PRUNING_DB_POOL_CONFIGURATION_FILE=/Users/me/config/HikariConfig.properties
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.slashing-protection-pruning-db-pool-configuration-file: "/Users/me/config/HikariConfig.properties"
```

  </TabItem>
</Tabs>

[HikariCP connection pool configuration file](https://github.com/brettwooldridge/HikariCP#gear-configuration-knobs-baby)
used by the pruning process.

Web3Signer uses HikariCP to manage database connections, and uses the default configuration values.
The defaults perform well in most deployments, but you can override them using this option.

#### `slashing-protection-pruning-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-pruning-enabled=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-pruning-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_PRUNING_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```yaml
eth2.slashing-protection-pruning-enabled: true
```

  </TabItem>
</Tabs>

Enables [slashing protection database pruning](../../how-to/configure-slashing-protection.md#prune-the-slashing-protection-database).
The default is `false`.

#### `slashing-protection-pruning-epochs-to-keep`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-pruning-epochs-to-keep=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-pruning-epochs-to-keep=64
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_PRUNING_EPOCHS_TO_KEEP=64
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```yaml
eth2.slashing-protection-pruning-epochs-to-keep: 64
```

  </TabItem>
</Tabs>

Number of epochs to keep when pruning the slashing protection database.

The default is 250.

#### `slashing-protection-pruning-interval`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-pruning-interval=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-pruning-interval=48
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_PRUNING_INTERVAL=48
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```yaml
eth2.slashing-protection-pruning-interval: 48
```

  </TabItem>
</Tabs>

Hours between slashing protection database pruning operations.

The default is 24.

#### `slashing-protection-pruning-slots-per-epoch`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slashing-protection-pruning-slots-per-epoch=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slashing-protection-pruning-slots-per-epoch=20
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_SLASHING_PROTECTION_PRUNING_SLOTS_PER_EPOCH=20
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```yaml
eth2.slashing-protection-pruning-slots-per-epoch: 20
```

  </TabItem>
</Tabs>

Number of slots per epoch.
This number multiplied by the number of epochs to keep determines what blocks to keep when pruning
the slashing protection database.

The default is 32 as defined on Mainnet.

### `eth2 export`

Exports the slashing protection database to a file.

#### `to`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--to=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--to=/Users/me/my_node/interchange.json
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_EXPORT_TO=/Users/me/my_node/interchange.json
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.export.to: /Users/me/my_node/interchange.json
```

  </TabItem>
</Tabs>

The file to export the slashing protection database to.
The exported file uses the [validator client interchange format].

### `eth2 import`

Imports a slashing protection database from a file.

#### `from`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--from=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--from=/Users/me/my_node/interchange.json
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ETH2_IMPORT_FROM=/Users/me/my_node/interchange.json
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
eth2.import.from: /Users/me/my_node/interchange.json
```

  </TabItem>
</Tabs>

The file to import the slashing protection database from.
The file must be formatted in the [validator client interchange format].

### `watermark-repair`

Updates the [slashing protection low or high watermark](https://eips.ethereum.org/EIPS/eip-3076) for all validators.
You can only increase the low watermark, not decrease it.
If you set the high watermark, you should set this to a future epoch and slot.
Setting a high watermark prevents the validator from signing at or beyond this point.

:::caution
We only recommend this subcommand for advanced users.
:::

#### `epoch`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--epoch=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--epoch=30000
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_WATERMARK_REPAIR_EPOCH=30000
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
watermark-repair.epoch: 30000
```

  </TabItem>
</Tabs>

Low watermark to set the attestation source and target to.
(Sets the high watermark epoch when [`--set-high-watermark`](#set-high-watermark) is `true`.)

#### `slot`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--slot=<LONG>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--slot=20000
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_WATERMARK_REPAIR_SLOT=20000
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
watermark-repair.slot: 20000
```

  </TabItem>
</Tabs>

Low watermark to set the block slot to.
(Sets the high watermark slot when [`--set-high-watermark`](#set-high-watermark) is `true`.)

#### `remove-high-watermark`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--remove-high-watermark=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--remove-high-watermark=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_REMOVE_HIGH_WATERMARK=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
watermark-repair.remove-high-watermark: true
```

  </TabItem>
</Tabs>

Removes the high watermark.
When set to `true`, all other `watermark-repair` options are ignored.
The default is `false`.

#### `set-high-watermark`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--set-high-watermark=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--set-high-watermark=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_SET_HIGH_WATERMARK=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
watermark-repair.set-high-watermark: true
```

  </TabItem>
</Tabs>

Sets the high watermark to the specified [epoch](#epoch) and [slot](#slot).
(Sets the low watermark when [`--set-high-watermark`](#set-high-watermark) is `false`.)
The default is `false`.

<!-- links -->

[include the port number in the database URL]: https://jdbc.postgresql.org/documentation/head/connect.html
[slashing protection]: ../../concepts/slashing-protection.md
[validator client interchange format]: https://eips.ethereum.org/EIPS/eip-3076
[consensus specification]: https://github.com/ethereum/consensus-specs/tree/master/configs
