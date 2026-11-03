---
title: Web3Signer
description: Web3Signer is an open-source Ethereum remote signing service.
sidebar_position: 1
slug: /
keywords: [Ethereum remote signer, validator keys, external vault]
---

import NextCards from "@site/src/components/NextCards";

# Web3Signer

Web3Signer is an open-source Ethereum remote signing service developed under
the Apache 2.0 license and written in Java.
It signs consensus layer payloads with BLS12-381 keys and execution layer
payloads with secp256k1 keys.
Keep signing keys in files or in an external vault, as described in
[Store signing keys](how-to/store-keys/index.md).

## Why use Web3Signer

A consensus layer validator client, or an execution layer client, needs
signatures to carry out its work.
Web3Signer holds the signing keys and returns the signature.
The client doesn't hold the keys, so the client and the machine it runs on
operate at a lower level of trust than the signer.
A fault in the client can't expose keys the client doesn't hold.
If you operate the client, you don't need access to the Web3Signer host.
Restrict access to the Web3Signer host separately.
Add or replace a validator client without copying signing keys onto that
client.

## When to use Web3Signer

Use Web3Signer when you are a staking provider or an institutional staker,
or when you have a large stake, many keys on a shared signer, keys in a vault,
or an isolation requirement of your own.
Use it as a remote signer in distributed validator technology (DVT), such as
[Obol](https://docs.obol.org/run-a-dv/prepare/deployment-best-practices) and
[SSV Network](https://docs.ssv.network/operators/operator-node/setup-sidecars/remote-signer/).

## Next steps

<NextCards
  items={[
    {
      title: "Architecture",
      description:
        "Learn how Web3Signer is structured, where signing keys live, and how multiple instances coordinate.",
      path: "concepts/architecture",
    },
    {
      title: "Store signing keys",
      description:
        "Compare files and external vaults for consensus layer and execution layer keys.",
      path: "how-to/store-keys",
    },
    {
      title: "Start Web3Signer",
      description:
        "Start Web3Signer for a consensus layer client or an execution layer client.",
      path: "get-started/start-web3signer",
    },
    {
      title: "Configure slashing protection",
      description:
        "Set up the PostgreSQL database that records consensus layer signing history.",
      path: "how-to/configure-slashing-protection",
    },
    {
      title: "Run Web3Signer at scale",
      description:
        "Size the service, balance load, and tune it for many signing keys.",
      path: "how-to/run-at-scale",
    },
    {
      title: "Key management best practices",
      description:
        "Apply the practices for consensus layer validator keys.",
      path: "get-started/key-best-practices",
    },
  ]}
/>
