---
sidebar_label: Options
description: Web3Signer command line options reference
sidebar_position: 1
---

# Web3Signer command line options

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This reference describes the syntax of the Web3Signer Command Line Interface (CLI) options.

## Specify options

Web3Signer options can be specified:

- On the command line.
- As an environment variable. For each command line option, the equivalent environment variable is:
  - Upper-case.
  - `_` replaces `-`.
  - Has a `WEB3SIGNER_` prefix.
- In a YAML configuration file.

If you specify an option in more than one place, the order of priority is command line, environment
variable, configuration file.

## Options

### `access-logs-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--access-logs-enabled[=<BOOLEAN>]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--access-logs-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_ACCESS_LOGS_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
access-logs-enabled-enabled: true
```

  </TabItem>
</Tabs>

Enables or disables access logs.
The default is `false`.

### `config-file`

Path to the [YAML configuration file](../../how-to/use-configuration-file-starting-web3signer.md).
The default is `none`.

<Tabs>
  <TabItem value="Syntax" label="Syntax" default>

```bash
--config-file=<FILE>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--config-file=/home/me/me_node/config.yaml
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_CONFIG_FILE=/home/me/me_node/config.yaml
```

  </TabItem>
</Tabs>

### `data-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--data-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--data-path=/Users/me/my_node/data
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_DATA_PATH=/Users/me/my_node/data
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
data-path: "/Users/me/my_node/data"
```

  </TabItem>
</Tabs>

Directory in which to store temporary files.

### `http-cors-origins`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--http-cors-origins=<httpListenHost>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--http-cors-origins=""http://medomain.com"
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_HTTP_CORS_ORIGINS=""http://medomain.com"
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
http-cors-origins=["https://meotherdomain.com"]
```

  </TabItem>
</Tabs>

A list of domain URLs for CORS validation.
You must enclose the URLs in double quotes and separate them with commas.

Listed domains can access the node using REST API.
If your client interacts with Web3Signer using a browser app, you must allow the client domains.

The default value is `none`.
If you do not allow any domains, browser apps cannot interact with your Web3Signer node.

:::tip
For testing and development purposes, use `"all"` or `"*"` to accept requests from any domain.
We don't recommend accepting requests from any domain for production environments.
:::

### `http-listen-host`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--http-listen-host=<httpListenHost>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--http-listen-host=8.8.8.8
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_HTTP_LISTEN_HOST=8.8.8.8
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
http-listen-host: "8.8.8.8"
```

  </TabItem>
</Tabs>

Host on which HTTP listens.
The default is `localhost`.

### `http-listen-port`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--http-listen-port=<httpListenPort>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--http-listen-port=6174
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_HTTP_LISTEN_PORT=6174
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
http-listen-port: 6174
```

  </TabItem>
</Tabs>

Port on which HTTP listens.
The default is 9000.

### `http-host-allowlist`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--http-host-allowlist=<hostname>[,<hostname>...]... or "*"
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--http-host-allowlist=medomain.com,meotherdomain.com
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_HTTP_HOST_ALLOWLIST=medomain.com,meotherdomain.com
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
http-host-allowlist: ["medomain.com", "meotherdomain.com"]
```

  </TabItem>
</Tabs>

A comma-separated list of hostnames to allow access to the REST APIs.
By default, Web3Signer accepts access from `localhost` and `127.0.0.1`.

:::tip
To allow all hostnames, use `"*"`.
We don't recommend allowing all hostnames for production environments.
:::

### `idle-connection-timeout-seconds`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--idle-connection-timeout-seconds=<TIMEOUT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--idle-connection-timeout-seconds=60
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_IDLE_CONNECTION_TIMEOUT_SECONDS=60
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
idle-connection-timeout-seconds: 60
```

  </TabItem>
</Tabs>

Number of seconds to wait before terminating an idle connection.
The default is 30.

### `key-config-path`, `key-store-path`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--key-config-path=<PATH>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--key-config-path=/Users/me/keys
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_KEY_CONFIG_PATH=/Users/me/keys
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
key-config-path: "/Users/me/keys"
```

  </TabItem>
</Tabs>

Path to the directory containing the [YAML files required to access keys].

### `key-store-config-file-max-size`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--key-store-config-file-max-size=<INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--key-store-config-file-max-size=158000000
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_KEY_STORE_CONFIG_FILE_MAX_SIZE=158000000
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
key-store-config-file-max-size: 158000000
```

  </TabItem>
</Tabs>

The maximum signing key configuration file size in bytes.
This is useful when you're loading a large number of
[signing key configurations from a single file](../key-config-file-params.md)

The default size is 104857600 bytes (100 MB).

### `logging`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
-l, --logging=<LEVEL>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--logging=DEBUG
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_LOGGING=DEBUG
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
logging: "DEBUG"
```

  </TabItem>
</Tabs>

Logging verbosity level.
Possible values are `OFF`, `FATAL`, `WARN`, `INFO`, `DEBUG`, `TRACE`, `ALL`.
The default is `INFO`.

### `logging-format`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--logging-format=<FORMAT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--logging-format=ECS
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_LOGGING_FORMAT=ECS
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
logging-format: "ECS"
```

  </TabItem>
</Tabs>

Logging format.
This option includes standard JSON structured logging formats.
Possible values are:

- `PLAIN` (default) - Traditional pattern-based console logging
- `ECS` - Elastic Common Schema JSON format
- `GCP` - Google Cloud Platform JSON format
- `LOGSTASH` - Logstash JSON Event Layout V1
- `GELF` - Graylog Extended Log Format

This enables users to select the format without requiring custom Log4j2 configuration files.
This is useful in containerized and cloud environments where injecting configuration files is cumbersome.

### `metrics-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-enabled[=<BOOLEAN>]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-enabled: true
```

  </TabItem>
</Tabs>

Enables the metrics exporter.
The default is `false`.

### `metrics-host`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-host=<HOST>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-host=186.10.10.1
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_HOST=186.10.10.1
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-host: "186.10.10.1"
```

  </TabItem>
</Tabs>

The host on which [Prometheus](https://prometheus.io/) accesses metrics.
The default is `127.0.0.1`.

### `metrics-port`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-port=<PORT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-port=6174
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_PORT=6174
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-port: 6174
```

  </TabItem>
</Tabs>

The port (TCP) on which [Prometheus](https://prometheus.io/) accesses metrics.
The default is `9001`.

### `metrics-category`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-category=<metrics-category>[,metrics-category...]...
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-category=HTTP,SIGNING,JVM
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_CATEGORY=HTTP,SIGNING,JVM
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-category: ["HTTP", "SIGNING", "JVM"]
```

  </TabItem>
</Tabs>

A comma-separated list of categories for which to track metrics.
The defaults are `HTTP`, `SIGNING`, `ETH2_SLASHING_PROTECTION`, `JVM`, `PROCESS`.

### `metrics-host-allowlist`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-host-allowlist=<hostname>[,<hostname>...]... or "*"
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-host-allowlist=medomain.com,meotherdomain.com
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_HOST_ALLOWLIST=medomain.com,meotherdomain.com
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-host-allowlist: ["medomain.com", "meotherdomain.com"]
```

  </TabItem>
</Tabs>

A comma-separated list of hostnames to allow access to the [Web3Signer metrics].
By default, Web3Signer accepts access from `localhost` and `127.0.0.1`.

:::tip
To allow all hostnames, use `"*"`.
We don't recommend allowing all hostnames for production environments.
:::

### `metrics-push-enabled`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-enabled[=<true|false>]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-push-enabled=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_PUSH_ENABLED=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-push-enabled=true
```

  </TabItem>
</Tabs>

Enables or disables [push gateway integration](../../how-to/monitor/metrics.md#run-prometheus-with-web3signer-in-push-mode).

You can't specify `--metrics-push-enabled` with [`--metrics-enabled`](#metrics-enabled). That is, you can enable either Prometheus polling or Prometheus push gateway support, but not both at once.

### `metrics-push-host`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-host=<HOST>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-push-host=127.0.0.1
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_PUSH_HOST=127.0.0.1
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-push-host="127.0.0.1"
```

  </TabItem>
</Tabs>

The host of the [Prometheus Push Gateway](https://github.com/prometheus/pushgateway). The default is `127.0.0.1`. The metrics server respects the [`--metrics-host-allowlist` option](#metrics-host-allowlist).

:::note

When pushing metrics, ensure you set `--metrics-push-host` to the machine on which the push gateway is. Generally, this is a different machine to the machine on which Web3Signer is running.

:::

### `metrics-push-interval`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-interval=<INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-push-interval=30
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_PUSH_INTERVAL=30
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-push-interval=30
```

  </TabItem>
</Tabs>

The interval, in seconds, to push metrics when in `push` mode. The default is 15.

### `metrics-push-port`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-port=<PORT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-push-port=6174
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_PUSH_PORT=6174
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-push-port="6174"
```

  </TabItem>
</Tabs>

The port (TCP) of the [Prometheus Push Gateway](https://github.com/prometheus/pushgateway). The default is `9001`.

### `metrics-push-prometheus-job`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--metrics-push-prometheus-job=<metricsPrometheusJob>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--metrics-push-prometheus-job="my-custom-job"
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_METRICS_PUSH_PROMETHEUS_JOB="my-custom-job"
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
metrics-push-prometheus-job="my-custom-job"
```

  </TabItem>
</Tabs>

The job name when in `push` mode. The default is `web3signer-job`.

### `reload-timeout`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--reload-timeout=<MINUTES>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--reload-timeout=45
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_RELOAD_TIMEOUT=45
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
reload-timeout: "45"
```

  </TabItem>
</Tabs>

Maximum time, in minutes, allowed for the entire reload operation using the [`reload`](https://consensys-incorporated.github.io/web3signer/#tag/Reload-Signer-Keys) endpoint.
This includes loading from all sources (for example, file system or key vaults).
The default is 30.

### `signer-load-batch-size`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--signer-load-batch-size=<COUNT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--signer-load-batch-size=300
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_SIGNER_LOAD_BATCH_SIZE=300
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
signer-load-batch-size: "300"
```

  </TabItem>
</Tabs>

Number of signer configuration files to process per batch during parallel loading.
Reduce this number if you hit OS file descriptor limits.
The default is 500, and the minimum value is 100.

### `signer-load-parallel`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--signer-load-parallel[=<BOOLEAN>]
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--signer-load-parallel=false
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_SIGNER_LOAD_PARALLEL=false
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
signer-load-parallel: false
```

  </TabItem>
</Tabs>

Enables or disables parallel processing of signer configuration files.
Set to `false` for sequential processing.
The default is `true`.

### `signer-load-sequential-threshold`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--signer-load-sequential-threshold=<COUNT>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--signer-load-sequential-threshold=50
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_SIGNER_LOAD_SEQUENTIAL_THRESHOLD=50
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
signer-load-sequential-threshold: "50"
```

  </TabItem>
</Tabs>

Minimum number of files required to use parallel processing.
Files below this threshold are processed sequentially.
The default is 100, and the minimum value is 1.

### `signer-load-timeout`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--signer-load-timeout=<SECONDS>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--signer-load-timeout=120
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_SIGNER_LOAD_TIMEOUT=120
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
signer-load-timeout: "120"
```

  </TabItem>
</Tabs>

Maximum time, in seconds, for processing each individual signer configuration file.
This applies during parallel processing of files from the file system.
The default is 60.

### `tls-keystore-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--tls-keystore-file=<keystoreFile>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--tls-keystore-file=/Users/me/my_node/certificate.pfx
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_TLS_KEYSTORE_FILE=/Users/me/my_node/certificate.pfx
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
tls-keystore-file: "/Users/me/my_node/certificate.pfx"
```

  </TabItem>
</Tabs>

PKCS #12 formatted keystore.
Used to enable TLS for [client connections](../../how-to/configure-tls.md).

### `tls-keystore-password-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--tls-keystore-password-file=<passwordFile>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--tls-keystore-password-file=/Users/me/my_node/password.txt
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_TLS_KEYSTORE_PASSWORD_FILE=/Users/me/my_node/password.txt
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
tls-keystore-password-file: "/Users/me/my_node/password.txt"
```

  </TabItem>
</Tabs>

Password file used to decrypt the keystore.

### `tls-allow-any-client`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--tls-allow-any-client=<BOOLEAN>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--tls-allow-any-client=true
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_TLS_ALLOW_ANY_CLIENT=true
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
tls-allow-any-client: true
```

  </TabItem>
</Tabs>

Allows any client to connect.
The default is `false`.

:::caution Warning
You can't use this option with [`--tls-allow-ca-clients`](#tls-allow-ca-clients) and
[`--tls-known-clients-file`](#tls-known-clients-file).
:::

### `tls-known-clients-file`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--tls-known-clients-file=<clientsFile>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--tls-known-clients-file=/Users/me/my_node/knownClients.txt
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_TLS_KNOWN_CLIENTS_FILE=/Users/me/my_node/knownClients.txt
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
tls-known-clients-file: "/Users/me/my_node/knownClients.txt"
```

  </TabItem>
</Tabs>

File containing the Common Names and SHA-256 fingerprints of
[authorized clients](../../how-to/configure-tls.md#create-the-known-clients-file).

### `tls-allow-ca-clients`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash
--tls-allow-ca-clients
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_TLS_ALLOW_CA_CLIENTS
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
tls-allow-ca-clients
```

  </TabItem>
</Tabs>

Allows clients signed with trusted CA certificates to connect.

### `vertx-worker-pool-size`

<Tabs>

  <TabItem value="Syntax" label="Syntax" default>

```bash title="Syntax"
--vertx-worker-pool-size=<INTEGER>
```

  </TabItem>
  <TabItem value="Example" label="Example" >

```bash
--vertx-worker-pool-size=40
```

  </TabItem>
  <TabItem value="Environment variable" label="Environment variable" >

```bash
WEB3SIGNER_VERTX_WORKER_POOL_SIZE=40
```

  </TabItem>
  <TabItem value="Configuration file" label="Configuration file" >

```bash
vertx-worker-pool-size: 40
```

  </TabItem>
</Tabs>

Vert.x worker pool size used for processing requests.
The default is `20`.

### `help`

```bash title="Syntax"
-h, --help
```

Displays the help and exits.

### `version`

```bash title="Syntax"
-V, --version
```

Displays the version and exits.

<!-- links -->

[YAML files required to access keys]: ../key-config-file-params.md
[Web3Signer metrics]: ../../how-to/monitor/metrics.md
