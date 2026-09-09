---
title: Run the distroless Docker image
description: Run the Web3Signer distroless image with a read-only root filesystem.
sidebar_position: 9
keywords:
  [
    docker,
    distroless,
  ]
---

# Run the distroless Docker image

Run the distroless image with a read-only container root filesystem.

To pull the image and start a container, see
[Run Web3Signer from Docker](../get-started/use-docker.md).

Replace `<version>` with `latest` or a release tag.

## Prerequisites

- The distroless image tag (`consensys/web3signer:<version>-distroless`).
- A host path for keys or configuration you need to mount into the container.

## Run with a read-only root filesystem

A read-only root filesystem (`docker run --read-only` or Kubernetes `readOnlyRootFilesystem`) makes
the container root unwritable.
If the process is compromised, it cannot install tools, rewrite binaries, or leave files on the
image filesystem.

This setting applies to the container root.
It is not the key manager API `readonly` field on listed keys.

Web3Signer can still write to mounted volumes.
The distroless image starts under `--read-only` without a `/tmp` mount.
Add a writable `/tmp` only if extra tooling in the container writes there.

1. Run with `--read-only` and mount any paths Web3Signer must write.

   ```bash
   docker run --read-only -p 9000:9000 \
     -v <host-keys-path>:/keys:ro \
     consensys/web3signer:<version>-distroless \
     --key-store-path=/keys \
     eth2 --slashing-protection-enabled=false
   ```

   Consensus layer slashing protection is enabled by default.
   Disable it as in this example, or configure a [slashing protection](./configure-slashing-protection.md)
   database.

1. In Kubernetes, set `readOnlyRootFilesystem` on the container.

   ```yaml
   securityContext:
     readOnlyRootFilesystem: true
     runAsNonRoot: true
     runAsUser: 65532
   ```

Mount keys, configuration, and any on-disk data as volumes.
Only the container root filesystem is read-only.

Typical writable mounts include:

- [`--key-store-path`](../reference/cli/options.md#key-config-path-key-store-path) if the [key manager API](./manage-keys.md) writes imported keystores.
- [`--data-path`](../reference/cli/options.md#data-path) if you configure a data directory.
- File log paths, if you log to a file.

PostgreSQL slashing protection writes to the database, not the container root.

## Pass JVM options

The Ubuntu image reads `JAVA_OPTS` in its shell launcher.
The distroless image has no shell and starts `java` directly, so `JAVA_OPTS` is ignored.

Set JVM options with one of these environment variables:

- `JDK_JAVA_OPTIONS` (preferred). The Java launcher reads this variable.
- `JAVA_TOOL_OPTIONS`. Every JVM-based tool reads this variable.
  Use it if the same value must work for both image variants.

```bash
docker run -p 9000:9000 \
  -e JDK_JAVA_OPTIONS='-Xmx3g -Xms2g -XX:+UseG1GC' \
  consensys/web3signer:<version>-distroless \
  eth2 --slashing-protection-enabled=false
```

You can pass system properties the same way, including a custom Log4j2 file.
Mount that file into the container.

```bash
docker run -p 9000:9000 \
  -v <host-log4j-path>:/var/config/log4j2.xml:ro \
  -e JDK_JAVA_OPTIONS='-Dlog4j.configurationFile=/var/config/log4j2.xml' \
  consensys/web3signer:<version>-distroless \
  eth2 --slashing-protection-enabled=false
```

If a value contains spaces, backslash-escape the spaces in `JDK_JAVA_OPTIONS`.

See [Configure logging](./monitor/logging.md).

## Use the key manager API on a read-only root

[Importing keystores](./manage-keys.md#import-keystores) writes files under `--key-store-path`.
That write fails when the key store path is on a read-only root filesystem.

To keep imported keys in memory only, set the early access
`--Xkey-manager-skip-keystore-storage` option on the `eth2` subcommand:

```bash
docker run --read-only -p 9000:9000 \
  consensys/web3signer:<version>-distroless \
  eth2 --key-manager-api-enabled=true \
       --Xkey-manager-skip-keystore-storage=true \
       --slashing-protection-enabled=false
```

:::tip Early access feature

`--Xkey-manager-skip-keystore-storage` is an early access option and is hidden from `--help`.
Imported keys exist only in memory and are lost on restart.
Re-import keys after every restart.
Do not use this option unless you have a keystore backup.

:::

## Limitations

- There is no shell, so you cannot open an interactive debug session in the container.
- Host bind mounts must be readable by UID `65532`.
- `JAVA_OPTS` has no effect on the distroless image.
