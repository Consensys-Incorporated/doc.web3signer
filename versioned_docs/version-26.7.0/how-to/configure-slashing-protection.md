---
sidebar_label: Configure slashing protection
description: Configure consensus layer slashing protection.
sidebar_position: 6
---

# Configure consensus layer slashing protection

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Configure [slashing protection] to prevent consensus layer validators from being penalized for
signing conflicting blocks or attestations.

Install and manage the PostgreSQL database that stores the validator signing history for one or more
Web3Signer instances.

:::note
Consensus layer [slashing protection] is enabled by default.
You therefore must configure a slashing protection database, or disable slashing protection using
the [`--slashing-protection-enabled`](../reference/cli/subcommands.md#slashing-protection-enabled)
command line option.
:::

The steps to configure slashing protection are:

1. [Install the PostgreSQL database](#install-the-postgresql-database).
1. [Load the database schema](#load-the-database-schema).
1. [Start Web3Signer and specify the database details](#start-web3signer).

## Install the PostgreSQL database

[Install the PostgreSQL database], or use [Docker] to [run the PostgreSQL database in a container].
The following example uses a Docker container.

:::caution Important
Web3Signer only supports PostgreSQL for creating the slashing protection database.
:::

As an example, create the database with the default `postgres` user, and specify the password and
database name.

```bash
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=web3signer -p 5432:5432 postgres
```

This example uses `-p 5432:5432` to bind the default Postgres database port to the host's port.
This allows you to [connect to the database] using the `jdbc:postgresql://localhost/web3signer` URL.

:::tip
Web3Signer uses [HikariCP] to manage database connections, and uses the default configuration values.
The defaults perform well in most deployments, but you can be override them with the
[`slashing-protection-db-pool-configuration-file`](../reference/cli/subcommands.md#slashing-protection-db-pool-configuration-file)
option.
:::

## Load the database schema

Web3Signer provides a database schemas to configure the database.
Find the schemas in `/migrations/postgresql/` in the Web3Signer installation directory.

The following examples show how to load the schema using the [Flyway] database migration tool or the
PostgreSQL command line tool.

:::note
If loading each schema individually, then ensure you load them in order.
For example `V1_initial.sql`, `V2__removeUniqueConstraints.sql`, then `V3__addLowWatermark.sql`
(followed by all Vx\_\_.sql files).
Use the [Flyway] migration tool to automatically load them in order.
:::

<Tabs>

  <TabItem value="Flyway DB migration tool" label="Flyway DB migration tool" default>

```bash
flyway migrate -url="jdbc:postgresql://localhost/web3signer" \
-locations="filesystem:/Users/me/web3signer-0.2.1-SNAPSHOT/migrations/postgresql"
```

  </TabItem>
  <TabItem value="Postgres command line" label="Postgres command line" >

```bash
psql --echo-all --host=localhost --port=5432 --dbname=web3signer --username=postgres \
-f /Users/me/web3signer-0.2.1-SNAPSHOT/migrations/postgresql/postgresql/V1__initial.sql
```

  </TabItem>
</Tabs>

:::note
If using the PostgreSQL command line inside a docker container, ensure you mount the
`/migrations/postgresql/` directory to the docker container to access the schema file.
:::

## Start Web3Signer

Start Web3Signer and specify the PostgreSQL connection options.

```bash
web3signer --key-store-path=/Users/me/keys eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
--slashing-protection-db-username=postgres --slashing-protection-db-password=password \
--slashing-protection-pruning-enabled=true
```

:::note
If using a non-default port number for your PostgreSQL database, then [include the port number in
the database URL].
:::

Including
[`--slashing-protection-pruning-enabled=true`](../reference/cli/subcommands.md#slashing-protection-pruning-enabled)
enables [slashing protection database pruning].

Start the client, for example [Teku] by specifying the Web3Signer details.

## Import or export a slashing protection database

You can import or export the slashing protection database.
When importing, additional entries are added to the existing database.

Web3Signer supports importing or exporting using the [validator client interchange format].
Use the [`eth2 import`](../reference/cli/subcommands.md#eth2-import) and
[`eth2 export`](../reference/cli/subcommands.md#eth2-export) to import or export files.

To import a slashing protection database file into the Postgres database, run:

```bash
web3signer eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
--slashing-protection-db-username=postgres \
--slashing-protection-db-password=password import --from=/Users/me/my_node/interchange.json
```

To export the Postgres database to a file run:

```bash
web3signer eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
--slashing-protection-db-username=postgres \
--slashing-protection-db-password=password export --to=/Users/me/my_node/interchange.json
```

You must supply the Postgres database connection details when importing or exporting the slashing
protection database.

## Prune the slashing protection database

You can enable periodic pruning of the slashing protection database to manage its size.

Enable pruning by setting
[`--slashing-protection-pruning-enabled`](../reference/cli/subcommands.md#slashing-protection-pruning-enabled)
to `true`.

Web3Signer can prune the database on startup, and then after each pruning interval.
By default, this feature is disabled. You can enable pruning at startup and start pruning after the pruning interval by setting
[`--slashing-protection-pruning-at-boot-enabled`](../reference/cli/subcommands.md#slashing-protection-pruning-at-boot-enabled)
to `true`.

You can include additional optional pruning configuration options.
For example, run:

```bash
web3signer eth2 --slashing-protection-db-url="jdbc:postgresql://localhost/web3signer" \
--slashing-protection-db-username=postgres --slashing-protection-db-password=password \
--slashing-protection-pruning-enabled=true --slashing-protection-pruning-at-boot-enabled=true \
--slashing-protection-pruning-epochs-to-keep=5000 --slashing-protection-pruning-interval=18
```

:::caution Warning
Do not use slashing protection database pruning while [importing or exporting the
database](#import-or-export-a-slashing-protection-database).
:::

## Slashing protection health check

By default, Web3Signer performs a health check on the slashing protection database every 30000 milliseconds.
To change the default value, configure the
[`--slashing-protection-db-health-check-interval-milliseconds`](../reference/cli/subcommands.md#slashing-protection-db-health-check-interval-milliseconds)
command line option.

The service responds with a `200` message if healthy, and `503` if unhealthy.

You can also configure the health check timeout with the
[`--slashing-protection-db-health-check-timeout-milliseconds`](../reference/cli/subcommands.md#slashing-protection-db-health-check-timeout-milliseconds)
command line option.
The default timeout is 3000 milliseconds.

<!-- links -->

[slashing protection]: ../concepts/slashing-protection.md
[slashing protection database pruning]: #prune-the-slashing-protection-database
[Install the PostgreSQL database]: https://www.postgresql.org/download/
[Docker]: https://docs.docker.com/install/
[run the PostgreSQL database in a container]: https://hub.docker.com/_/postgres/
[Flyway]: https://flywaydb.org/documentation/
[include the port number in the database URL]: https://jdbc.postgresql.org/documentation/use/#connecting-to-the-database
[Teku]: https://docs.teku.consensys.net/how-to/use-external-signer/use-web3signer
[connect to the database]: https://jdbc.postgresql.org/documentation/use/#connecting-to-the-database
[validator client interchange format]: https://eips.ethereum.org/EIPS/eip-3076
[HikariCP]: https://github.com/brettwooldridge/HikariCP
