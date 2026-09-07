---
title: Build from source
description: Build Web3Signer from the source code.
sidebar_position: 3
---

# Build from source

## Prerequisites

- [Java JDK](https://jdk.java.net/)

:::caution Important

Web3Signer requires Java 25 or later releases.

:::

- [Git](https://git-scm.com/downloads) or [GitHub Desktop](https://desktop.github.com/)

## Installation on Linux / Unix / macOS

### Clone the Web3Signer repository

Clone the `Consensys/web3signer` repository:

```bash
git clone --recursive https://github.com/Consensys/web3signer.git
```

### Build Web3Signer

After cloning, go to the `web3signer` directory.

```bash
cd web3signer
```

Build Web3Signer with the Gradle wrapper `gradlew`:

```bash
./gradlew distTar
```

Go to the distribution directory:

```bash
cd build/distributions/
```

Expand the distribution archive:

```bash
tar -xzf web3signer-<version>.tar.gz
```

Move to the expanded folder and display the Web3Signer help to confirm installation.

```bash
cd web3signer-<version>/
bin/web3signer --help
```

## Installation on Windows

### Install Web3Signer

Clone the `Consensys/web3signer` repository:

```bat
git clone --recursive https://github.com/Consensys/web3signer.git
```

### Build Web3Signer

Go to the `web3signer` directory:

```bat
cd web3signer
```

Build Web3Signer with the Gradle wrapper `gradlew`:

```bat
./gradlew distZip
```

:::note

To run `gradlew`, you must have the **JAVA_HOME** system variable set to the Java installation directory. For example: `JAVA_HOME = C:\Program Files\Java\jdk1.8.0_181`.

:::

Go to the distribution directory:

```bat
cd build/distributions
```

Expand the distribution archive:

```bat
tar -xzf web3signer-<version>.tar.gz
```

Go to the expanded folder and display the Web3Signer help to confirm installation.

```bat
cd web3signer-<version>
bin/web3signer --help
```
