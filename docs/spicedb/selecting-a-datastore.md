# Selecting a Datastore

SpiceDB ships with a number of [datastores](reference/glossary.md#datastore) -- drivers used to store and retrieve the schema and relationship data for computing permissions.

There are a few available datastores with various design goals:

- [CockroachDB](#cockroachdb) - Recommended for multi-region deployments
- [PostgreSQL](#postgresql) - Recommended for single-region deployments and those familiar with traditional RDBMS operations
- [memdb](#memdb) - Recommended for local development and integration testing with applications written to be SpiceDB-native

## CockroachDB

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
- Stores migration revisions using the same strategy as [Alembic][alembic]

[crdb-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/crdb
[crdb-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/crdb
[pgx]: https://pkg.go.dev/gopkg.in/jackc/pgx.v3
[alembic]: https://alembic.sqlalchemy.org/en/latest/

### Configuration

#### Required Parameters

```sh
--datastore-engine=cockroachdb --datastore-conn-uri="connection uri here"
```

#### Notable Parameters

In order to mitigate the [New Enemy Problem](reference/glossary.md#new-enemy-problem), the `--datastore-tx-overlap-strategy` flag is provided.

The available strategies are:

- `static`(Default) - A single key (`datastore-tx-overlap-key`) is used in all writes to ensure proper consistency
- `prefix` (Unsafe if misused) - A key with the prefix from the object type is used to protect writes with the same prefix
- `insecure` (Unsafe) - Disables the overlap strategy entirely leaving queries vulnerable to the New Enemy problem

#### Optional Parameters

| Parameter                             | Description                                                                         | Example                                      |
|---------------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------|
| `datastore-max-tx-retries`            | Maximum number of times to retry a query before raising an error                    | `--datastore-max-tx-retries=50`              |
| `datastore-tx-overlap-strategy`       | The overlap strategy to prevent New Enemy on CRDB (see below)                       | `--datastore-tx-overlap-strategy=static`     |
| `datastore-tx-overlap-key`            | The key to use for the overlap strategy (see below)                                 | `--datastore-tx-overlap-key="foo"`           |
| `datastore-conn-max-idletime`         | Maximum idle time for a connection before it is recycled                            | `--datastore-conn-max-idletime=60s`          |
| `datastore-conn-max-lifetime`         | Maximum lifetime for a connection before it is recycled                             | `--datastore-conn-max-lifetime=300s`         |
| `datastore-conn-max-open`             | Maximum number of concurrent connections to open                                    | `--datastore-conn-max-open=10`               |
| `datastore-conn-min-open`             | Minimum number of concurrent connections to open                                    | `--datastore-conn-min-open=1`                |
| `datastore-query-split-size`          | The (estimated) query size at which to split a query into multiple queries          | `--datastore-query-split-size=5kb`           |
| `datastore-gc-window`                 | Sets the window outside of which overwritten relationships are no longer accessible | `--datastore-gc-window=1s`                   |
| `datastore-revision-fuzzing-duration` | Sets a fuzzing window on all zookies/zedtokens                                      | `--datastore-revision-fuzzing-duration=50ms` |
| `datastore-readonly`                  | Places the datastore into readonly mode                                             | `--datastore-readonly=true`                  |

## PostgreSQL

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
[pgx]: https://pkg.go.dev/gopkg.in/jackc/pgx.v3
[alembic]: https://alembic.sqlalchemy.org/en/latest/
[mvcc]: https://en.wikipedia.org/wiki/Multiversion_concurrency_control

### Configuration

#### Required Parameters

```sh
--datastore-engine=postgres --datastore-conn-uri="connection string here"
```

#### Optional Parameters

| Parameter                             | Description                                                                         | Example                                      |
|---------------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------|
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

- Fully ephemeral; no data is lost the process is terminated
- Intended for usage with SpiceDB itself and testing application integrations
- Cannot be ran highly-available as multiple instances will not share the same in-memory data

### Developer Notes

- Code can be found [here][memdb-code]
- Documentation can be found [here][memdb-godoc]
- Implements its own [MVCC][mvcc] model by storing its data with transaction IDs

[memdb-code]: https://github.com/authzed/spicedb/tree/main/internal/datastore/memdb
[memdb-godoc]: https://pkg.go.dev/github.com/authzed/spicedb/internal/datastore/memdb
[mvcc]: https://en.wikipedia.org/wiki/Multiversion_concurrency_control

### Configuration

#### Required Parameters

```sh
--datastore-engine=memory
```

#### Optional Parameters

| Parameter                             | Description                                                                         | Example                                      |
|---------------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------|
| `datastore-revision-fuzzing-duration` | Sets a fuzzing window on all zookies/zedtokens                                      | `--datastore-revision-fuzzing-duration=50ms` |
| `datastore-gc-window`                 | Sets the window outside of which overwritten relationships are no longer accessible | `--datastore-gc-window=1s`                   |
| `datastore-readonly`                  | Places the datastore into readonly mode                                             | `--datastore-readonly=true`                  |
## Additional Installation Steps(cockroachdb and postgres)

- All datastores except memdb (cockroachdb and postgres) require migrations
- You may have to supply parameter *sslmode=disable* as part of postgres connection uri when using in *insecure mode*

### Configuration 
```sh
spicedb migrate head --datastore-engine="persistent store string as given in cockroachdb and postgres section" --datastore-conn-uri="connection string here"
```
