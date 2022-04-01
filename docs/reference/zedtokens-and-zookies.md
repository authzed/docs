# ZedTokens & Zookies

## Overview

### What is a ZedToken?

A ZedToken is a token representing a **point-in-time** of the SpiceDB datastore, encoded for easy storage and transmission.

## Why should I use them?

In SpiceDB, there is a requirement for both proper consistency, as well as excellent performance.

To achieve performance, SpiceDB implements a number of levels of caching, to ensure that repeated permissions checks do not need to be recomputed over and over again, so long as the underlying relationships behind those permissions have not changed.

However, all caches suffer from the risk of becoming stale: if a relationship has changed, and all the caches have not been updated or cleared, there is a risk of returning incorrect permission information.

This problem is known as the [New Enemy Problem]: a permission for a user could be removed, sensitive information then added into the protected resource, and if the permissions check for that user had been previously cached as `Affirmative`, then the user could incorrectly be granted access to sensitive information.

To work around this problem, while still ensuring excellent performance, the API uses ZedTokens: a token that specifies that caches **must** have data at least as fresh as this token, or else they cannot be used.

[New Enemy Problem]: glossary.md#new-enemy-problem

## How do I use them?

A ZedToken is typically used by first issuing a `authzed.api.v1.CheckPermission` or `authzed.api.v1.WriteRelationships` call.
The API call will return a ZedToken, which the caller then stores alongside the resource (e.g. in an additional column in a relational database).

On the next permissions check for the resource, the ZedToken is provided to SpiceDB, ensuring that the check is working with data as fresh as the previous request.

### v1 API

In the [v1 API], a ZedToken is returned by all API calls, representing the point-in-time at which the API's result was computed.

#### When changing the content of a resource

1. Issue an `authzed.api.v1.CheckPermission` request for the resource, with [Consistency] of `fully_consistent` to ensure the current user still has access
2. The ZedToken is found in the `checked_at` field in [the Check response].
3. The ZedToken is stored next to the resource, in the database.

#### When adding or removing a relationship for a resource

1. Issue an `authzed.api.v1.WriteRelationships` request for the resource, to add or remove a relationship permitting access to that resource, for a subject.
2. The ZedToken is found in the `written_at` field in [the Write response].
3. The ZedToken is stored alongside the resource wherever that may be.

#### When adding or removing a resource

1. Issue an `authzed.api.v1.WriteRelationships` request for the resource and its parent resource, indicating that the resource is now linked to its parent resource.
2. The ZedToken is found in the `written_at` field in [the Write response].
3. The ZedToken is stored alongside the *parent* resource.
4. Use the ZedToken for future `authzed.api.v1.LookupResources` requests.

#### Using the stored ZedToken

All `CheckPermission` calls are given the stored ZedToken via the [Consistency] configuration:

```proto
// If ZedToken is present
CheckPermissionRequest{
  consistency: {
      at_least_as_fresh: ZedToken{
          token: `stored zookie`
      }
  }
}

// Otherwise, use full consistency
CheckPermissionRequest{
  consistency: {
      fully_consistent: true
  }
}
```

[the Check response]: https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.CheckPermissionResponse
[the Write response]: https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.WriteRelationshipsResponse
[v1 API]: https://buf.build/authzed/api/tree/main/authzed/api/v1
[Consistency]: api-consistency.md

## Frequently Asked Questions

### If I store ZedTokens will they become stale at some point?

In v1, the recommendation is to use `at_least_as_fresh` in the [Consistency] option passed to your `CheckPermission` call, ensuring that it defines merely a lower bound for staleness.

In v0, Zookies specify lower bound for the time at which caches are considered valid (except for `Read`), so any information newer than that bound will be checked as needed.

### How do I check a permission at a specific point in time?

In v1, you can pass the ZedToken as `at_exact_snapshot` in the [Consistency] options to ensure the API result is computed at that exact point.

:::warning
SpiceDB will expire garbage and collect it over time.
The above API call *can fail with a "Snapshot Expired" error*.
It is recommended to only use this option if you are paginating over results within a short window.
This window is determined by the `--datastore-gc-window` when running SpiceDB.
:::

### How should I interact with Zedtokens when I'm modifying content in my application?

The recommendation (see above) is to issue an `authzed.api.v1.CheckPermission` request for the resource being modified with [Consistency] of `fully_consistent` *before sensitive information is saved*, storing the resulting ZedToken along with the sensitive information being written.

This ensures that subsequent permission checks that are provided the ZedToken will compute on the state of the permissions system from when the sensitive information was written.

### How do I use ZedToken's with `authzed.api.v1.LookupResources`?

Since `LookupResources` provides the ability to lookup all accessible resources of a particular type, this means we cannot simply use the ZedToken associated with the resources being found.

The recommendation for using a ZedToken with `authzed.api.v1.LookupResources` is to use the ZedToken stored for the *parent* resource of the resources being found.
For example, imagine the following schema:

```zed
definition user {}

definition organization {
  relation admin: user
}

definition resource {
  relation org: organization
  relation viewer: user

  permission view = viewer + org->admin
}
```

Since all resources "live" within an organization, the recommendation is to **store the ZedToken created when the relationship between the `resource` and its parent `organization` is written**.
By doing so, when the ZedToken is provided to the lookup, the resource is guarenteed to be visible.
It is also recommended to grant the user access to the resource in the **same** call to `WriteRelationships`.

### What happens if I lose my ZedToken?

You can always get a new one by issuing any call in v1 (`CheckPermission` with [Consistency] of `fully_consistent` is recommended).

### What happens if I don't use a ZedToken at all?

The SpiceDB API will default to [Consistency] of `minimize_latency`.

If you do not intend to store ZedTokens, it is recommended that **all** calls use [Consistency] of `fully_consistent` (which has a major performance hit, but is fully safe). Really, though, you should store ZedTokens.

:::warning
Only ever using a consistency of `minimize_latency` can expose your application up to the [New Enemy Problem].
:::

## Internal Implementation Details

In SpiceDB, a ZedToken is the v1 equivalent of the v0 Zookie and are, in fact, *wire back compatible* with Zookies to allow for ease of upgrade.

- Zed Tokens (v1):
  - [External Proto Definition](https://buf.build/authzed/api/file/main/authzed/api/v1/core.proto#L53)
  - [Documentation](https://pkg.go.dev/github.com/authzed/spicedb/pkg/zedtoken)
  - [Implementation](https://github.com/authzed/spicedb/tree/main/pkg/zedtoken)
- Zookies (v0):
  - [External Proto Definition](https://buf.build/authzed/api/file/main/authzed/api/v0/core.proto#L60)
  - [Documentation](https://pkg.go.dev/github.com/authzed/spicedb/pkg/zookie)
  - [Implementation](https://github.com/authzed/spicedb/tree/main/pkg/zookie)

[➡️ Proto Definitions for the encoded forms](https://github.com/authzed/spicedb/tree/main/proto/internal/impl/v1/impl.proto)

### Zookie vs snapshot tokens

A Zookie typically represents a point in time *minimum* for an API call: if there is newer information available, it will be used, as the Zookie is defining a *lower bound* on the freshness of the information being used to compute a permission request.

This does not apply in the v0 `Read` API, where the Zookie is instead used as a *snapshot token*, to represent a single point in time that should be read.

In v1, this is all mitigated by the requirement to explicitly specify behavior via the [Consistency] block on all API requests.

### Internal Representation in SpiceDB

A ZedToken consists of a single `token` field:

```proto
ZedToken {
    Token: "encoded-proto-here"
}
```

which itself is the *encoded form of [a Protocol Buffer][impl-proto]*

Within the encoded ZedToken is the `revision`, matching a revision from the configured [datastore].

Similarly, a Zookie consists of a `token` field, storing an encoded Zookie Protocol buffer.

:::warning
ZedTokens and Zookies are **not** portable across datastore implementations.
:::

[impl-proto]: https://github.com/authzed/spicedb/tree/main/proto/internal/impl/v1/impl.proto
[datastore]: glossary.md#datastore
