## spicedb serve

serve the permissions database

### Synopsis

A database that stores, computes, and validates application permissions

```
spicedb serve [flags]
```

### Examples

```
	No TLS and in-memory:
		spicedb serve --grpc-preshared-key "somerandomkeyhere"

	TLS and a real datastore:
		spicedb serve --grpc-preshared-key "realkeyhere" --grpc-tls-cert-path path/to/tls/cert --grpc-tls-key-path path/to/tls/key \
			--http-tls-cert-path path/to/tls/cert --http-tls-key-path path/to/tls/key \
			--datastore-engine postgres --datastore-conn-uri "postgres-connection-string-here"

```

### Options

```
      --datastore-allowed-migrations stringArray                         migration levels that will not fail the health check (in addition to the current head migration)
      --datastore-bootstrap-files strings                                bootstrap data yaml files to load
      --datastore-bootstrap-overwrite                                    overwrite any existing data with bootstrap data (this can be quite slow)
      --datastore-bootstrap-timeout duration                             maximum duration before timeout for the bootstrap data to be written (default 10s)
      --datastore-conn-max-lifetime-jitter duration                      waits rand(0, jitter) after a connection is open for max lifetime to actually close the connection (default: 20% of max lifetime)
      --datastore-conn-pool-read-healthcheck-interval duration           amount of time between connection health checks in a remote datastore's connection pool (default 30s)
      --datastore-conn-pool-read-max-idletime duration                   maximum amount of time a connection can idle in a remote datastore's connection pool (default 30m0s)
      --datastore-conn-pool-read-max-lifetime duration                   maximum amount of time a connection can live in a remote datastore's connection pool (default 30m0s)
      --datastore-conn-pool-read-max-lifetime-jitter duration            waits rand(0, jitter) after a connection is open for max lifetime to actually close the connection (default: 20% of max lifetime)
      --datastore-conn-pool-read-max-open int                            number of concurrent connections open in a remote datastore's connection pool (default 20)
      --datastore-conn-pool-read-min-open int                            number of minimum concurrent connections open in a remote datastore's connection pool (default 20)
      --datastore-conn-pool-write-healthcheck-interval duration          amount of time between connection health checks in a remote datastore's connection pool (default 30s)
      --datastore-conn-pool-write-max-idletime duration                  maximum amount of time a connection can idle in a remote datastore's connection pool (default 30m0s)
      --datastore-conn-pool-write-max-lifetime duration                  maximum amount of time a connection can live in a remote datastore's connection pool (default 30m0s)
      --datastore-conn-pool-write-max-lifetime-jitter duration           waits rand(0, jitter) after a connection is open for max lifetime to actually close the connection (default: 20% of max lifetime)
      --datastore-conn-pool-write-max-open int                           number of concurrent connections open in a remote datastore's connection pool (default 10)
      --datastore-conn-pool-write-min-open int                           number of minimum concurrent connections open in a remote datastore's connection pool (default 10)
      --datastore-conn-uri string                                        connection string used by remote datastores (e.g. "postgres://postgres:password@localhost:5432/spicedb")
      --datastore-connect-rate duration                                  rate at which new connections are allowed to the datastore (at a rate of 1/duration) (cockroach driver only) (default 100ms)
      --datastore-connection-balancing                                   enable connection balancing between database nodes (cockroach driver only) (default true)
      --datastore-credentials-provider-name string                       retrieve datastore credentials dynamically using ("aws-iam")
      --datastore-engine string                                          type of datastore to initialize ("cockroachdb", "mysql", "postgres", "spanner") (default "memory")
      --datastore-experimental-column-optimization                       enable experimental column optimization
      --datastore-follower-read-delay-duration duration                  amount of time to subtract from non-sync revision timestamps to ensure they are sufficiently in the past to enable follower reads (cockroach driver only) (default 4.8s)
      --datastore-gc-interval duration                                   amount of time between passes of garbage collection (postgres driver only) (default 3m0s)
      --datastore-gc-max-operation-time duration                         maximum amount of time a garbage collection pass can operate before timing out (postgres driver only) (default 1m0s)
      --datastore-gc-window duration                                     amount of time before revisions are garbage collected (default 24h0m0s)
      --datastore-include-query-parameters-in-traces                     include query parameters in traces (postgres and CRDB drivers only)
      --datastore-max-tx-retries int                                     number of times a retriable transaction should be retried (default 10)
      --datastore-migration-phase string                                 datastore-specific flag that should be used to signal to a datastore which phase of a multi-step migration it is in
      --datastore-mysql-table-prefix string                              prefix to add to the name of all SpiceDB database tables
      --datastore-prometheus-metrics                                     set to false to disabled prometheus metrics from the datastore (default true)
      --datastore-read-replica-conn-pool-healthcheck-interval duration   amount of time between connection health checks in a remote datastore's connection pool (default 30s)
      --datastore-read-replica-conn-pool-max-idletime duration           maximum amount of time a connection can idle in a remote datastore's connection pool (default 30m0s)
      --datastore-read-replica-conn-pool-max-lifetime duration           maximum amount of time a connection can live in a remote datastore's connection pool (default 30m0s)
      --datastore-read-replica-conn-pool-max-lifetime-jitter duration    waits rand(0, jitter) after a connection is open for max lifetime to actually close the connection (default: 20% of max lifetime)
      --datastore-read-replica-conn-pool-max-open int                    number of concurrent connections open in a remote datastore's connection pool (default 20)
      --datastore-read-replica-conn-pool-min-open int                    number of minimum concurrent connections open in a remote datastore's connection pool (default 20)
      --datastore-read-replica-conn-uri stringArray                      connection string used by remote datastores for read replicas (e.g. "postgres://postgres:password@localhost:5432/spicedb"). Only supported for postgres and mysql.
      --datastore-read-replica-credentials-provider-name string          retrieve datastore credentials dynamically using ("aws-iam")
      --datastore-readonly                                               set the service to read-only mode
      --datastore-relationship-integrity-current-key-filename string     current key filename for relationship integrity checks
      --datastore-relationship-integrity-current-key-id string           current key id for relationship integrity checks
      --datastore-relationship-integrity-enabled                         enables relationship integrity checks. only supported on CRDB
      --datastore-relationship-integrity-expired-keys stringArray        config for expired keys for relationship integrity checks
      --datastore-request-hedging                                        enable request hedging
      --datastore-request-hedging-initial-slow-value duration            initial value to use for slow datastore requests, before statistics have been collected (default 10ms)
      --datastore-request-hedging-max-requests uint                      maximum number of historical requests to consider (default 1000000)
      --datastore-request-hedging-quantile float                         quantile of historical datastore request time over which a request will be considered slow (default 0.95)
      --datastore-revision-quantization-interval duration                boundary interval to which to round the quantized revision (default 5s)
      --datastore-revision-quantization-max-staleness-percent float      float percentage (where 1 = 100%) of the revision quantization interval where we may opt to select a stale revision for performance reasons. Defaults to 0.1 (representing 10%) (default 0.1)
      --datastore-schema-watch-heartbeat duration                        heartbeat time on the schema watch in the datastore (if supported). 0 means to default to the datastore's minimum. (default 1s)
      --datastore-spanner-credentials string                             path to service account key credentials file with access to the cloud spanner instance (omit to use application default credentials)
      --datastore-spanner-emulator-host string                           URI of spanner emulator instance used for development and testing (e.g. localhost:9010)
      --datastore-spanner-max-sessions uint                              maximum number of sessions across all Spanner gRPC connections the client can have at a given time (default 400)
      --datastore-spanner-min-sessions uint                              minimum number of sessions across all Spanner gRPC connections the client can have at a given time (default 100)
      --datastore-tx-overlap-key string                                  static key to touch when writing to ensure transactions overlap (only used if --datastore-tx-overlap-strategy=static is set; cockroach driver only) (default "key")
      --datastore-tx-overlap-strategy string                             strategy to generate transaction overlap keys ("request", "prefix", "static", "insecure") (cockroach driver only - see https://spicedb.dev/d/crdb-overlap for details)" (default "static")
      --datastore-watch-buffer-length uint16                             how large the watch buffer should be before blocking (default 1024)
      --datastore-watch-buffer-write-timeout duration                    how long the watch buffer should queue before forcefully disconnecting the reader (default 1s)
      --datastore-watch-connect-timeout duration                         how long the watch connection should wait before timing out (cockroachdb driver only) (default 1s)
      --disable-version-response                                         disables version response support in the API
      --dispatch-cache-enabled                                           enable caching (default true)
      --dispatch-cache-max-cost string                                   upper bound cache size in bytes or percent of available memory (default "30%")
      --dispatch-cache-metrics                                           enable cache metrics (default true)
      --dispatch-cache-num-counters int                                  number of TinyLFU samples to track (default 10000)
      --dispatch-check-permission-concurrency-limit uint16               maximum number of parallel goroutines to create for each check request or subrequest. defaults to --dispatch-concurrency-limit
      --dispatch-chunk-size uint16                                       maximum number of object IDs in a dispatched request (default 100)
      --dispatch-cluster-addr string                                     address to listen on to serve dispatch (default ":50053")
      --dispatch-cluster-cache-enabled                                   enable caching (default true)
      --dispatch-cluster-cache-max-cost string                           upper bound cache size in bytes or percent of available memory (default "70%")
      --dispatch-cluster-cache-metrics                                   enable cache metrics (default true)
      --dispatch-cluster-cache-num-counters int                          number of TinyLFU samples to track (default 100000)
      --dispatch-cluster-enabled                                         enable dispatch gRPC server
      --dispatch-cluster-max-conn-age duration                           how long a connection serving dispatch should be able to live (default 30s)
      --dispatch-cluster-max-workers uint32                              set the number of workers for this server (0 value means 1 worker per request)
      --dispatch-cluster-network string                                  network type to serve dispatch ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
      --dispatch-cluster-tls-cert-path string                            local path to the TLS certificate used to serve dispatch
      --dispatch-cluster-tls-key-path string                             local path to the TLS key used to serve dispatch
      --dispatch-concurrency-limit uint16                                maximum number of parallel goroutines to create for each request or subrequest (default 50)
      --dispatch-hashring-replication-factor uint16                      set the replication factor of the consistent hasher used for the dispatcher (default 100)
      --dispatch-hashring-spread uint8                                   set the spread of the consistent hasher used for the dispatcher (default 1)
      --dispatch-lookup-resources-concurrency-limit uint16               maximum number of parallel goroutines to create for each lookup resources request or subrequest. defaults to --dispatch-concurrency-limit
      --dispatch-lookup-subjects-concurrency-limit uint16                maximum number of parallel goroutines to create for each lookup subjects request or subrequest. defaults to --dispatch-concurrency-limit
      --dispatch-max-depth uint32                                        maximum recursion depth for nested calls (default 50)
      --dispatch-reachable-resources-concurrency-limit uint16            maximum number of parallel goroutines to create for each reachable resources request or subrequest. defaults to --dispatch-concurrency-limit
      --dispatch-upstream-addr string                                    upstream grpc address to dispatch to
      --dispatch-upstream-ca-path string                                 local path to the TLS CA used when connecting to the dispatch cluster
      --dispatch-upstream-timeout duration                               maximum duration of a dispatch call an upstream cluster before it times out (default 1m0s)
      --enable-experimental-relationship-expiration                      enables experimental support for first-class relationship expiration
      --enable-experimental-watchable-schema-cache                       enables the experimental schema cache which makes use of the Watch API for automatic updates
      --experimental-dispatch-secondary-upstream-addrs stringToString    secondary upstream addresses for dispatches, each with a name (default [])
      --experimental-dispatch-secondary-upstream-exprs check             map from request type (currently supported: check) to its associated CEL expression, which returns the secondary upstream(s) to be used for the request (default [])
      --grpc-addr string                                                 address to listen on to serve gRPC (default ":50051")
      --grpc-enabled                                                     enable gRPC gRPC server (default true)
      --grpc-log-requests-enabled                                        logs API request payloads
      --grpc-log-responses-enabled                                       logs API response payloads
      --grpc-max-conn-age duration                                       how long a connection serving gRPC should be able to live (default 30s)
      --grpc-max-workers uint32                                          set the number of workers for this server (0 value means 1 worker per request)
      --grpc-network string                                              network type to serve gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
      --grpc-preshared-key strings                                       preshared key(s) to require for authenticated requests
      --grpc-shutdown-grace-period duration                              amount of time after receiving sigint to continue serving
      --grpc-tls-cert-path string                                        local path to the TLS certificate used to serve gRPC
      --grpc-tls-key-path string                                         local path to the TLS key used to serve gRPC
  -h, --help                                                             help for serve
      --http-addr string                                                 address to listen on to serve gateway (default ":8443")
      --http-enabled                                                     enable http gateway server
      --http-tls-cert-path string                                        local path to the TLS certificate used to serve gateway
      --http-tls-key-path string                                         local path to the TLS key used to serve gateway
      --max-bulk-export-relationships-limit uint32                       maximum number of relationships that can be exported in a single request (default 10000)
      --max-caveat-context-size int                                      maximum allowed size of request caveat context in bytes. A value of zero or less means no limit (default 4096)
      --max-datastore-read-page-size uint                                limit on the maximum page size that we will load into memory from the datastore at one time (default 1000)
      --max-delete-relationships-limit uint32                            maximum number of relationships that can be deleted in a single request (default 1000)
      --max-lookup-resources-limit uint32                                maximum number of resources that can be looked up in a single request (default 1000)
      --max-read-relationships-limit uint32                              maximum number of relationships that can be read in a single request (default 1000)
      --max-relationship-context-size int                                maximum allowed size of the context to be stored in a relationship (default 25000)
      --metrics-addr string                                              address to listen on to serve metrics (default ":9090")
      --metrics-enabled                                                  enable http metrics server (default true)
      --metrics-tls-cert-path string                                     local path to the TLS certificate used to serve metrics
      --metrics-tls-key-path string                                      local path to the TLS key used to serve metrics
      --ns-cache-enabled                                                 enable caching (default true)
      --ns-cache-max-cost string                                         upper bound cache size in bytes or percent of available memory (default "32MiB")
      --ns-cache-metrics                                                 enable cache metrics (default true)
      --ns-cache-num-counters int                                        number of TinyLFU samples to track (default 1000)
      --otel-endpoint string                                             OpenTelemetry collector endpoint - the endpoint can also be set by using enviroment variables
      --otel-insecure                                                    connect to the OpenTelemetry collector in plaintext
      --otel-provider string                                             OpenTelemetry provider for tracing ("none", "otlphttp", "otlpgrpc") (default "none")
      --otel-sample-ratio float                                          ratio of traces that are sampled (default 0.01)
      --otel-service-name string                                         service name for trace data (default "spicedb")
      --otel-trace-propagator string                                     OpenTelemetry trace propagation format ("b3", "w3c", "ottrace"). Add multiple propagators separated by comma. (default "w3c")
      --pprof-block-profile-rate int                                     sets the block profile sampling rate
      --pprof-mutex-profile-rate int                                     sets the mutex profile sampling rate
      --schema-prefixes-required                                         require prefixes on all object definitions in schemas
      --streaming-api-response-delay-timeout duration                    max duration time elapsed between messages sent by the server-side to the client (responses) before the stream times out (default 30s)
      --telemetry-ca-override-path string                                path to a custom CA to use with the telemetry endpoint
      --telemetry-endpoint string                                        endpoint to which telemetry is reported, empty string to disable (default "https://telemetry.authzed.com")
      --telemetry-interval duration                                      approximate period between telemetry reports, minimum 1 minute (default 1h0m0s)
      --termination-log-path string                                      define the path to the termination log file, which contains a JSON payload to surface as reason for termination - disabled by default
      --update-relationships-max-preconditions-per-call uint16           maximum number of preconditions allowed for WriteRelationships and DeleteRelationships calls (default 1000)
      --watch-api-heartbeat duration                                     heartbeat time on the watch in the API. 0 means to default to the datastore's minimum. (default 1s)
      --write-relationships-max-updates-per-call uint16                  maximum number of updates allowed for WriteRelationships calls (default 1000)
```

### Options inherited from parent commands

```
      --log-format string    format of logs ("auto", "console", "json") (default "auto")
      --log-level string     verbosity of logging ("trace", "debug", "info", "warn", "error") (default "info")
      --skip-release-check   if true, skips checking for new SpiceDB releases
```

### SEE ALSO

* [spicedb](spicedb.md)	 - A modern permissions database

###### Auto generated by spf13/cobra on 20-Jan-2025
