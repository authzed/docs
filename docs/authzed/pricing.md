# Pricing on Authzed

[Authzed], the managed permissions database service, has a **usage** based pricing model.

Customers are charged monthly based on two dimensions: the number of [relationships] stored in Authzed, and the number of dispatched operations made when performing [API] calls.

[relationships]: /reference/glossary#relationship
[API]: /reference/api
[Authzed]: https://app.authzed.com

| Dimension             | Price Per 1 miliion |
|-----------------------|---------------------|
| Relationships         | $1 per 1 million    |
| Dispatched Operations | $1 per 1 million    |

## Do you have a free tier?

Yes. Any amount less than 1 million relationships or dispatched operations is considered a charge of `$0`.

A credit card is required to be entered for production permissions systems.

## How do I enable and configure billing?

Click the `Billing` tab in the left hand side column of [Authzed].

## Viewing operation counts

The count of dispatched and cached operations can be viewed in the `Billing` panel of the permissions system view on [Authzed].

<img src="/img/billing-metrics.png"/>

## What counts as a "dispatched operation"?

A **dispatched operation** is a single *non-cached* operation performed by Authzed to resolve the answer to the API request.

The number of dispatched operations depends heavily on the type of [API] being called, the complexity of the permissions system's [schema] and how many of those operations have been cached from previous [API] calls.

[schema]: /guides/schema

### API Dispatch Estimation

Below are the estimations for determining the worse-cast dispatch count for an API call:

| API                    | Dispatch Count                                      |
|------------------------|-----------------------------------------------------|
| [CheckPermission]      | The number of non-cached subproblems to be computed |
| [ExpandPermissionTree] | The number of non-cached subproblems to be computed |
| [LookupResources]      | The number of non-cached subproblems to be computed |
| [WriteRelationships]   | The number of preconditions + `1` for the write     |
| [DeleteRelationships]  | The number of preconditions + `1` for the delete    |

[CheckPermission]: https://buf.build/authzed/api/docs/main:authzed.api.v1#CheckPermission
[ExpandPermissionTree]: https://buf.build/authzed/api/docs/main:authzed.api.v1#ExpandPermissionTree
[LookupResources]: https://buf.build/authzed/api/docs/main:authzed.api.v1#LookupResources
[WriteRelationships]: https://buf.build/authzed/api/docs/main:authzed.api.v1#WriteRelationships
[DeleteRelationships]: https://buf.build/authzed/api/docs/main:authzed.api.v1#DeleteRelationships

### Example: CheckPermission

Imagine a permissions system with the following schema:

```zed
definition user {}

definition document {
    relation reader: user
    relation writer: user
    
    permission view = reader + writer
}
```

Issuing a [CheckPermission] call for `view` permission on a `document` will have to check three sub-problems: `view`, `reader` and `writer`.

The dispatched operation count for this API call will **at most** be `3`, with lower counts based whether the user was found early, whether the problems have been cached, or other optimizations automatically performed by Authzed.

### Finding out the dispatched count

To find the dispatched count of an API operation, the [zed] tool can be used with the `--log-level debug` flag:

```sh
$ zed permission check document:firstdoc view user:someuser --log-level debug
DBG set log level new level=debug
DBG extracted response dispatch metadata cached=3 dispatch=0
```

The number of dispatched operations can be found in `dispatch`, while the number of *cached* operations can be found as `cached`

:::note
The number of cached vs dispatched operations will change over time based on the usage of the API

Authzed will automatically cache results and attempt to reuse the cache as much as possible
:::

[zed]: https://github.com/authzed/zed
