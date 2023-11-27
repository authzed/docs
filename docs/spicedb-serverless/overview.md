# SpiceDB Serverless

[SpiceDB Serverless] is the Authzed product for self-service, shared-hardware SpiceDB clusters.

- This is a fully managed service run by the experts at Authzed.
- Clusters are autonomously configured and scaled without any configuration necessary.
- Provision and manage permission systems and view real time metrics all from one place: our dashboard.

[spicedb serverless]: https://app.authzed.com/?utm_source=docs&utm_content=spicedb+serverless

## Endpoints

Your permission systems will be reachable via gRPC and HTTP endpoints:

- gRPC: grpc.authzed.com
- HTTP REST: [gateway-alpha.authzed.com](https://gateway-alpha.authzed.com)

A [Postman Collection](https://www.postman.com/authzed/workspace/spicedb/api) exists to help folks getting started with the REST API.

## Pricing

The billing model for this service is **usage-based**.

Customers are **charged monthly** based on two dimensions: the number of [relationships] stored in Authzed, and the number of [dispatched operations] made when performing [API] calls.

[relationships]: /reference/glossary.md#relationship
[dispatched operations]: #what-counts-as-a-dispatched-operation
[api]: /reference/api.md
[authzed]: https://app.authzed.com

| Dimension             | Price Per 1 miliion |
| --------------------- | ------------------- |
| Relationships         | $1 per 1 million    |
| Dispatched Operations | $1 per 1 million    |

### Do you have a free tier?

Yes. Any amount less than 1 million relationships or dispatched operations is considered a charge of `$0`.

A credit card is required to be entered for production permissions systems.

### How do I enable and configure billing?

Click the `Billing` tab in your [Authzed] dashboard.

### Viewing operation counts

The count of dispatched and cached operations can be viewed in the `Billing` panel of the permissions system view on [Authzed].

!['](/img/billing-metrics.png)

### What counts as a "dispatched operation"?

A **dispatched operation** is a single _non-cached_ operation performed by Authzed to resolve the answer to the API request.

The number of dispatched operations depends heavily on the type of [API] being called, the complexity of the permissions system's [schema] and how many of those operations have been cached from previous [API] calls.

[schema]: /guides/schema.md

#### API Dispatch Estimation

Below are the estimations for determining the worst-case dispatch count for an API call:

| API                    | Dispatch Count                                       |
| ---------------------- | ---------------------------------------------------- |
| [CheckPermission]      | The number of non-cached sub-problems to be computed |
| [ExpandPermissionTree] | The number of non-cached sub-problems to be computed |
| [LookupResources]      | The number of non-cached sub-problems to be computed |
| [WriteRelationships]   | The number of preconditions + `1` for the write      |
| [DeleteRelationships]  | The number of preconditions + `1` for the delete     |

[checkpermission]: https://buf.build/authzed/api/docs/main:authzed.api.v1#CheckPermission
[expandpermissiontree]: https://buf.build/authzed/api/docs/main:authzed.api.v1#ExpandPermissionTree
[lookupresources]: https://buf.build/authzed/api/docs/main:authzed.api.v1#LookupResources
[writerelationships]: https://buf.build/authzed/api/docs/main:authzed.api.v1#WriteRelationships
[deleterelationships]: https://buf.build/authzed/api/docs/main:authzed.api.v1#DeleteRelationships

#### Example: CheckPermission

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

#### Finding out the dispatched count

To find the dispatched count of an API operation, the [zed] tool can be used with the `--log-level debug` flag:

```sh
$ zed permission check document:firstdoc view user:someuser --log-level debug
DBG set log level new level=debug
DBG extracted response dispatch metadata cached=3 dispatch=0
```

The number of dispatched operations can be found in `dispatch`, while the number of _cached_ operations can be found as `cached`

:::note
The number of cached vs dispatched operations will change over time based on the usage of the API

Authzed will automatically cache results and attempt to reuse the cache as much as possible
:::

[zed]: https://github.com/authzed/zed
