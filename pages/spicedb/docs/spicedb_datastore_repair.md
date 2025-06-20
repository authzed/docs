## spicedb datastore repair

executes datastore repair

### Synopsis

Executes a repair operation for the datastore

```
spicedb datastore repair [flags]
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
      --datastore-spanner-credentials string                             path to service account key credentials file with access to the cloud spanner instance (omit to use application default credentials)
      --datastore-spanner-emulator-host string                           URI of spanner emulator instance used for development and testing (e.g. localhost:9010)
      --datastore-spanner-max-sessions uint                              maximum number of sessions across all Spanner gRPC connections the client can have at a given time (default 400)
      --datastore-spanner-min-sessions uint                              minimum number of sessions across all Spanner gRPC connections the client can have at a given time (default 100)
      --datastore-tx-overlap-key string                                  static key to touch when writing to ensure transactions overlap (only used if --datastore-tx-overlap-strategy=static is set; cockroach driver only) (default "key")
      --datastore-tx-overlap-strategy string                             strategy to generate transaction overlap keys ("request", "prefix", "static", "insecure") (cockroach driver only - see https://spicedb.dev/d/crdb-overlap for details)" (default "static")
      --datastore-watch-buffer-length uint16                             how large the watch buffer should be before blocking (default 1024)
      --datastore-watch-buffer-write-timeout duration                    how long the watch buffer should queue before forcefully disconnecting the reader (default 1s)
      --datastore-watch-connect-timeout duration                         how long the watch connection should wait before timing out (cockroachdb driver only) (default 1s)
  -h, --help                                                             help for repair
      --otel-endpoint string                                             OpenTelemetry collector endpoint - the endpoint can also be set by using enviroment variables
      --otel-insecure                                                    connect to the OpenTelemetry collector in plaintext
      --otel-provider string                                             OpenTelemetry provider for tracing ("none", "otlphttp", "otlpgrpc") (default "none")
      --otel-sample-ratio float                                          ratio of traces that are sampled (default 0.01)
      --otel-service-name string                                         service name for trace data (default "spicedb")
      --otel-trace-propagator string                                     OpenTelemetry trace propagation format ("b3", "w3c", "ottrace"). Add multiple propagators separated by comma. (default "w3c")
      --pprof-block-profile-rate int                                     sets the block profile sampling rate
      --pprof-mutex-profile-rate int                                     sets the mutex profile sampling rate
      --termination-log-path string                                      define the path to the termination log file, which contains a JSON payload to surface as reason for termination - disabled by default
```

### Options inherited from parent commands

```
      --log-format string    format of logs ("auto", "console", "json") (default "auto")
      --log-level string     verbosity of logging ("trace", "debug", "info", "warn", "error") (default "info")
      --skip-release-check   if true, skips checking for new SpiceDB releases
```

### SEE ALSO

* [spicedb datastore](spicedb_datastore.md)	 - datastore operations

###### Auto generated by spf13/cobra on 20-Jan-2025
