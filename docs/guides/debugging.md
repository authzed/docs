# Debugging SpiceDB Checks

While it is recommended that SpiceDB [schema] be [validated and tested] before production deployment, there are many scenarios in which being able to see the _actual_ paths taken against production data is incredibly important.

[schema]: schema
[validated and tested]: validation-and-testing

To support this use case the CheckPermission API supports a special debug header which can be used to retrieve the _full_ set of relations and permission traversed in order to compute the result.

:::note
Calling the CheckPermission API with the debug header set will result in a small, but noticable performance penalty. It is highly recommended to **not** set this header unless a trace is required.
:::

## Displaying explanations via zed

The simplest way to use the tracing system is to use the [zed] CLI tool with the `--explain` flag:

[zed]: https://github.com/authzed/zed

```sh
zed permission check release something not_banned user foo --explain
```

The result of the check will be displayed graphically, with permissions in green and relations in orange:

<img src="/img/explain-success.png"/>

### Cached results

If the result for a CheckPermission has already been cached by SpiceDB, then that will be indicated:

<img src="/img/explain-cached.png"/>

### Cycle detection

If the schema and relationships within SpiceDB forms a cycle, it will be indicated in the output:

<img src="/img/explain-cycle.png"/>

## Using the tracing API directly

If you wish to call `CheckPermission` and retrieve the debug traces directly, there are a few steps involved:

1. Set the [header] `io.spicedb.requestdebuginfo` to value `true` on the request
2. Retrieve the [trailer] `io.spicedb.respmeta.debuginfo` and parse the JSON found within as a [DebugInformation] message.

[header]: https://github.com/authzed/authzed-go/blob/ff2f106e02f945e0f9f8a4df7dfeb20641924b1f/pkg/requestmeta/requestmeta.go#L24
[trailer]: https://github.com/authzed/authzed-go/blob/ff2f106e02f945e0f9f8a4df7dfeb20641924b1f/pkg/responsemeta/responsemeta.go#L40
[debuginformation]: https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.DebugInformation
