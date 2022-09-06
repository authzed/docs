# Configuration

## Flags

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

| Flag                         | Description                                                                                                                                                           | Type                         |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
| image                        | A specific container image to run.                                                                                                                                    | string                       |
| replicas                     | The number of nodes to run for this cluster.                                                                                                                          | string or int                |
| skipMigrations               | If true, the operator will not run migrations on changes to this cluster.                                                                                             | string or bool               |
| tlsSecretName                | The name of a Kubernetes secret in the same namespace to use as the TLS credentials for SpiceDB services.                                                             | string                       |
| dispatchUpstreamCASecretName | The name of a Kubernetes secret in the same namespace to use as the TLS CA validation. This should be the CA cert that was used to issue the cert in `tlsSecretName`  | string                       |
| datastoreTLSSecretName       | The name of a Kubernetes secret containing a TLS secret to use when connecting to the datastore.                                                                      | string                       |
| spannerCredentials           | The name of a Kubernetes secret containing credentials for talking to Cloud Spanner. Typically, this would not be used, in favor of workload identity.                | string                       |
| extraPodLabels               | A set of additional labels to add to the spicedb pods.                                                                                                                | string or map[string]string  |

All other flags are passed through to SpiceDB without any additional processing.

## Global Config

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

## Bootstrapping CRDs

The operator can optionally bootstrap CRDs on start up with `--crds=true`.

This is not generally recommended; it requires granting CRD create permission to the operator.

## Static SpiceDBClusters

The operator can optionally take in a set of "static" SpiceDBClusters that it will create on startup, via `--bootstrap-spicedbs`.
This argument is expected to be a file with a yaml list of SpiceDBCluster objects.

This is not generally recommended; it is primarily for CD of the operator itself.

## Debug, Logs, Health, and Metrics

The operator serves a debug endpoint, health, and metrics from the same address, defined by `--debug-addr` (`:8080` by default):

- `/metrics` serves a prometheus metric endpoint, which includes controller queue depths and stats about abnormal SpiceDBClusters.
- `/debug/pprof/` for profiling data
- `/healthz` for health

Log level can be configured with `--v` and accepts standard klog flags.
