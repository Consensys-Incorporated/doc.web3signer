---
sidebar_label: Use GCP Secret Manager
description: Sign consensus layer transactions with keys stored in GCP Secret Manager.
sidebar_position: 3
---

# Use Web3Signer with Google Cloud Platform Secret Manager

Web3Signer supports consensus layer signing with BLS keys stored in
[Google Cloud Platform (GCP) Secret Manager](https://cloud.google.com/secret-manager).

The [GCP Secret Manager documentation](https://cloud.google.com/secret-manager/docs)
provides the information you need to get started.

## Authentication

Web3Signer uses [Application Default Credentials (ADC)](https://cloud.google.com/docs/authentication#adc)
to authenticate with GCP Secret Manager. ADC automatically finds credentials and manages token retrieval, enabling
the authentication code to operate across various deployment options without modification.

## Load keys from GCP Secret Manager

Load keys stored in GCP Secret Manager into Web3Signer using the [`eth2` subcommand](../../load-keys.md#gcp-secret-manager)
to bulk load keys.
