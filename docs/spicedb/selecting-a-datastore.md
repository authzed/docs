# Selecting a Datastore

SpiceDB ships with a number of [datastores](reference/glossary.md#datastore) -- drivers used to store and retrieve the schema and relationship data for computing permissions.

There are a few available datastores with various design goals:

- [CockroachDB](#cockroachdb) - Recommended for multi-region deployments
- [Cloud Spanner](#cloud-spanner) - Suitable for cloud multi-region deployments
- [MySQL](#mysql) - Recommended for single-region deployments and those familiar with traditional RDBMS operations
- [PostgreSQL](#postgresql) - Recommended for single-region deployments and those familiar with traditional RDBMS operations
- [memdb](#memdb) - Recommended for local development and integration testing with applications written to be SpiceDB-native

## Migrations

Before a datastore can be used by SpiceDB or before running a new version of SpiceDB, you must execute all available migrations.
The only exception is the [memdb datastore](#memdb) because it does not persist any data.

In order to migrate a datastore, run the following command with your desired values:

```sh
spicedb migrate head --datastore-engine $DESIRED_ENGINE --datastore-conn-uri $CONNECTION_STRING
```

## CockroachDB

:::note
If you want to use the Watch API with CockroachDB, an additional capability must be enabled within the database. See [Enabling Watch API for CRDB]
:::

[enabling watch api for crdb]: enabling-watch-api#crdb

### Usage Notes

- Recommended for multi-region deployments, with configurable region awareness
- Enables horizonally scalablity by adding more SpiceDB and CockroachDB instances
- Resiliency to individual CockroachDB instance failures
- Query and data balanced across the CockroachDB
- Setup and operational complexity of running CockroachDB

### Developer Notes

- Code can be found [here][crdb-code]
- Documentation can be found [here][crdb-godoc]
- Implemented using [pgx][pgx] for a SQL driver and connection pooling
- Has a native changefeed
- Stores migration revisions using the same strategy as [Alembic][alembic]

[crdb-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/crdb
[crdb-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/crdb
[pgx]: https://pkg.go.dev/gopkg.in/jackc/pgx.v3
[alembic]: https://alembic.sqlalchemy.org/en/latest/

### Configuration

:::warning

In distributed systems, you can trade-off consistency for performance.

Users that are willing to rely on subtle guarantees to mitigate the [New Enemy Problem] can configure `--datastore-tx-overlap-strategy`.
[New Enemy Problem]: /reference/glossary.md#new-enemy-problem

The available strategies are:

- `static` (default) - A single key (`--datastore-tx-overlap-key`) is used in all writes to ensure proper consistency. This has the least write throughput, but is simplest.
- `prefix` (unsafe if misused) - A key with the prefix from the object type is used to protect writes with the same prefix. For example, `subsystemA:user` would overlap with `subsystemA:document` but not `subsystemB:document`.
- `request` (unsafe if misused) - The user provides an overlap key per request as a [grpc MD header](https://github.com/authzed/authzed-go/blob/d97cfb41027742d347391f583dd9c6d1d03ae32b/pkg/requestmeta/requestmeta.go#L26-L30). Only requests with the same overlap key will be protected. This allows an application to secure certain workflows, while getting full write performance elsewhere.
- `insecure` (unsafe) - Disables the overlap strategy entirely, leaving queries vulnerable to the New Enemy problem, but provides the best write throughput possible on CockroachDB.

:::

#### Required Parameters

| Parameter            | Description                               | Example                                                                                   |
| -------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `datastore-engine`   | the datastore engine                      | `--datastore-engine=cockroachdb`                                                          |
| `datastore-conn-uri` | connection string used to connect to CRDB | `--datastore-conn-uri="postgres://user:password@localhost:26257/spicedb?sslmode=disable"` |

#### Optional Parameters

| Parameter                                | Description                                                                           | Example                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `datastore-max-tx-retries`               | Maximum number of times to retry a query before raising an error                      | `--datastore-max-tx-retries=50`                 |
| `datastore-tx-overlap-strategy`          | The overlap strategy to prevent New Enemy on CRDB (see below)                         | `--datastore-tx-overlap-strategy=static`        |
| `datastore-tx-overlap-key`               | The key to use for the overlap strategy (see below)                                   | `--datastore-tx-overlap-key="foo"`              |
| `datastore-conn-max-idletime`            | Maximum idle time for a connection before it is recycled                              | `--datastore-conn-max-idletime=60s`             |
| `datastore-conn-max-lifetime`            | Maximum lifetime for a connection before it is recycled                               | `--datastore-conn-max-lifetime=300s`            |
| `datastore-conn-max-open`                | Maximum number of concurrent connections to open                                      | `--datastore-conn-max-open=10`                  |
| `datastore-conn-min-open`                | Minimum number of concurrent connections to open                                      | `--datastore-conn-min-open=1`                   |
| `datastore-query-split-size`             | The (estimated) query size at which to split a query into multiple queries            | `--datastore-query-split-size=5kb`              |
| `datastore-gc-window`                    | Sets the window outside of which overwritten relationships are no longer accessible   | `--datastore-gc-window=1s`                      |
| `datastore-revision-fuzzing-duration`    | Sets a fuzzing window on all zookies/zedtokens                                        | `--datastore-revision-fuzzing-duration=50ms`    |
| `datastore-readonly`                     | Places the datastore into readonly mode                                               | `--datastore-readonly=true`                     |
| `datastore-follower-read-delay-duration` | Amount of time to subtract from non-sync revision timestamps to ensure follower reads | `--datastore-follower-read-delay-duration=4.8s` |

#### Garbage Collection Window

##### Why did I get a warning about the garbage collection window size?

Cockroach DB has (as of Feb 2023) recently changed the [default garbage collection window] size to `1.5 hours` for CRDB Serverless and `4 hours` for CRDB Dedicated.

SpiceDB will read and use the setting _from CRDB_, but reports a warning if the (SpiceDB) configured window is larger in size.

If you need a longer time window for Watch or Snapshots, please adjust on the [CRDB side]:

```
ALTER ZONE default CONFIGURE ZONE USING gc.ttlseconds = 90000;
```

[crdb side]: https://www.cockroachlabs.com/docs/stable/configure-replication-zones.html#replication-zone-variables
[default garbage collection window]: https://github.com/cockroachdb/cockroach/issues/89233

## Cloud Spanner

### Usage Notes

- Requires a Google Cloud Account with an active Cloud Spanner instance
- Take advantage of Google's TrueTime. The Spanner driver assumes the database is linearizable and skips the transaction overlap strategy required by CockroachDB.

### Developer Notes

- Code can be found [here][spanner-code]
- Documentation can be found [here][spanner-godoc]
- Starts a background [GC worker][gc-process] to clean up old entries from the manually-generated changelog table

[spanner-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/spanner
[spanner-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/spanner
[gc-process]: https://github.com/authzed/spicedb/blob/main/internal/datastore/spanner/gc.go

### Configuration

- The [Cloud Spanner docs][spanner-docs] outline how to set up an instance
- Authentication via service accounts: The service account that runs migrations must have `Cloud Spanner Database Admin`; SpiceDB (non-migrations) must have `Cloud Spanner Database User`.

[spanner-docs]: https://cloud.google.com/spanner

#### Required Parameters

| Parameter            | Description                           | Example                                                                                  |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `datastore-engine`   | the datastore engine                  | `--datastore-engine=spanner`                                                             |
| `datastore-conn-uri` | the cloud spanner database identifier | `--datastore-conn-uri="projects/project-id/instances/instance-id/databases/database-id"` |

#### Optional Parameters

| Parameter                                | Description                                                                                                                         | Example                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `datastore-spanner-credentials`          | JSON service account token (omit to use [application default credentials](https://cloud.google.com/docs/authentication/production)) | `--datastore-spanner-credentials=./spanner.json` |
| `datastore-gc-interval`                  | Amount of time to wait between garbage collection passes                                                                            | `--datastore-gc-interval=3m`                     |
| `datastore-gc-window`                    | Sets the window outside of which overwritten relationships are no longer accessible                                                 | `--datastore-gc-window=1s`                       |
| `datastore-revision-fuzzing-duration`    | Sets a fuzzing window on all zookies/zedtokens                                                                                      | `--datastore-revision-fuzzing-duration=50ms`     |
| `datastore-readonly`                     | Places the datastore into readonly mode                                                                                             | `--datastore-readonly=true`                      |
| `datastore-follower-read-delay-duration` | Amount of time to subtract from non-sync revision timestamps to ensure stale reads                                                  | `--datastore-follower-read-delay-duration=4.8s`  |

## MySQL

### Usage Notes

- Recommended for single-region deployments
- Setup and operational complexity of running MySQL
- Does not rely on any non-standard MySQL extensions
- Compatible with managed MySQL services

### Developer Notes

- Code can be found [here][mysql-code]
- Documentation can be found [here][mysql-godoc]
- Implemented using [Go-MySQL-Driver][go-mysql-driver] for a SQL driver
- Query optimizations are documented [here][mysql-executor]
- Implements its own [MVCC][mysql-mvcc] model by storing its data with transaction IDs

[mysql-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/mysql
[mysql-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/mysql
[go-mysql-driver]: https://github.com/go-sql-driver/mysql
[mysql-executor]: https://github.com/authzed/spicedb/blob/main/internal/datastore/mysql/datastore.go#L317
[mysql-mvcc]: https://en.wikipedia.org/wiki/Multiversion_concurrency_control

### Configuration

#### Required Parameters

| Parameter            | Description                                | Example                                                                                       |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- | --- |
| `datastore-engine`   | the datastore engine                       | `--datastore-engine=mysql`                                                                    |
| `datastore-conn-uri` | connection string used to connect to MySQL | `--datastore-conn-uri="user:password@(localhost:3306)/spicedb?parseTime=True"` |     |

##### MySQL Time

:::note
`--datastore-conn-uri` **must** contain `parseTime=true` as a query parameter
in order support time-based operations such as Garbage Collection in SpiceDB.

Example: `--datastore-conn-uri="username:password@(localhost:3306)/spicedb?parseTime=True"`
:::

#### Optional Parameters

| Parameter                             | Description                                                                         | Example                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| `datastore-conn-max-idletime`         | Maximum idle time for a connection before it is recycled                            | `--datastore-conn-max-idletime=60s`          |
| `datastore-conn-max-lifetime`         | Maximum lifetime for a connection before it is recycled                             | `--datastore-conn-max-lifetime=300s`         |
| `datastore-conn-max-open`             | Maximum number of concurrent connections to open                                    | `--datastore-conn-max-open=10`               |
| `datastore-query-split-size`          | The (estimated) query size at which to split a query into multiple queries          | `--datastore-query-split-size=5kb`           |
| `datastore-gc-window`                 | Sets the window outside of which overwritten relationships are no longer accessible | `--datastore-gc-window=1s`                   |
| `datastore-revision-fuzzing-duration` | Sets a fuzzing window on all zookies/zedtokens                                      | `--datastore-revision-fuzzing-duration=50ms` |
| `datastore-mysql-table-prefix string` | Prefix to add to the name of all SpiceDB database tables                            | `--datastore-mysql-table-prefix=spicedb`     |
| `datastore-readonly`                  | Places the datastore into readonly mode                                             | `--datastore-readonly=true`                  |

## PostgreSQL

:::note
If you want to use the Watch API with PostgreSQL, an additional capability must be enabled within the database. See [Enabling Watch API for PostgreSQL]
:::

[enabling watch api for postgresql]: enabling-watch-api#postgres

:::note
The minimum supported PostgreSQL version is 13.8
:::

### Usage Notes

- Recommended for single-region deployments
- Resiliency to failures only when PostgreSQL is operating with a follower and proper failover
- Setup and operational complexity of running PostgreSQL
- Does not rely on any non-standard PostgreSQL extensions
- Compatible with managed PostgreSQL services

### Developer Notes

- Code can be found [here][pg-code]
- Documentation can be found [here][pg-godoc]
- Implemented using [pgx][pgx] for a SQL driver and connection pooling
- Stores migration revisions using the same strategy as [Alembic][alembic]
- Implements its own [MVCC][mvcc] model by storing its data with transaction IDs

[pg-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/postgres
[pg-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/postgres
[mvcc]: https://en.wikipedia.org/wiki/Multiversion_concurrency_control

### Configuration

#### Required Parameters

| Parameter            | Description                                     | Example                                                                                      |
| -------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `datastore-engine`   | the datastore engine                            | `--datastore-engine=postgres`                                                                |
| `datastore-conn-uri` | connection string used to connect to PostgreSQL | `--datastore-conn-uri="postgres://postgres:password@localhost:5432/spicedb?sslmode=disable"` |

#### Optional Parameters

| Parameter                             | Description                                                                         | Example                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| `datastore-conn-max-idletime`         | Maximum idle time for a connection before it is recycled                            | `--datastore-conn-max-idletime=60s`          |
| `datastore-conn-max-lifetime`         | Maximum lifetime for a connection before it is recycled                             | `--datastore-conn-max-lifetime=300s`         |
| `datastore-conn-max-open`             | Maximum number of concurrent connections to open                                    | `--datastore-conn-max-open=10`               |
| `datastore-conn-min-open`             | Minimum number of concurrent connections to open                                    | `--datastore-conn-min-open=1`                |
| `datastore-query-split-size`          | The (estimated) query size at which to split a query into multiple queries          | `--datastore-query-split-size=5kb`           |
| `datastore-gc-window`                 | Sets the window outside of which overwritten relationships are no longer accessible | `--datastore-gc-window=1s`                   |
| `datastore-revision-fuzzing-duration` | Sets a fuzzing window on all zookies/zedtokens                                      | `--datastore-revision-fuzzing-duration=50ms` |
| `datastore-readonly`                  | Places the datastore into readonly mode                                             | `--datastore-readonly=true`                  |

## memdb

### Usage Notes

- Fully ephemeral; _all_ data is lost when the process is terminated
- Intended for usage with SpiceDB itself and testing application integrations
- Cannot be ran highly-available as multiple instances will not share the same in-memory data

:::note
If you need an ephemeral datastore designed for validation or testing, see the test server system in [Validating and Testing]
:::

[validating and testing]: /guides/validation-and-testing

### Developer Notes

- Code can be found [here][memdb-code]
- Documentation can be found [here][memdb-godoc]
- Implements its own [MVCC][mvcc] model by storing its data with transaction IDs

[memdb-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/memdb
[memdb-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/memdb

### Configuration

#### Required Parameters

| Parameter          | Description          | Example                     |
| ------------------ | -------------------- | --------------------------- |
| `datastore-engine` | the datastore engine | `--datastore-engine memory` |

#### Optional Parameters

| Parameter                             | Description                                                                         | Example                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| `datastore-revision-fuzzing-duration` | Sets a fuzzing window on all zookies/zedtokens                                      | `--datastore-revision-fuzzing-duration=50ms` |
| `datastore-gc-window`                 | Sets the window outside of which overwritten relationships are no longer accessible | `--datastore-gc-window=1s`                   |
| `datastore-readonly`                  | Places the datastore into readonly mode                                             | `--datastore-readonly=true`                  |
