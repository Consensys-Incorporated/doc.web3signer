---
title: Start Web3Signer
description: Start Web3Signer.
sidebar_position: 4
---

# Start Web3Signer

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
This documentation has been updated in line with the name changes [recommended by the Ethereum
Foundation](https://blog.ethereum.org/2022/01/24/the-great-eth2-renaming/).
The execution layer is formerly "Ethereum 1.0." The consensus layer is formerly "Ethereum 2.0."
:::

**Prerequisites**:

- [Signing key configuration files] to access the required signing keys.

Web3Signer supports consensus layer clients, and execution layer clients, so you
must specify the signing mode, and the location of the signing key configuration files when starting Web3Signer.

<Tabs>
  <TabItem value="Consensus layer client" label="Consensus layer client" default>

```bash
web3signer --key-store-path=/Users/me/keyFiles/ eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" --slashing-protection-db-username=postgres --slashing-protection-db-password=password
```

  </TabItem>
  <TabItem value="Execution layer client" label="Execution layer client" >

```bash
web3signer --key-store-path=/Users/me/keyFiles/ eth1
```

  </TabItem>
</Tabs>

In the command line:

- Use the [`--key-store-path`](../reference/cli/options.md#key-config-path-key-store-path) option to specify the
  location of the signing key configuration files.
- Specify the [subcommand] to indicate which signing mode to use.
  Valid subcommands are `eth2` and `eth1`.
  You can only specify one signing mode when starting Web3Signer.

## Consensus layer considerations

Consensus layer [slashing protection] is enabled by default, and you must specify the details the
[slashing protection database], or disable slashing protection using the
[`--slashing-protection-db-enabled`](../reference/cli/subcommands.md#slashing-protection-enabled)
command line option.

:::note
Web3Signer also allows you to [bulk load signing keys] stored in Azure Key Vault.
:::

Start the client, for example [Teku] by specifying the Web3Signer details.

:::important
If Teku connects to a network other than `mainnet`, then the
[`--network`](../reference/cli/subcommands.md#network) option must be specified, and it must match
the network used by the Teku client.
:::

### Public testnets

If you are running Web3Signer `eth2` mode on a public testnet, then you must specify the `network` option.
It's important that this network matches the one you set up for your validator client.
For example, if you have [Teku set up to run on
Holesky](https://docs.teku.consensys.net/get-started/connect/testnet#sync-the-execution-layer-network)
then you must configure Web3Signer with the Holesky network under the `eth2` subcommand, as in the
following example.

```bash
web3signer --key-store-path=/Users/me/keyFiles/ eth2 --network=holesky --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" --slashing-protection-db-username=postgres --slashing-protection-db-password=password
```

See the [`--network` documentation](../reference/cli/subcommands.md#network) for more information
about this option and the supported networks.

## Confirm Web3Signer is running

Use the [`upcheck`](https://consensys-incorporated.github.io/web3signer/#tag/Server-Status/operation/UPCHECK)
endpoint to confirm Web3Signer is connected and running.

<Tabs>
  <TabItem value="curl request" label="curl request" default>

```bash
curl -X GET http://localhost:9000/upcheck
```

  </TabItem>
  <TabItem value="Result" label="Result" >

```json
200 OK
```

  </TabItem>
</Tabs>

Web3Signer by default also performs a health check on the
[slashing protection database].

<!-- Links -->

[Signing key configuration files]: ../how-to/load-keys.md#use-key-configuration-files
[Teku]: https://docs.teku.consensys.net/how-to/use-external-signer/use-web3signer
[subcommand]: ../reference/cli/subcommands.md
[bulk load signing keys]: ../how-to/load-keys.md#bulk-load-keys
[slashing protection]: ../concepts/slashing-protection.md
[slashing protection database]: ../how-to/configure-slashing-protection.md
