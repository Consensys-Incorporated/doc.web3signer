---
title: Run Web3Signer from Docker
description: Run Web3Signer using the official Docker image.
sidebar_position: 2
---

# Run Web3Signer from Docker image

A Docker image is provided to run Web3Signer in a Docker container.

## Prerequisites

- [Docker](https://docs.docker.com/install/)

- MacOS or Linux

:::caution Important

The Docker image does not run on Windows.

:::

## Run Docker image

Display the Web3Signer command line help using the Docker image:

```bash
docker run consensys/web3signer:develop --help
```

## Expose listening port

To use the default listening port (`9000`) or the port specified using `--http-listen-port`, you must expose the listening port.

To run Web3Signer exposing listening port for access:

```bash
docker run -p <listenPort>:9000 consensys/web3signer:develop [options] [subcommand] [options]
```
