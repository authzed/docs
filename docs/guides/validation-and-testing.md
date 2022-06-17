# Validation and Testing

After the initial [development of the schema] for a Permissions System, it is important to ensure that all subsequent changes are continued to be tested and validated.

[development of the schema]: schema.md

SpiceDB provides two sets of tooling to help in this area: A validation system that can be run from the command line or as part of CI, to ensure that any schema changes continued to be validated as part of the development process, and a built-in testing server for running real API calls against in-memory testing data.

## Validation of schema changes

Validation of schema is critical to ensure that a Permissions System operates as intended by its developers.
To help with that goal, the [Authzed Playground] provides two sets of validation tooling: an "Assertions" tab which allows for defining Checks that are expected to succeed or fail, and the "Expected Relations" tab which allows for defining the exhaustive set of subjects that can be found for a particular permission, on a particular resource.
Together, these tabs provide a very powerful way of **exhaustively** validating the schema for a Permissions System.

However, using the Playground for all development validation is not tenable: changes to schema may occur outside, and it is critical that schema be validated even if edited with another editor.

:::note
The examples below use the `zaml` suffix for the files containing schema, test relationships, assertions and expected relations. This is merely a convention, and the files are YAML. An example can be found as [test-schema.zaml]
:::

To support this use case, the [zed] CLI tool provides the `validate` command, which can be used to run the *same* validation as the Playground, over a downloaded Playground YAML file:

```sh
$ zed validate schema-and-assertions.zaml
Success! - 3 relationships loaded, 4 assertions run, 2 expected relations validated
```

This functionality is also provided in the form of a [GitHub Action], for use in GitHub CI:

```yaml
steps:
- uses: "authzed/action-spicedb-validate@v1"
  with:
    validationfile: "myschema.zaml"
```

[Authzed Playground]: https://play.authzed.com
[zed]: https://github.com/authzed/zed
[Github Action]: https://github.com/authzed/action-spicedb-validate
[test-schema.zaml]: https://github.com/authzed/action-spicedb-validate/blob/main/test-schema.zaml

## Testing code against SpiceDB

In addition to validation of schema, it is often important to test the actual API calls being made to [SpiceDB].

To support this use case, the [SpiceDB] binary provides a specialized run mode called `serve-testing`, which runs SpiceDB in a *testing-only* mode:

```sh
$ spicedb serve-testing
2:24PM INF set log level new level=info
2:24PM INF set tracing provider new provider=none
2:24PM INF this is the latest released version of SpiceDB
2:24PM WRN grpc server serving plaintext prefix=grpc
2:24PM INF grpc server started listening addr=:50051 network=tcp prefix=grpc workers=0
2:24PM WRN grpc server serving plaintext prefix=readonly-grpc
2:24PM INF grpc server started listening addr=:50052 network=tcp prefix=readonly-grpc workers=0
```

### Making API calls

The `serve-testing` command starts SpiceDB in *Testing Mode*, which has a number of unique features to it:

#### Ephemeral Data

All data written is *ephemeral*: it will be lost when the process is shut down.

#### Normal and Read-Only API

The API is served on *two* ports: By default, the normal API is served on port `50051` while a read-only version of the *same* API is served on port `50052`

This allows for easy testing of SpiceDB in read-only mode.

#### Token Isolation

:::note
It is **highly** recommended to use Token Isolation for testing
:::

If a token is provided to the API call, SpiceDB will create a **unique ephemeral datastore** for that token.

This means that multiple tests can make multiple API calls which read and write to an **isolated version** of the Permissions System, simply by switching the token being sent to the server.

If no token is provided, a "default" datastore is used.

### Preloading data

The `serve-testing` command also supports preloading of schema and test relationships via the use of the `--load-configs` flag:

```sh
$ spicedb serve-testing --load-configs myschema.zaml
2:24PM INF set log level new level=info
2:24PM INF set tracing provider new provider=none
2:24PM INF this is the latest released version of SpiceDB
2:24PM WRN grpc server serving plaintext prefix=grpc
2:24PM INF grpc server started listening addr=:50051 network=tcp prefix=grpc workers=0
2:24PM WRN grpc server serving plaintext prefix=readonly-grpc
2:24PM INF grpc server started listening addr=:50052 network=tcp prefix=readonly-grpc workers=0
```

The file format of the schema and test relationship data is the same as that used by the validation tooling discussed above.

[SpiceDB]: https://github.com/authzed/spicedb

### Running via GitHub Action

Like the validation command, `serve-testing` is also available in [GitHub Action Form]:

```yaml
steps:
- uses: "authzed/action-spicedb@v1"
  with:
    version: "latest"
```

[GitHub Action Form]: https://github.com/authzed/action-spicedb
