---
sidebar_label: Use metrics
description: Use metrics to monitor Web3Signer's performance.
sidebar_position: 1
---

# Use metrics to monitor performance

Enable the [Prometheus](https://prometheus.io/) monitoring and alerting service for Web3Signer
metrics using the [`--metrics-enabled`](../../reference/cli/options.md#metrics-enabled) option.

Web3Signer provides metrics for secp256k1 and BLS12-381 key types.

## Install Prometheus

To use Prometheus with Web3Signer, install the [Prometheus main component](https://prometheus.io/download/).
On MacOS, install with [Homebrew](https://formulae.brew.sh/formula/prometheus):

```bash
brew install prometheus
```

## Setting up and running Prometheus with Web3Signer

To configure Prometheus and run with Web3Signer:

1. Configure Prometheus to poll Web3Signer.
   For example, add the following YAML fragment to the `scrape_configs` block of the `prometheus.yml` file:

    ```yml title="Example configuration"
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: "prometheus"
        static_configs:
          - targets: ["localhost:9090"]
      - job_name: "web3signer-dev"
        scrape_timeout: 10s
        metrics_path: /metrics
        scheme: http
        static_configs:
          - targets: ["localhost:9001"]
    ```

2. [Start Teku] by specifying the Web3Signer details.

3. Start Web3Signer with the [`--metrics-enabled`](../../reference/cli/options.md#metrics-enabled) option.

    ```bash
    web3signer --key-store-path=/Users/me/keyFiles/ --metrics-enabled
    ```

    The `HTTP`, `SIGNING`, `JVM`, and `PROCESS` metrics categories are enabled by default.
    Use the [`--metrics-category`](../../reference/cli/options.md#metrics-category) command line
    option to update the available categories.

4. In another terminal, run Prometheus specifying the `prometheus.yml` file:

    ```bash
    prometheus --config.file=prometheus.yml
    ```

5. View the [Prometheus graphical interface](#view-prometheus-graphical-interface).

## Run Prometheus with Web3Signer in push mode

The [`--metrics-enabled`](../../reference/cli/options.md#metrics-enabled) option enables Prometheus
polling of Besu, but sometimes metrics are hard to poll (for example, when running inside Docker
containers with varying IP addresses). To enable Besu to push metrics to a
[Prometheus push gateway](https://github.com/prometheus/pushgateway), use
the [`--metrics-push-enabled`](../../reference/cli/options.md#metrics-push-enabled) option.

To configure Prometheus and run with Web3Signer pushing to a push gateway:

1. Configure Prometheus to read from a push gateway. For example, add the following YAML fragment to
the `scrape_configs` block of the `prometheus.yml` file:

    ```yml
    - job_name: push-gateway
      metrics_path: /metrics
      scheme: http
      static_configs:
        - targets:
            - localhost:9091
    ```

1. Start the push gateway. You can deploy the push gateway using the Docker image:

    ```bash
    docker pull prom/pushgateway
    docker run -d -p 9091:9091 prom/pushgateway
    ```

1. Start Web3Signer specifying options:
    * [`--metrics-push-enabled`](../../reference/cli/options.md#metrics-push-enabled)
    * [`--metrics-push-port`](../../reference/cli/options.md#metrics-push-enabled)
    * [`--metrics-push-host`](../../reference/cli/options.md#metrics-push-host)

1. In another terminal, run Prometheus specifying the `prometheus.yml` file:

    ```bash
    prometheus --config.file=prometheus.yml
    ```

1. View the [Prometheus graphical interface](#view-prometheus-graphical-interface).

## View Prometheus graphical interface

1. Open a web browser to `http://localhost:9090` to view the Prometheus graphical interface.

2. Choose **Graph** from the menu bar and click the **Console** tab below.

3. From the **Insert metric at cursor** drop-down, select a metric and click **Execute**.
   The values display.

The following Web3Signer metrics are available.

**HTTP API metrics:**

| Name | Definition |
| --- | --- |
| `<keytype>_malformed_request_count` | Number of requests received which had illegally formatted body. |
| `<keytype>_signing_duration` | Duration of a signing event. |
| `<keytype>_missing_identifier_count` | Number of signing requests for which no keys were available. |
| `signers_loaded_count` | Total number of SECP256k1 and BLS12-381 keys loaded. |
| `signing_private_key_retrieval_time` | Time taken to retrieve BLS signing keys. |

**Eth2 Slashing protection metrics:**

| Name | Definition |
| --- | --- |
| `permitted_signings` | The number of slashing checks which have reported 'safe to sign'. |
| `prevented_signings` | The number of prevented signings due to violation of slashing conditions. |

**Process metrics:**

| Name              | Definition                                 |
| ----------------- | ------------------------------------------ |
| `process_release` | The number of the release version running. |

## Visualize collected data

Use [Grafana] to visualize the collected data. See the sample [Web3Signer Grafana
dashboard](https://grafana.com/grafana/dashboards/13687).

<!-- Links -->

[Start Teku]: https://docs.teku.consensys.net/how-to/use-external-signer/use-web3signer
[Grafana]: https://grafana.com/docs/grafana/latest/guides/getting_started/
