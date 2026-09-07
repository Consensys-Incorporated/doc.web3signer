---
title: Configure TLS
description: Configure secure communication using TLS.
sidebar_position: 7
---

# Configure TLS

Configure TLS communication from the command line to allow clients (for example [Teku], a dapp, or
curl) and Web3Signer to communicate securely.

Web3Signer provides multiple options to configure client TLS access:

- Specify one or more authorized clients using a [known clients file](#create-the-known-clients-file).
- [Allow all clients with trusted CA certificates to connect].
- [Allow any client to connect].

This example uses a known clients file to limit access to specified clients.

:::info
The [Teku tutorial] provides step-by-step instructions to configure the Teku client and Web3Signer
for TLS communication, including creating the required keystores and truststore.
:::

## Prerequisites

**Web3Signer prerequisites**:

- Web3Signer's password-protected PKCS #12 keystore.
- File containing the keystore password.

**Client prerequisites**:

- The client must be configured for TLS.
- Client's PKCS #12 keystore information.

## Create the known clients file

Create a file (in this example, `knownClients.txt`) that lists one or more clients that are trusted
to connect to Web3Signer.
The file can contain clients that use trusted CA or self-signed certificates.

The file contents use the format `<common_name> <hex-string>` where:

- `<common_name>` is the Common Name used for the client's keystore
- `<hex-string>` is the SHA-256 fingerprint of the client's keystore.

```bash
curl_client DF:65:B8:02:08:5E:91:82:0F:91:F5:1C:96:56:92:C4:1A:F6:C6:27:FD:6C:FC:31:F2:BB:90:17:22:59:5B:50
```

You can use [OpenSSL](https://www.openssl.org/) or
[keytool](https://docs.oracle.com/javase/6/docs/technotes/tools/solaris/keytool.html) to display the
client's Common Name and fingerprint.
For example:

```bash
keytool -list -v -keystore <keystore> -storetype PKCS12 -storepass <password>
```

## Start Web3Signer

```bash
web3signer --key-store-path=/Users/me/keyFiles/ \
--tls-keystore-file=/Users/me/certs/web3signerKeystore.p12 \
--tls-keystore-password-file=/Users/me/certs/password.txt \
--tls-known-clients-file=/Users/me/certs/knownClients.txt
```

The command line:

- Specifies the location of the signing key configuration files using the
  [`--key-store-path`](../reference/cli/options.md#key-config-path-key-store-path) option.
- Specifies the Web3Signer keystore using the
  [`--tls-keystore-file`](../reference/cli/options.md#tls-keystore-file) option.
- Specifies the file that contains the password to decrypt the keystore using the
  [`--tls-keystore-password-file`](../reference/cli/options.md#tls-keystore-password-file) option.
- [Specifies the clients](#create-the-known-clients-file) that are trusted to connect to Web3Signer
  using the [`tls-known-clients-file`](../reference/cli/options.md#tls-known-clients-file) option.

:::note
Use the [`--tls-allow-any-client`](../reference/cli/options.md#tls-allow-any-client) option to allow
access to any client, or [`--tls-allow-ca-clients`](../reference/cli/options.md#tls-allow-ca-clients)
to allow access to any client with a trusted CA certificate.

You can't use [`--tls-allow-any-client`](../reference/cli/options.md#tls-allow-any-client) with
[`tls-known-clients-file`](../reference/cli/options.md#tls-known-clients-file) or
[`--tls-allow-ca-clients`](../reference/cli/options.md#tls-allow-ca-clients).
:::

## Server TLS connection

Allow Web3Signer to send and receive secure HTTP JSON-RPCs from the server (for example Besu).

:::note
This can only be used when Web3Signer is eth1 mode.
:::

**Server prerequisites**:

- [The server must be configured to allow TLS communication](https://besu.hyperledger.org/private-networks/how-to/configure/tls/client-and-server).
- Server's password-protected PKCS #12 keystore information.

### Create the known servers file

Create a file (in this example, `knownServers`) that lists one or more trusted servers.
The file contents use the format `<hostname>:<port> <hex-string>` where:

- `<hostname>` is the server hostname
- `<port>` is the port used for communication
- `<hex-string>` is the SHA-256 fingerprint of the server's certificate.

```bash
localhost:8590 6C:B2:3E:F9:88:43:5E:62:69:9F:A9:9D:41:14:03:BA:83:24:AC:04:CE:BD:92:49:1B:8D:B2:A4:86:39:4C:BB
127.0.0.1:8590 6C:B2:3E:F9:88:43:5E:62:69:9F:A9:9D:41:14:03:BA:83:24:AC:04:CE:BD:92:49:1B:8D:B2:A4:86:39:4C:BB
```

:::note
Specify both hostname and IP address in the file if unsure which is used in requests.
:::

### Start Web3Signer

```bash
web3signer eth1 --downstream-http-tls-enabled \
--downstream-http-tls-keystore-file=/Users/me/my_node/keystore.pfx \
--downstream-http-tls-keystore-password-file=/Users/me/my_node/keyPassword \
--downstream-http-tls-known-servers-file=/Users/me/my_node/knownServers
```

The command line:

- Enables TLS using the
  [`--downstream-http-tls-enabled`](../reference/cli/subcommands.md#downstream-http-tls-enabled) option.
- Specifies the keystore to present during authentication using the
  [`--downstream-http-tls-keystore-file`](../reference/cli/subcommands.md#downstream-http-tls-keystore-file) option.
- Specifies the file that contains the password to decrypt the keystore using the
  [`--downstream-http-tls-keystore-password-file`](../reference/cli/subcommands.md#downstream-http-tls-keystore-password-file) option.
- [Specifies the servers](#create-the-known-servers-file) to connect to using the
  [`--downstream-http-tls-known-servers-file`](../reference/cli/subcommands.md#downstream-http-tls-known-servers-file) option.

:::note
The [`--downstream-http-tls-ca-auth-enabled`](../reference/cli/subcommands.md#downstream-http-tls-ca-auth-enabled)
option is `true` by default and allows connections to servers with trusted root CAs.
:::

<!-- links -->

[Allow all clients with trusted CA certificates to connect]: ../reference/cli/options.md#tls-allow-ca-clients
[Allow any client to connect]: ../reference/cli/options.md#tls-allow-any-client
[Teku]: https://docs.teku.consensys.net/
[Teku tutorial]: https://docs.teku.consensys.net/tutorials/configure-external-signer-tls
