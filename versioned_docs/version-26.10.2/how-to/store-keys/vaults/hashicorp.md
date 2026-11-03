---
sidebar_label: Use HashiCorp Vault
description: Store keys in HashiCorp Vault.
sidebar_position: 1
---

# Use Web3Signer with HashiCorp Vault

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Web3Signer supports storing the signing key in [HashiCorp Vault](https://www.hashicorp.com/en/products/vault).

## Store a private key in HashiCorp Vault

After installing [HashiCorp Vault](https://learn.hashicorp.com/vault/getting-started/install) and
[starting the server](https://learn.hashicorp.com/vault/getting-started/dev-server):

<!-- markdownlint-disable -->

1. Set the `VAULT_ADDR` environment variable using the command displayed after starting the server:

   ```bash
   export VAULT_ADDR='http://127.0.0.1:8200'
   ```

2. Copy or save the root token displayed after starting the server in a file.

3. Enable the secret mount point using [KV v2 engine](https://www.vaultproject.io/docs/secrets/kv/kv-v2).
   Using Vault CLI, enable the KV v2 `secret` mount point:

   ```bash
   vault secrets enable -path=secret kv-v2
   ```

   :::note
   Use `kv-v2` type as indicated in KV v2 doc. Web3Signer only works with v2 secrets.
   :::

   If the engine used is V2, the secret is versioned and you can see the metadata with version field:

   ```bash
   vault kv get /secret/web3signerSigningKey
   ```

<Tabs>

   <TabItem value="Result if v2 (with metadata)" label="Result if v2 (with metadata)" default>

   ```text
   ====== Metadata ======
   Key              Value
   ---              -----
   created_time     2020-11-27T10:15:59.91752Z
   deletion_time    n/a
   destroyed        false
   version          1

   ==== Data ====
   Key      Value
   ---      -----
   value    17079f966aa2d5db1678ed32467165bbbd640868e7371ade8d5812ea856d2bbf
   ```

   </TabItem>
   <TabItem value="Result if v1" label="Result if v1" >

   ```text
   ==== Data ====
   Key      Value
   ---      -----
   value    17079f966aa2d5db1678ed32467165bbbd640868e7371ade8d5812ea856d2bbf
   ```

  </TabItem>
</Tabs>

4. [Write the key in HashiCorp Vault](https://learn.hashicorp.com/vault/getting-started/first-secret)
   as a hex string (without `0x` prefix):

<Tabs>

  <TabItem value="Command" label="Command" default>

   ```bash
   vault kv put secret/web3signerSigningKey value=<Private Key without 0x prefix>
   ```

  </TabItem>
  <TabItem value="Example" label="Example" >

   ```bash
   vault kv put secret/web3signerSigningKey value=17079f966aa2d5db1678ed32467165bbbd640868e7371ade8d5812ea856d2bbf
   ```

  </TabItem>
</Tabs>

## Create the known servers file

The known servers file is required if TLS is enabled, to disable TLS set
[`tlsEnabled`](../../../reference/key-config-file-params.md#hashicorp-vault) to `false`.

Specify the location of the known servers file in the
[`tlsKnownServersPath`](../../../reference/key-config-file-params.md#hashicorp-vault) option of the
[signing key configuration file].

The file contents use the format `<hostname>:<port> <hex-string>` where:

- `<hostname>` is the server hostname.
- `<port>` is the port used for communication.
- `<hex-string>` is the SHA-256 fingerprint of the server's certificate.

```
localhost:8200 7C:B3:3E:F9:98:43:5E:62:69:9F:A9:9D:41:14:03:BA:83:24:AC:04:CE:BD:92:49:1B:8D:B2:A4:86:39:4C:BB
127.0.0.1:8200 7C:B3:3E:F9:98:43:5E:62:69:9F:A9:9D:41:14:03:BA:83:24:AC:04:CE:BD:92:49:1B:8D:B2:A4:86:39:4C:BB
```

[Start Web3Signer and specify the location of the signing key configuration file].

<!-- Links -->

[signing key configuration file]: ../../load-keys.md#use-key-configuration-files
[Start Web3Signer and specify the location of the signing key configuration file]: ../../../get-started/start-web3signer.md

<!-- markdownlint-enable -->
