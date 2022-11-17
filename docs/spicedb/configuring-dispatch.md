# Configuring Dispatching

:::note
If you are deploying SpiceDB under Kubernetes, it is recommended to use the [SpiceDB Operator], which will configure dispatching automatically
:::

[spicedb operator]: /spicedb/operator

## What is Dispatching?

**Dispatching** is a feature of SpiceDB where requests to SpiceDB are, in turn, forwarded onto ("dispatched") to other SpiceDB nodes within the cluster, to allow for reuse of cache.

Each SpiceDB node maintains an in-memory cache of permissions queries it has resolved in the past; when a new permissions query is encountered by one node, its answer may be present on another node, so SpiceDB will forward the request onward to the other node to check the shared cache.

For more details on how dispatching works, see the [Consistent Hash Load Balancing for gRPC] article.

[consistent hash load balancing for grpc]: https://authzed.com/blog/consistent-hash-load-balancing-grpc/

## Configuring Dispatch in Kubernetes

If not using the [SpiceDB Operator], the `dispatch-upstream-addr` should be of the form `kubernetes:///spicedb.default:50053` where `spicedb.default` is the Kubernetes `Service` in which SpiceDB is accessible.

## Configuring Dispatch in non-Kubernetes Environments

:::warning
Non-Kubernetes based dispatching relies upon DNS updates, which means it can become stale if DNS is changing. This is not recommended unless DNS updates are rare.
:::

To enable dispatch, the following flags must be specified:

```sh
spicedb serve --dispatch-cluster-enabled=true --dispatch-upstream-addr=upstream-addr ...
```

or via environment variables with the `SPICEDB_` prefix:

```sh
SPICEDB_DISPATCH_CLUSTER_ENABLED=true SPICEDB_DISPATCH_UPSTREAM_ADDR=upstream-addr spicedb serve ...
```

The `upstream-addr` should be the DNS address of the load balancer at which _all_ SpiceDB nodes are accessible at the default dispatch port of `:50053`.
