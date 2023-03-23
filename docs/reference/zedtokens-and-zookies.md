# ZedTokens

## Overview

### What is a ZedToken?

A ZedToken is a token representing a **point-in-time** of the SpiceDB datastore, encoded for easy storage and transmission.

"ZedToken" is the SpiceDB name for [Zookies].

[zookies]: https://zanzibar.tech/2Dv_Aat_2Q:0.Py6NWBPg8:2U

## Why should I use them?

In SpiceDB, there is a requirement for both proper consistency, as well as excellent performance.

To achieve performance, SpiceDB implements a number of levels of caching, to ensure that repeated permissions checks do not need to be recomputed over and over again, so long as the underlying relationships behind those permissions have not changed.

However, all caches suffer from the risk of becoming stale: if a relationship has changed, and all the caches have not been updated or cleared, there is a risk of returning incorrect permission information.

This problem is known as the [New Enemy Problem]: a permission for a user could be removed, sensitive information then added into the protected resource, and if the permissions check for that user had been previously cached as `Affirmative`, then the user could incorrectly be granted access to sensitive information.

To work around this problem, while still ensuring excellent performance, the SpiceDB API supports ZedTokens: a token that specifies that caches **must** have data at least as fresh as this token, or else they cannot be used.

[new enemy problem]: glossary.md#new-enemy-problem

## How do I use them?

A ZedToken is typically used by first issuing a `authzed.api.v1.CheckPermission` or `authzed.api.v1.WriteRelationships` call.
The API call will return a ZedToken, which the caller then stores alongside the resource (e.g. in an additional column in a relational database).

On the next permissions check for the resource, the ZedToken is provided to SpiceDB, ensuring that the check is working with data as fresh as the previous request.

### When changing the content of a resource

1. Issue an `authzed.api.v1.CheckPermission` request for the resource, with [Consistency] of `fully_consistent` to ensure the current user still has access
2. The ZedToken is found in the `checked_at` field in [the Check response].
3. The ZedToken is stored next to the resource, in the database.

### When adding or removing a relationship for a resource

1. Issue an `authzed.api.v1.WriteRelationships` request for the resource, to add or remove a relationship permitting access to that resource, for a subject.
2. The ZedToken is found in the `written_at` field in [the Write response].
3. The ZedToken is stored alongside the resource wherever that may be.

### When adding or removing a resource

1. Issue an `authzed.api.v1.WriteRelationships` request for the resource and its parent resource, indicating that the resource is now linked to its parent resource.
2. The ZedToken is found in the `written_at` field in [the Write response].
3. The ZedToken is stored alongside the _parent_ resource.
4. Use the ZedToken for future `authzed.api.v1.LookupResources` requests.

### Using the stored ZedToken

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

[the check response]: https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.CheckPermissionResponse
[the write response]: https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.WriteRelationshipsResponse
[v1 api]: https://buf.build/authzed/api/tree/main/authzed/api/v1
[consistency]: api-consistency.md

## Frequently Asked Questions

### If I store ZedTokens will they become stale at some point?

Only if used with `at_exact_snapshot`: A ZedToken represents a _point-in-time_, so if you use an older ZedToken with `at_least_as_fresh` in the [Consistency] option passed to your `CheckPermission` call, the ZedToken ensures that it defines merely a _lower bound_ for staleness.

Sending a very old ZedToken with `at_least_as_fresh` is more or less a no-op: if all the caches have caught up (which they should do within a few seconds), then no additional work is necessary on SpiceDB's side.

If used with `at_exact_snapshot`, the ZedToken _can_ become stale after that point in time's data has been removed by the garbage collector.

### How do I check a permission at a specific point in time?

You can pass the ZedToken as `at_exact_snapshot` in the [Consistency] options to ensure the API result is computed at that exact point.

:::warning
SpiceDB will expire garbage and collect it over time.
The above API call _can fail with a "Snapshot Expired" error_.
It is recommended to only use this option if you are paginating over results within a short window.
This window is determined by the `--datastore-gc-window` when running SpiceDB.
:::

### How should I interact with Zedtokens when I'm modifying content in my application?

The recommendation (see above) is to issue an `authzed.api.v1.CheckPermission` request for the resource being modified with [Consistency] of `fully_consistent` _before sensitive information is saved_, storing the resulting ZedToken along with the sensitive information being written.

This ensures that subsequent permission checks that are provided the ZedToken will compute on the state of the permissions system from when the sensitive information was written.

### How do I use ZedToken's with `authzed.api.v1.LookupResources`?

Since `LookupResources` provides the ability to lookup all accessible resources of a particular type, this means we cannot simply use the ZedToken associated with the resources being found.

The recommendation for using a ZedToken with `authzed.api.v1.LookupResources` is to use the ZedToken stored for the _parent_ resource of the resources being found, _but only if information can be leaked during the search_.

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

If you do not intend to store ZedTokens and you care about the New Enemy Problem, it is recommended that **all** calls use [Consistency] of `fully_consistent` (which has a major performance hit, but is fully safe). Really, though, you should store ZedTokens.

#### But I really don't want to store a ZedToken

Only ever using a consistency of `minimize_latency` can expose your application up to the [New Enemy Problem]. However, if that is not a concern and you are okay with a staleness window of 5-30s (SpiceDB's default is ~5s), then you can use `minimize_latency` without major concern.

### Further Questions?

See also [this discussion] for some insights

[this discussion]: https://github.com/authzed/spicedb/issues/1117
