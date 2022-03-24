# Using REST API

:::note
Want more information about the REST API and how to use it? Read our [blog post about the REST API]
:::

[blog post about the REST API]: https://authzed.com/blog/authzed-http-api/

The standard means of calling the [SpiceDB API] is via **gRPC**.

For environments where gRPC is not available, SpiceDB provides a REST gateway that exposes a REST API for making calls.

[SpiceDB API]: https://buf.build/authzed/api/docs/main/authzed.api.v1

## Running SpiceDB with the REST API

To enable the REST API gateway on SpiceDB, add the flag `--http-enabled` to the SpiceDB arguments:

```sh
spicedb serve --grpc-preshared-key "secrettoken" --http-enabled
```

This will serve the REST API on port `8443` by default.

## API Reference

See the [REST API Reference].

[REST API Reference]: /rest-api
