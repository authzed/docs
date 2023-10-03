# SpiceDB Operator

The SpiceDB operator is a [Kubernetes Operator] that can manage the installation and lifecycle of SpiceDB Clusters.

[kubernetes operator]: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/

## Installing

### Create a Kubernetes Cluster

The installation guide assumes you already have a kubernetes cluster available.

If you want to run the operator locally, we recommend one of:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kind](https://kind.sigs.k8s.io)
- [minikube](https://minikube.sigs.k8s.io)

### Install the Operator with `kubectl`

Confirm you are connected to the correct cluster with `kubectl config current-context`, and then:

```sh
kubectl apply --server-side -k github.com/authzed/spicedb-operator/config
```

After a succesful rollout, you will see the spicedb-operator pod running in the `spicedb-operator` namespace.

```sh
kubectl -n spicedb-operator get pods
```

### Create a `SpiceDBCluster`

:::warning
The commands documented here do not configure best practices for production deployments.
For example, TLS is disabled and data is not persisted when SpiceDB is shut down.
See the guide for [selecting a datastore].
:::

[selecting a datastore]: /spicedb/selecting-a-datastore.md

You can now create and configure SpiceDB clusters by writing a `SpiceDBCluster` objects.
For example:

```sh
kubectl apply --server-side -f - <<EOF
apiVersion: authzed.com/v1alpha1
kind: SpiceDBCluster
metadata:
  name: dev
spec:
  config:
    datastoreEngine: memory
  secretName: dev-spicedb-config
---
apiVersion: v1
kind: Secret
metadata:
  name: dev-spicedb-config
stringData:
  preshared_key: "averysecretpresharedkey"
EOF
```

Forward the port so that you can connect to it:

```sh
kubectl port-forward deployment/dev-spicedb 50051:50051
```

This creates a single node cluster with no persistent storage.
See the [examples] in the GitHub repo for more deployment options, including TLS, connecting to datastore backends, and configuring ingress.

[examples]: https://github.com/authzed/spicedb-operator/tree/main/examples

### Connect and Verify

A variety of [clients/tools] can be used to interact with the API.

[zed] is the official CLI client and can be used to check that SpiceDB is running, write schema and relationships, and perform other operations against SpiceDB:

[clients/tools]: /reference/clients.md
[zed]: https://github.com/authzed/zed

#### Running via brew

[zed] is available via brew on macOS and Linux.

```sh
brew install zed
```

```sh
zed context set local localhost:50051 "somerandomkeyhere" --insecure
zed schema read --insecure
```

## Configuration

### Flags

SpiceDB flags can be set via the `.spec.config` field on the `SpiceDBCluster` object:

```yaml
apiVersion: authzed.com/v1alpha1
kind: SpiceDBCluster
metadata:
  name: dev
spec:
  config:
    replicas: 2
    datastoreEngine: cockroachdb
    logLevel: debug
```

Any CLI flag for SpiceDB can be set in `config` by converting the name of the flag to camelCase and removing dashes.
For example: `--log-level` becomes `logLevel`, `--datastore-engine` becomes `datastoreEngine`, and so on. The values for these flags are expected to be strings, unless the operator has implemented special support for a specific flag.
This allows the operator to be forward-compatible with new versions of SpiceDB, even if it doesn't know about new features and flags.
There may be exceptions to this rule, but they will be documented in release notes if and when they occur.

The operator also introduces some new flags that are not present on the CLI:

| Flag                         | Description                                                                                                                                                          | Type                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| image                        | A specific container image to run.                                                                                                                                   | string                      |
| replicas                     | The number of nodes to run for this cluster.                                                                                                                         | string or int               |
| skipMigrations               | If true, the operator will not run migrations on changes to this cluster.                                                                                            | string or bool              |
| tlsSecretName                | The name of a Kubernetes secret in the same namespace to use as the TLS credentials for SpiceDB services.                                                            | string                      |
| dispatchUpstreamCASecretName | The name of a Kubernetes secret in the same namespace to use as the TLS CA validation. This should be the CA cert that was used to issue the cert in `tlsSecretName` | string                      |
| datastoreTLSSecretName       | The name of a Kubernetes secret containing a TLS secret to use when connecting to the datastore.                                                                     | string                      |
| spannerCredentials           | The name of a Kubernetes secret containing credentials for talking to Cloud Spanner. Typically, this would not be used, in favor of workload identity.               | string                      |
| extraPodLabels               | A set of additional labels to add to the spicedb pods.                                                                                                               | string or map[string]string |
| extraPodAnnotations          | A set of additional annotations to add to the spicedb pods.                                                                                                          | string or map[string]string |

All other flags are passed through to SpiceDB without any additional processing.

### Global Config

The operator comes with a global config file baked into the image.
This defines what the default is and what SpiceDB images are allowed (the operator will run any image as SpiceDB, but will warn if it is not in this list).

The file is located at `/opt/operator/config.yaml` in released images, and can be changed with the `--config` flag on the operator.

Example:

```yaml
allowedImages:
  - ghcr.io/authzed/spicedb
  - authzed/spicedb
  - quay.io/authzed/spicedb
allowedTags:
  - v1.11.0
  - v1.10.0
disableImageValidation: false
imageName: ghcr.io/authzed/spicedb
imageTag: v1.11.0
```

If `disableImageValidation` is `true`, then the operator will not warn if it is running an image outside the allowed list.

### Bootstrapping CRDs

The operator can optionally bootstrap CRDs on start up with `--crds=true`.

This is not generally recommended; it requires granting CRD create permission to the operator.

### Static SpiceDBClusters

The operator can optionally take in a set of "static" SpiceDBClusters that it will create on startup, via `--bootstrap-spicedbs`.
This argument is expected to be a file with a yaml list of SpiceDBCluster objects.

This is not generally recommended; it is primarily for CD of the operator itself.

### Debug, Logs, Health, and Metrics

The operator serves a debug endpoint, health, and metrics from the same address, defined by `--debug-addr` (`:8080` by default):

- `/metrics` serves a prometheus metric endpoint, which includes controller queue depths and stats about abnormal SpiceDBClusters.
- `/debug/pprof/` for profiling data
- `/healthz` for health

Log level can be configured with `--v` and accepts standard klog flags.

## Updating

### Updating the Operator

Updating the operator is as simple as re-running:

```sh
kubectl apply --server-side -k github.com/authzed/spicedb-operator/config
```

whenever there is an [update available].

[update available]: https://github.com/authzed/spicedb-operator/releases

### Updating Managed SpiceDBClusters

The operator supports different strategies for updating SpiceDB clusters, described below.

If keeping on top of updates sounds daunting, [Authzed Dedicated] provides a simple interface for managing SpiceDB upgrades without the hassle.

[authzed dedicated]: https://authzed.com/pricing

#### Automatic Updates

Every release of SpiceDB Operator comes with a version of SpiceDB that it considers the "default" version.
This default version is used for every `SpiceDBCluster` that does not specify a specific `image` in its `.spec.config`.
When either the operator or its config file is updated, every cluster under management will be rolled to the new default version.

This is recommended primarily for development environments.

If you wish to have truly zero-touch upgrades, you can automate the updating of the operator with standard git-ops tooling like [Flux] or [ArgoCD].
In the future, other update mechanisms may become available.

[flux]: https://github.com/fluxcd/flux2/
[argocd]: https://argoproj.github.io/cd/

#### Manual upgrades

If you specify a container image from a [SpiceDB release] in `.spec.config.image`, the cluster will not be updated automatically.
You can choose when and how to update to a new release of SpiceDB, which is recommended for production deployments.

Each operator release only "knows" about previous SpiceDB releases.
Although the operator attempts to be forward-compatible as much as possible, the guarantees are only best-effort.
We recommend updating SpiceDB operator before updating SpiceDB whenever possible.

[spicedb release]: https://github.com/authzed/spicedb/releases/
