# Installing SpiceDB

:::info
Want to use SpiceDB as a service without any installation? Visit the [Authzed Dashboard] to create a new permissions system, or check out [Authzed Dedicated]
:::

[authzed dashboard]: https://app.authzed.com
[authzed dedicated]: https://authzed.com/pricing

## Installing with the Operator

The recommended way to install SpiceDB for a production system is with the operator on Kubernetes, see the [operator docs] for installation details.

The other installation options below can be helpful to test SpiceDB locally, or to run on a non-Kubernetes system.

[operator docs]: /spicedb/operator

## Other install options

:::warning
The commands documented here do not configure best practices for production deployments.
For example, TLS is disabled and data is not persisted when SpiceDB is shut down.
See the guide for [selecting a datastore].
:::

### Docker

```sh
docker pull authzed/spicedb
```

```sh
docker run --name spicedb \
    -p 50051:50051 \
    authzed/spicedb serve \
    --grpc-preshared-key "somerandomkeyhere"
```

### brew

```sh
brew install authzed/tap/spicedb
```

```sh
spicedb serve --grpc-preshared-key "somerandomkeyhere"
```

[selecting a datastore]: /spicedb/selecting-a-datastore

### Download the binary

Binaries are available to download on the [releases page].

[releases page]: https://github.com/authzed/spicedb/releases

### GitHub Actions

Authzed maintains [GitHub Actions] for integrating SpiceDB with your CI/CD pipelines:

- [action-spicedb]: Runs SpiceDB such that each Bearer Token provided by the client is allocated its own isolated, ephemeral datastore.
  By using unique tokens in each of your application's integration tests, they can be executed in parallel safely against a single instance of SpiceDB.
  Equivalent to running `spicedb serve-testing`.
- [action-spicedb-validate]: Validates SpiceDB schema files. Schema files can be easily exported from the [playground].
  Equivalent to running `zed validate`.

[github actions]: https://github.com/features/actions
[action-spicedb]: https://github.com/authzed/action-spicedb
[action-spicedb-validate]: https://github.com/authzed/action-spicedb-validate
[playground]: https://play.authzed.com

## Verifying that SpiceDB is running

A variety of [clients/tools] can be used to interact with the API.

[zed] is the official CLI client and can be used to check that SpiceDB is running, write schema and relationships, and perform other operations against SpiceDB:

[clients/tools]: /reference/clients
[zed]: https://github.com/authzed/zed

### Running via brew

[zed] is available via brew on macOS and Linux.

```sh
brew install authzed/tap/zed
```

```sh
zed context set local localhost:50051 "somerandomkeyhere" --insecure
zed schema read --insecure
```

## Configuration

### Flags

In addition to CLI flags, SpiceDB also supports configuration via environment variables.
You can replace any command's argument with an environment variable by converting dashes into underscores and prefixing with `SPICEDB_` (e.g. `--log-level` becomes `SPICEDB_LOG_LEVEL`).
The following are equivalent:

```sh
spicedb serve --grpc-preshared-key=somerandomkeyhere
SPICEDB_GRPC_PRESHARED_KEY=somerandomkeyhere spicedb serve
```
Environment variables can be set directly, or via `spicedb.env` file located in the current working directory.

Config values are parsed with the following precedence:
 - Specified via command line flag
 - Set via environment variables
 - Loaded from `spicedb.env`
 - Default values of application

## Next Steps

Continue with the [Protecting Your First App] guide to learn how to use SpiceDB to protect your application and read [Configuring Dispatching] to learn more about how to configure your SpiceDB for production-level dispatching and caching.

[protecting your first app]: /guides/first-app
[configuring dispatching]: /spicedb/configuring-dispatch
