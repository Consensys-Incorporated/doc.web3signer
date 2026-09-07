---
title: Install binary distribution
description: Install Web3Signer from a binary distribution.
sidebar_position: 1
---

# Install binary distribution

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prerequisites

- [Java JDK](https://jdk.java.net/)

:::caution Important

Web3Signer requires Java 25 or later releases.

:::

## Install binaries

Download the Web3Signer [packaged binaries](https://github.com/Consensys/web3signer/releases/latest).

:::tip
View the [**Releases** page](https://github.com/Consensys/web3signer/releases) to download a specific version.
:::

Unpack the downloaded files and change into the `web3signer-<release>` directory.

Display Web3Signer command line help to confirm installation:

<Tabs>
  <TabItem value="Linux or MacOS" label="Linux or MacOS" default>

```bash
bin/web3signer --help
```

  </TabItem>
  <TabItem value="Windows" label="Windows">

```bat
bin\web3signer --help
```

  </TabItem>
</Tabs>
