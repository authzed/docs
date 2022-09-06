# Installing SpiceDB Operator

## Create a Kubernetes Cluster

The installation guide assumes you already have a kubernetes cluster available.

If you want to run the operator locally, we recommend one of:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kind](https://kind.sigs.k8s.io)
- [minikube](https://minikube.sigs.k8s.io)

## Install the Operator with `kubectl`

Confirm you are connected to the correct cluster with `kubectl config current-context`, and then:

```sh
kubectl apply --server-side -k github.com/authzed/spicedb-operator/config
```

After a succesful rollout, you will see the spicedb-operator pod running in the `spicedb-operator` namespace.

```sh
kubectl -n spicedb-operator get pods
```

## Create a `SpiceDBCluster`

:::warning
The commands documented here do not configure best practices for production deployments.
For example, TLS is disabled and data is not persisted when SpiceDB is shut down.
See the guide for [selecting a datastore].
:::

[selecting a datastore]: /spicedb/selecting-a-datastore

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

## Connect and Verify

A variety of [clients/tools] can be used to interact with the API.

[zed] is the official CLI client and can be used to check that SpiceDB is running, write schema and relationships, and perform other operations against SpiceDB:

[clients/tools]: /reference/clients
[zed]: https://github.com/authzed/zed

### Running via brew

[zed] is available via brew on macOS and Linux.

```sh
brew install zed
```

```sh
zed context set local localhost:50051 "somerandomkeyhere" --insecure
zed schema read --insecure
```

## Next Steps

Continue with the [Protecting Your First App] guide to learn how to use SpiceDB to protect your application.

Learn how to [configure] SpiceDB with the operator and how to [update managed clusters].

[Protecting Your First App]: /guides/first-app
[configure]: /operator/configuration
[update managed clusters]: /operator/updating
