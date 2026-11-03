---
sidebar_label: Use AWS Key Management Service
description: Sign execution layer transactions with keys stored in AWS Key Management Service(KMS).
sidebar_position: 2
---

# Use Web3Signer with AWS Key Management Service

Web3Signer supports execution layer signing with secp256k1 keys stored in
[AWS Key Management Service (KMS)](https://aws.amazon.com/kms/).

The [AWS KMS documentation](https://aws.amazon.com/kms/getting-started/)
provides the information you need to get started.

## Load keys from AWS KMS

Keys stored in AWS KMS can be loaded into Web3Signer by:

* Using a [key configuration file](../../../load-keys.md#use-key-configuration-files).
* Bulk loading using the [`eth1` subcommand](../../../load-keys.md#aws-key-management-service).

## Cache AWS KMS when loading multiple keys

When loading multiple keys from AWS KMS, the AWS client is created each time.
You can improve performance by caching and reusing the same AWS KMS for each key that
uses the same access key ID and region.

Set the [`eth1 --aws-connection-cache-size`](../../../../reference/cli/subcommands.md#aws-connection-cache-size-1)
option to the maximum number of AWS KMS connections to cache.
The default is `1`.
