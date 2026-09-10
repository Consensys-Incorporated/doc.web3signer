---
title: Run Web3Signer from Docker
description: Run Web3Signer using the official Docker images.
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Run Web3Signer from Docker image

Web3Signer publishes two Docker images.
Both include Eclipse Temurin JRE 25 and the same Web3Signer application.

- Ubuntu image (`consensys/web3signer:<version>`).
  Includes a shell and runs as the `web3signer` user.
- Distroless image (`consensys/web3signer:<version>-distroless`).
  Based on [Google Distroless](https://github.com/GoogleContainerTools/distroless).
  Has no shell and no package manager, and runs as UID `65532`.

Replace `<version>` with `latest` or a release tag.

## Prerequisites

- [Docker](https://docs.docker.com/install/)

- MacOS or Linux

:::caution Important

The Docker image does not run on Windows.

:::

## Run Docker image

Display the Web3Signer command line help:

<Tabs>
  <TabItem value="Ubuntu" label="Ubuntu" default>

```bash
docker run consensys/web3signer:<version> --help
```

  </TabItem>
  <TabItem value="Distroless" label="Distroless">

```bash
docker run consensys/web3signer:<version>-distroless --help
```

  </TabItem>
</Tabs>

## Expose listening port

To use the default listening port (`9000`) or the port specified using `--http-listen-port`, you
must expose the listening port.

<Tabs>
  <TabItem value="Ubuntu" label="Ubuntu" default>

```bash
docker run -p <listenPort>:9000 consensys/web3signer:<version> [options] [subcommand] [options]
```

  </TabItem>
  <TabItem value="Distroless" label="Distroless">

```bash
docker run -p <listenPort>:9000 consensys/web3signer:<version>-distroless [options] [subcommand] [options]
```

  </TabItem>
</Tabs>

## Use the distroless image

The distroless image does not require `--read-only`.
For optional read-only root filesystem hardening, the `JAVA_OPTS` difference, and key manager
imports that skip disk writes, see [Run the distroless Docker image](../how-to/run-distroless-docker.md).
