---
sidebar_label: Use a configuration file for starting Web3Signer
description: Use the Web3Signer configuration file.
sidebar_position: 5
---

# Use the Web3Signer configuration file

Use a YAML configuration file to specify command line options in a file.

Save the configuration file and reuse it across node startups. Use the
[`--config-file`](../reference/cli/options.md#config-file) option to specify the configuration file location.

To override an option specified in the configuration file, either specify the same option on the
command line or as an [environment variable](../reference/cli/options.md#specify-options).
For options specified in more than one place, the order of precedence is command line, environment
variable, configuration file.

## YAML specification

The configuration file must be a valid YAML file composed of key/value pairs.
Each key is the same as the corresponding command line option name without the leading dashes (`--`).
For [subcommand options], prefix the key with the name of the subcommand.
For example, `eth1.network=<NETWORK>`

:::info
You can't specify subcommands in the configuration file, you can only specify a subcommand's
associated options.
You must specify the signing key subcommand on the command line.
:::

Values must conform to YAML specifications for string, numbers, arrays, and booleans.
Specific differences between the command line and the YAML file format are:

- Comma-separated lists on the command line are string arrays in the YAML file.
- Enclose file paths, hexadecimal numbers, URLs, and &lt;host:port> values in quotes.

:::tip
The [command line reference](../reference/cli/options.md) includes configuration file examples for each option.
:::

```yaml title="Sample YAML configuration file"
# Chain
eth1.chain-id: 2017

# Signing key locations
key-store-path: "/Users/me/keys"
```

Start Web3Signer with a configuration file:

```bash
web3signer --config-file=/home/me/config.yaml eth1
```

<!-- links -->

[subcommand options]: ../reference/cli/subcommands.md
