# Installing SpiceDB

:::info
Want to use SpiceDB as a service without any installation? Visit the [Authzed Dashboard] to create a new permissions system
:::

[Authzed Dashboard]: https://app.authzed.com

## Running SpiceDB in local mode

To run [SpiceDB] for local testing, either Docker or brew can be used:

[SpiceDB]: https://github.com/authzed/spicedb

:::warning
Running SpiceDB in this way is only to be used for local testing, as TLS is disabled and the data stored will disappear when SpiceDB is shut down.
:::

### Running via Docker

```sh
docker pull quay.io/authzed/spicedb
```

```sh
docker run --name spicedb -d -p 50051:50051 quay.io/authzed/spicedb serve --grpc-preshared-key "somerandomkeyhere"
```

### Running via brew

```sh
brew install spicedb
```

```sh
spicedb serve --grpc-preshared-key "somerandomkeyhere"
```

## Verifying that SpiceDB is running

The [zed] tool can be used to check that SpiceDB is running, write schema and relationships, and perform other operations against SpiceDB:

[zed]: https://github.com/authzed/zed

### Running via brew

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
