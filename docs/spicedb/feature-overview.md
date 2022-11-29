# Feature Overview

[SpiceDB][spicedb] is a database system for managing security-critical permissions checking.

SpiceDB acts as a centralized service that stores authorization data.
Once stored, data can be performantly queried to answer questions such as "Does this user have access to this resource?" and "What are all the resources this user has access to?".

When used in production, these queries are performed through the [API entrypoint][serve], but SpiceDB offers two additional entrypoints: one for [integration tests][serve-testing] and one for [developer tooling][serve-devtools].

[spicedb]: https://github.com/authzed/spicedb
[serve]: #api-entrypoint
[serve-testing]: #integration-tests-entrypoint
[serve-devtools]: #devtools-entrypoint

## API Entrypoint

The API entrypoint is the primary means of running SpiceDB for production deployments.
It can serve its API over gRPC or JSON via HTTP and has configuration for data persistence and various aspects of performance.

### Architecture

The following is a high-level overview of the sofware architecture of a SpiceDB deployment.
For more information, read the [architecture blog post][arch].

[arch]: https://authzed.com/blog/spicedb-architecture/

<img alt="architecture of a spicedb deployment" src="/img/arch.svg"/>

### gRPC API

The recommended and most supported API server for SpiceDB operates using the gRPC protocol.
All official [client libraries] are designed to use this API because it offers the highest performance, reliability, and configurability.

For more information, see the [API Overview].

[client libraries]: /reference/clients.md
[API Overview]: /reference/api.md

### HTTP API

Optionally, SpiceDB can also support handling JSON requests over HTTP.
This is accomplished by using the [gRPC Gateway], which translates requests into gRPC messages and forwards them to the port SpiceDB is configured to use for handling gRPC requests.
The API is documented via [OpenAPI], but may have breaking changes in the future.

For more information, see the [API Overview].

[gRPC Gateway]: https://github.com/grpc-ecosystem/grpc-gateway
[OpenAPI]: https://www.postman.com/authzed/workspace/spicedb/overview
[API Overview]: /reference/api.md

### Datastore

[Datastores][datastore] are the means of configuring the behavior and performance of persisting relationship and schema data.

To understand the trade-offs between various implementations of Datastores, see the [Selecting a Datastore][select-datastore] guide.

[datastore]: /reference/glossary.md#datastore
[select-datastore]: spicedb/selecting-a-datastore.md

#### Read-only

All datastores can be configured to operate in a read-only mode.
When API requests that attempt to perform writes are made while in read-only, the API will return an [Unavailable status][grpc-status] with the reason `SERVICE_READ_ONLY`.

[grpc-status]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

#### Hedging

All datastores support having their requests hedged.
If a request to the datastore has taken too long, another request is made to hedge against the first never completing.
A configurable quantile value, defaulting to p95, is used to determine whether or not a request is slow.
When there are not enough samples to accurately use a quantile, a configured absolute duration is used.

### Dispatching

[Dispatching][dispatch] is the primary means of distributing caching across a SpiceDB deployment.
By default, dispatching only occurs on a single instance.
When configured with a server to listen for dispatch requests and a source of peer discovery, SpiceDB will use consistent hashing to map specific requests to specific instances in the deployment with the ultimate goal of improving cache hit rates.

[dispatch]: /reference/glossary.md#dispatchers

### Dashboard

The dashboard serves as an internal website for humans operating SpiceDB.
It currently includes simple instructions for how to configure [zed][zed] for the running instance.

[zed]: https://github.com/authzed/zed

## Integration Tests Entrypoint

The integration testing entrypoint runs a modified versions of API service intended for applications to use as a fixture for running tests.
Each [Bearer Token][bearer-token] provided by the client is allocated its own isolated, ephemeral datastore.
By generating a unique authentication token for each test, tests can be executed in parallel safely against a single instance of SpiceDB.

[bearer-token]: /reference/api.md#authentication

### GitHub Action

One of the best ways to consume the integration tests entrypoint is via the [SpiceDB GitHub Action][gha].

[gha]: https://github.com/authzed/action-spicedb

## Devtools Entrypoint

The devtools entrypoint is currently used to power the [Playground][playground].
It has the capability to validate schemas with relationships and assertions, using an amount that fits in memory.
It can also optionally persist and serve schemas bundled with their relationships and assertions. These bundles can be shared or imported into SpiceDB via [zed][zed] or using flags for bootstrapping SpiceDB.

[playground]: https://play.authzed.com
[zed]: https://github.com/authzed/zed

### Language Server

[In the future][lsp-issue], this API will change to support the [Language Server Protocol][lsp], so that more tools than just the Playground are supported.

[lsp-issue]: https://github.com/authzed/spicedb/issues/179
[lsp]: https://microsoft.github.io/language-server-protocol/

## All Entrypoints

### Logging

Every entrypoint to SpiceDB supports configuring structured logging with various formats and log levels.

### Metrics

Every entrypoint to SpiceDB has a configurable HTTP server that serves as both a [Prometheus metrics endpoint][prom-endpoint] at `/metrics` and [Go runtime pprof][go-pprof] endpoints at `/debug/pprof`.
Available metrics include operational information about the Go runtime and serving metrics for any servers that are enabled.

[prom-endpoint]: https://prometheus.io/docs/concepts/jobs_instances/
[go-pprof]: https://pkg.go.dev/runtime/pprof

### Tracing

Every entrypoint that runs an API server is instrumented to support [OpenTelemetry][otel] for distributed tracing.
Currently, [only Jaeger is supported][otel-collector-issue], but in the future, SpiceDB will support generic [OpenTelemetry Collectors][otel-collector].

[otel]: https://opentelemetry.io
[otel-collector-issue]: https://github.com/authzed/spicedb/issues/14
[otel-collector]: https://opentelemetry.io/docs/collector/

## Available Integrations

SpiceDB supports [integrations] with a variety of backing datastores, identity providers, and tools.

Looking for support with additional integrations? Join the SpiceDB community by filing a [GitHub issue] or providing a contribution.

[integrations]: https://authzed.com/integrations
[GitHub issue]: https://github.com/authzed/spicedb/issues
