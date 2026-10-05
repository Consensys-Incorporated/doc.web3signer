---
title: Run the distroless Docker image
description: Run the Web3Signer distroless Docker image, including optional read-only root filesystem hardening.
sidebar_position: 9
keywords:
  [
    docker,
    distroless,
  ]
---

# Run the distroless Docker image

The [distroless](https://github.com/GoogleContainerTools/distroless) image is an alternative to the
Ubuntu image. It has no shell and no package manager, and it runs as UID `65532`.

A read-only container root filesystem is optional.
The distroless image is built to start under `docker run --read-only` (or Kubernetes
`readOnlyRootFilesystem`) without a `/tmp` mount.
Use that mode when you want to prevent writes to the image filesystem.

To pull the image and start a container without `--read-only`, see
[Run Web3Signer from Docker](../get-started/use-docker.md).

## Prerequisites

- [Docker](https://docs.docker.com/install/)

The image includes its own Java runtime.

## Run with a read-only root filesystem

A read-only root filesystem (`docker run --read-only` or Kubernetes `readOnlyRootFilesystem`) makes
the container root unwritable.
If the process is compromised, it cannot install tools, rewrite binaries, or leave files on the
image filesystem.

:::important
This setting applies to the container root.
It is not the key manager API `readonly` field on listed keys.
:::

Web3Signer can still write to mounted volumes.
The distroless image starts under `--read-only` without a `/tmp` mount.
Add a writable `/tmp` only if extra tooling in the container writes there.

Run with `--read-only` and mount keys read-only:

```bash
docker run --read-only -p 9000:9000 \
  -v <host-keys-path>:/keys:ro \
  consensys/web3signer:<version>-distroless \
  --key-store-path=/keys \
  eth2 --slashing-protection-enabled=false
```

Mount keys, configuration, and any on-disk data as volumes.
Only the container root filesystem is read-only.

Typical writable mounts include:

- [`--key-store-path`](../reference/cli/options.md#key-config-path-key-store-path) if the [key manager API](./manage-keys.md) writes imported keystores.
- [`--data-path`](../reference/cli/options.md#data-path) if you configure a data directory.
- File log paths, if you log to a file.

Grant UID `65532` write access on a directory Web3Signer writes, or start the container with
`--user` set to a UID that already has that access.

If [`--data-path`](../reference/cli/options.md#data-path) is set and Web3Signer cannot write
`web3signer.ports`, it logs `Error writing ports file` and keeps serving requests.
A key manager import that cannot write the keystore reports
`Error importing keystore: Unable to add validator` for that keystore.
The container keeps running.

PostgreSQL slashing protection writes to the database, not the container root.

## Pass JVM options

You do not need extra JVM flags to start the distroless image.

If you already set heap size, GC flags, or system properties, the Ubuntu image and binary
distribution read `JAVA_OPTS`.
The distroless image has no shell and starts `java` directly, so `JAVA_OPTS` is ignored.

Use `JDK_JAVA_OPTIONS` (preferred) or `JAVA_TOOL_OPTIONS` instead:

```bash
docker run -p 9000:9000 \
  -e JDK_JAVA_OPTIONS='-Xmx3g -Xms2g' \
  consensys/web3signer:<version>-distroless \
  eth2 --slashing-protection-enabled=false
```

If a value contains spaces, backslash-escape the spaces in `JDK_JAVA_OPTIONS`.

Pass a debug agent, such as JDWP, in `JDK_JAVA_OPTIONS`.
`docker kill -s QUIT <container>` prints a JVM thread dump to the container logs.
Tools that attach to the JVM, such as `jcmd`, need a writable temporary directory.
With `--read-only`, mount a writable `/tmp` before using those tools.

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

- There is no shell, so `docker exec -it <container> sh` is unavailable.
- Bind mounts that Web3Signer reads must be readable by UID `65532`.
  Bind mounts that it writes must be writable by UID `65532`.
- `JAVA_OPTS` has no effect.
  Use `JDK_JAVA_OPTIONS` or `JAVA_TOOL_OPTIONS`.
  See [Pass JVM options](#pass-jvm-options).
