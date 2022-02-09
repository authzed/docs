# API Overview

SpiceDB primarily exposes its APIs via [gRPC] and publishes its [Protobuf Definitions] to the [Buf Registry].

The API can be accessed by [various clients] from programming languages or the command line.

[gRPC]: https://grpc.io
[Protobuf Definitions]: https://buf.build/authzed/api
[Buf Registry]: https://buf.build
[various clients]: clients.md

## Authentication

In order to connect to the API, you must provide a [Bearer Token] in order to identify yourself.
If you are using an officially supported client library, refer to its documentation or examples for how to provide your credential.
If you are using your own or third party gRPC clients, refer to the [gRPC Authentication documentation].

Authzed users can find their API Token in the [Authzed dashboard].

[Bearer Token]: https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
[gRPC Authentication documentation]: https://grpc.io/docs/guides/auth
[Authzed dashboard]: https://app.authzed.com

## Alternative HTTP/JSON API

By configuring an additional port to listen for traffic, SpiceDB can also support handling JSON requests over HTTP.
This is accomplished by using the [gRPC Gateway], which translates requests into gRPC messages and forwards them to the port SpiceDB is configured to use for handling gRPC requests.
The API is documented via [OpenAPI], but may have breaking changes in the future.
Once the API has stablized, this functionality will become available for Authzed users.

[gRPC Gateway]: https://github.com/grpc-ecosystem/grpc-gateway
[OpenAPI]: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/authzed/authzed-go/main/proto/apidocs.swagger.json

## Versioning & Deprecation Policy

APIs are versioned by their Protobuf package and version compatibility is enforced by the [Buf Breaking Rules].
New Messages, Fields, Services, and RPCs can be added to existing APIs as long as existing calls continue to exhibit the same behavior.

When an API version is marked as deprecated, the duration of its continued support will be announced.

During this deprecation period, Authzed reserves the right to take various actions to users and clients using deprecated APIs:

- Email users
- Print warning messages from official clients
- Purposely disrupt service near the end of the period

[Buf Breaking Rules]: https://docs.buf.build/breaking-rules

## Changelog

:::caution

authzed.api.v0 will be [deprecated] on March 14, 2022. Upgrade to the [authzed.api.v1][bsr-v1] API.

:::

### authzed.api.v1

The v1 Authzed API is a full redesign of the initial v0 APIs.

#### API Docs

gRPC Documentation can be found in the [Buf Registry][bsr-v1].

[bsr-v1]: https://buf.build/authzed/api/docs/main/authzed.api.v1

#### Changes

- Consistency is now configurable on a per-request basis.
  Schema Read/Write are always fully consistent
- Schema Read/Write now operates on all definitions at once
- Relationships are now composed of an Object and Subject references and the relation between them
- DeleteRelationships was added to enable bulk removal of Relationships

- Preconditions for WriteRelationships/DeleteRelationships are now expressed via Relationship filters

<details>
<summary>Legacy API versions</summary>

### authzed.api.v1alpha1

A pre-release of some work-in-progress APIs for the eventual v1 release.

#### API Docs

gRPC Documentation can be found on the [Buf Registry][bsr-v1alpha1].

#### Changes

- A new _Schema_ language replaces Namespace Configs.
  Existing v0 NamespaceConfigs can be read from the SchemaRead() API.

[bsr-v1alpha1]: https://buf.build/authzed/api/docs/main/authzed.api.v1alpha1

### authzed.api.v0

v0 is now [deprecated].

v0 is the first iteration of the Authzed API.
It strived to be as accurate to the description of the [Zanzibar] APIs as possible.

[Zanzibar]: https://research.google/pubs/pub48190/

#### Caveats

This API did not originally have a Protobuf package defined and was migrated to have one.
While the API can be called with or without the `authzed.api.v0` prefix, some tools built to use the [gRPC Reflection API] will not work with the prefixless form.
This had no effect on any official tooling or client libraries as all stable releases have always used the fully prefixed names of RPCs.

[gRPC Reflection API]: https://github.com/grpc/grpc/blob/master/doc/server-reflection.md
[deprecated]: #versioning--deprecation-policy

</details>
