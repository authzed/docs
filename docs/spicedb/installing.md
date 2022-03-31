# Installing SpiceDB

:::info
Want to use SpiceDB as a service without any installation? Visit the [Authzed Dashboard] to create a new permissions system
:::

[Authzed Dashboard]: https://app.authzed.com

## Install options

### Docker

```sh
docker pull authzed/spicedb
```

```sh
docker run --name spicedb \
    -p 50051:50051 --rm \
    authzed/spicedb serve \
    --grpc-preshared-key "somerandomkeyhere"
```

### brew

```sh
brew install spicedb
```

```sh
spicedb serve --grpc-preshared-key "somerandomkeyhere"
```

:::warning
The above commands should only be used when running SpiceDB for the first time as TLS is disabled and no data is persisted when SpiceDB is shut down. See the guide for [selecting a datastore].
:::

[selecting a datastore]: /spicedb/selecting-a-datastore

### Download the binary

Binaries are available to download on the [releases page].

[releases page]: https://github.com/authzed/spicedb/releases

## Verifying that SpiceDB is running

A variety of [clients/tools] can be used to interact with the API.

[zed] is the official CLI client and can be used to check that SpiceDB is running, write schema and relationships, and perform other operations against SpiceDB:

[clients/tools]: /reference/clients
[zed]: https://github.com/authzed/zed

### Running via brew

[zed] is available via brew on macOS and Linux.

```sh
brew install zed
```

```sh
zed context set local localhost:50051 "somerandomkeyhere" --insecure
zed schema read --insecure
```

## Next Steps

Continue with the [Protecting Your First App] guide to learn how to use SpiceDB to protect your application

[Protecting Your First App]: /guides/first-app
