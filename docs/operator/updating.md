# Updating

## Updating the Operator

Updating the operator is as simple as re-running:

```sh
kubectl apply --server-side -k github.com/authzed/spicedb-operator/config
```

whenever there is an [update available].

[update available]: https://github.com/authzed/spicedb-operator/releases

## Updating Managed SpiceDBClusters

The operator supports different strategies for updating SpiceDB clusters, described below.

If keeping on top of updates sounds daunting, [Authzed Dedicated] provides a simple interface for managing SpiceDB upgrades without the hassle.

[Authzed Dedicated]: https://authzed.com/pricing

### Automatic Updates

Every release of SpiceDB Operator comes with a version of SpiceDB that it considers the "default" version.
This default version is used for every `SpiceDBCluster` that does not specify a specific `image` in its `.spec.config`.
When either the operator or its config file is updated, every cluster under management will be rolled to the new default version.

This is recommended primarily for development environments.

If you wish to have truly zero-touch upgrades, you can automate the updating of the operator with standard git-ops tooling like [Flux] or [ArgoCD].
In the future, other update mechanisms may become available.

[Flux]: https://github.com/fluxcd/flux2/
[ArgoCD]: https://argoproj.github.io/cd/

### Manual upgrades

If you specify a container image from a [SpiceDB release] in `.spec.config.image`, the cluster will not be updated automatically.
You can choose when and how to update to a new release of SpiceDB, which is recommended for production deployments.

Each operator release only "knows" about previous SpiceDB releases.
Although the operator attempts to be forward-compatible as much as possible, the guarantees are only best-effort.
We recommend updating SpiceDB operator before updating SpiceDB whenever possible.

[SpiceDB release]: https://github.com/authzed/spicedb/releases/
