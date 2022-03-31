# SpiceDB Commands

## spicedb serve

Serves the permissions database API.

### Examples

No TLS and in-memory:

```
spicedb serve --grpc-preshared-key "somerandomkeyhere"
```

TLS and a real datastore:

```
spicedb serve \
    --grpc-preshared-key "realkeyhere" \
    --grpc-tls-cert-path path/to/tls/cert \
    --grpc-tls-key-path path/to/tls/key \
    --http-tls-cert-path path/to/tls/cert \
    --http-tls-key-path path/to/tls/key \
    --datastore-engine postgres \
    --datastore-conn-uri "postgres-connection-string-here"
```

### Flags

#### Dashboard

```
--dashboard-addr string                 address to listen on to serve dashboard (default ":8080")
--dashboard-enabled                     enable dashboard http server (default true)
--dashboard-tls-cert-path string        local path to the TLS certificate used to serve dashboard
--dashboard-tls-key-path string         local path to the TLS key used to serve dashboard
```

#### Datastore

```
--datastore-bootstrap-files strings                       bootstrap data yaml files to load
--datastore-bootstrap-overwrite                           overwrite any existing data with bootstrap data
--datastore-conn-healthcheck-interval duration            time between a remote datastore's connection pool health checks (default 30s)
--datastore-conn-max-idletime duration                    maximum amount of time a connection can idle in a remote datastore's connection pool (default 30m0s)
--datastore-conn-max-lifetime duration                    maximum amount of time a connection can live in a remote datastore's connection pool (default 30m0s)
--datastore-conn-max-open int                             number of concurrent connections open in a remote datastore's connection pool (default 20)
--datastore-conn-min-open int                             number of minimum concurrent connections open in a remote datastore's connection pool (default 10)
--datastore-conn-uri string                               connection string used by remote datastores (e.g. "postgres://postgres:password@localhost:5432/spicedb")
--datastore-engine string                                 type of datastore to initialize ("memory", "postgres", "cockroachdb") (default "memory")
--datastore-follower-read-delay-duration duration         amount of time to subtract from non-sync revision timestamps to ensure they are sufficiently in the past to enable follower reads (cockroach driver only) (default 4.8s)
--datastore-gc-interval duration                          amount of time between passes of garbage collection (postgres driver only) (default 3m0s)
--datastore-gc-max-operation-time duration                maximum amount of time a garbage collection pass can operate before timing out (postgres driver only) (default 1m0s)
--datastore-gc-window duration                            amount of time before revisions are garbage collected (default 24h0m0s)
--datastore-max-tx-retries int                            number of times a retriable transaction should be retried (cockroach driver only) (default 50)
--datastore-query-split-size string                       estimated number of bytes at which a query is split when using a remote datastore (default "8MiB")
--datastore-readonly                                      set the service to read-only mode
--datastore-request-hedging                               enable request hedging (default true)
--datastore-request-hedging-initial-slow-value duration   initial value to use for slow datastore requests, before statistics have been collected (default 10ms)
--datastore-request-hedging-max-requests uint             maximum number of historical requests to consider (default 1000000)
--datastore-request-hedging-quantile float                quantile of historical datastore request time over which a request will be considered slow (default 0.95)
--datastore-revision-fuzzing-duration duration            amount of time to advertize stale revisions (default 5s)
--datastore-tx-overlap-key string                         static key to touch when writing to ensure transactions overlap (only used if --datastore-tx-overlap-strategy=static is set; cockroach driver only) (default "key")
--datastore-tx-overlap-strategy string                    strategy to generate transaction overlap keys ("prefix", "static", "insecure") (cockroach driver only) (default "static")
```

#### Dispatch

```
--dispatch-cluster-addr string                  address to listen on to serve dispatch (default ":50053")
--dispatch-cluster-enabled                      enable dispatch gRPC server
--dispatch-cluster-max-conn-age duration        how long a connection serving dispatch should be able to live (default 30s)
--dispatch-cluster-network string               network type to serve dispatch ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
--dispatch-cluster-tls-cert-path string         local path to the TLS certificate used to serve dispatch
--dispatch-cluster-tls-key-path string          local path to the TLS key used to serve dispatch
--dispatch-max-depth uint32                     maximum recursion depth for nested calls (default 50)
--dispatch-upstream-addr string                 upstream grpc address to dispatch to
--dispatch-upstream-ca-path string              local path to the TLS CA used when connecting to the dispatch cluster
```

#### gRPC

The recommended and most supported wap of calling the [SpiceDB API] is via **gRPC**.

[SpiceDB API]: https://buf.build/authzed/api/docs/main/authzed.api.v1

```
--grpc-addr string                        address to listen on to serve gRPC (default ":50051")
--grpc-enabled                            enable gRPC gRPC server (default true)
--grpc-max-conn-age duration              how long a connection serving gRPC should be able to live (default 30s)
--grpc-network string                     network type to serve gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
--grpc-preshared-key string               preshared key to require for authenticated requests
--grpc-shutdown-grace-period duration     amount of time after receiving sigint to continue serving
--grpc-tls-cert-path string               local path to the TLS certificate used to serve gRPC
--grpc-tls-key-path string                local path to the TLS key used to serve gRPC
```

#### HTTP Rest API

SpiceDB provides a REST gateway that exposes a [REST API] for making calls over HTTP.

[REST API]: https://app.swaggerhub.com/apis-docs/authzed/authzed/1.0

```
--http-addr string                      address to listen on to serve http (default ":8443")
--http-enabled                          enable http http server
--http-tls-cert-path string             local path to the TLS certificate used to serve http
--http-tls-key-path string              local path to the TLS key used to serve http
```

:::note
[Read more] about the REST API and get access to a Postman collection for the API.
:::

[Read more]: https://authzed.com/blog/authzed-http-api/

#### Metrics

```
--metrics-addr string                    address to listen on to serve metrics (default ":9090")
--metrics-enabled                        enable metrics http server (default true)
--metrics-tls-cert-path string           local path to the TLS certificate used to serve metrics
--metrics-tls-key-path string            local path to the TLS key used to serve metrics
```

#### Misc

```
--disable-v1-schema-api               disables the V1 schema API
--ns-cache-expiration duration        amount of time a namespace entry should remain cached (default 1m0s)
--schema-prefixes-required            require prefixes on all object definitions in schemas
```

## spicedb serve-testing

Serves the integration testing entrypoint.

### Flags

#### gRPC

```
--grpc-addr string              address to listen on to serve gRPC (default ":50051")
--grpc-enabled                  enable gRPC gRPC server (default true)
--grpc-max-conn-age duration    how long a connection serving gRPC should be able to live (default 30s)
--grpc-network string           network type to serve gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
--grpc-tls-cert-path string     local path to the TLS certificate used to serve gRPC
--grpc-tls-key-path string      local path to the TLS key used to serve gRPC
```

#### Bootstrapping

```
--load-configs strings          configuration yaml files to load
```

#### Readonly mode

```
--readonly-grpc-addr string             address to listen on to serve read-only gRPC (default ":50052")
--readonly-grpc-enabled                 enable read-only gRPC gRPC server (default true)
--readonly-grpc-max-conn-age duration   how long a connection serving read-only gRPC should be able to live (default 30s)
--readonly-grpc-network string          network type to serve read-only gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
--readonly-grpc-tls-cert-path string    local path to the TLS certificate used to serve read-only gRPC
--readonly-grpc-tls-key-path string     local path to the TLS key used to serve read-only gRPC
```

## spicedb serve-devtools

Runs the developer tools service.

### Flags

#### gRPC

```
--grpc-addr string               address to listen on to serve gRPC (default ":50051")
--grpc-enabled                   enable gRPC gRPC server (default true)
--grpc-max-conn-age duration     how long a connection serving gRPC should be able to live (default 30s)
--grpc-network string            network type to serve gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
--grpc-tls-cert-path string      local path to the TLS certificate used to serve gRPC
--grpc-tls-key-path string       local path to the TLS key used to serve gRPC
```

#### HTTP

```
--http-addr string               address to listen on to serve download (default ":8443")
--http-enabled                   enable download http server
--http-tls-cert-path string      local path to the TLS certificate used to serve download
--http-tls-key-path string       local path to the TLS key used to serve download
```

#### Metrics

```
--metrics-addr string            address to listen on to serve metrics (default ":9090")
--metrics-enabled                enable metrics http server (default true)
--metrics-tls-cert-path string   local path to the TLS certificate used to serve metrics
--metrics-tls-key-path string    local path to the TLS key used to serve metrics
```

#### Share storage

```
--s3-access-key string           s3 access key for s3 share store
--s3-bucket string               s3 bucket name for s3 share store
--s3-endpoint string             s3 endpoint for s3 share store
--s3-region string               s3 region for s3 share store (default "auto")
--s3-secret-key string           s3 secret key for s3 share store
--share-store string             kind of share store to use (default "inmemory")
--share-store-salt string        salt for share store hashing
```
