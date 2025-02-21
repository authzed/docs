## spicedb serve-testing

test server with an in-memory datastore

### Synopsis

An in-memory spicedb server which serves completely isolated datastores per client-supplied auth token used.

```
spicedb serve-testing [flags]
```

### Options

```
      --grpc-addr string                                         address to listen on to serve gRPC (default ":50051")
      --grpc-enabled                                             enable gRPC gRPC server (default true)
      --grpc-max-conn-age duration                               how long a connection serving gRPC should be able to live (default 30s)
      --grpc-max-workers uint32                                  set the number of workers for this server (0 value means 1 worker per request)
      --grpc-network string                                      network type to serve gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
      --grpc-tls-cert-path string                                local path to the TLS certificate used to serve gRPC
      --grpc-tls-key-path string                                 local path to the TLS key used to serve gRPC
  -h, --help                                                     help for serve-testing
      --http-addr string                                         address to listen on to serve http (default ":8443")
      --http-enabled                                             enable http http server
      --http-tls-cert-path string                                local path to the TLS certificate used to serve http
      --http-tls-key-path string                                 local path to the TLS key used to serve http
      --load-configs strings                                     configuration yaml files to load
      --max-bulk-export-relationships-limit uint32               maximum number of relationships that can be exported in a single request (default 10000)
      --max-caveat-context-size int                              maximum allowed size of request caveat context in bytes. A value of zero or less means no limit (default 4096)
      --max-delete-relationships-limit uint32                    maximum number of relationships that can be deleted in a single request (default 1000)
      --max-lookup-resources-limit uint32                        maximum number of resources that can be looked up in a single request (default 1000)
      --max-read-relationships-limit uint32                      maximum number of relationships that can be read in a single request (default 1000)
      --max-relationship-context-size int                        maximum allowed size of the context to be stored in a relationship (default 25000)
      --otel-endpoint string                                     OpenTelemetry collector endpoint - the endpoint can also be set by using enviroment variables
      --otel-insecure                                            connect to the OpenTelemetry collector in plaintext
      --otel-provider string                                     OpenTelemetry provider for tracing ("none", "otlphttp", "otlpgrpc") (default "none")
      --otel-sample-ratio float                                  ratio of traces that are sampled (default 0.01)
      --otel-service-name string                                 service name for trace data (default "spicedb")
      --otel-trace-propagator string                             OpenTelemetry trace propagation format ("b3", "w3c", "ottrace"). Add multiple propagators separated by comma. (default "w3c")
      --pprof-block-profile-rate int                             sets the block profile sampling rate
      --pprof-mutex-profile-rate int                             sets the mutex profile sampling rate
      --readonly-grpc-addr string                                address to listen on to serve read-only gRPC (default ":50052")
      --readonly-grpc-enabled                                    enable read-only gRPC gRPC server (default true)
      --readonly-grpc-max-conn-age duration                      how long a connection serving read-only gRPC should be able to live (default 30s)
      --readonly-grpc-max-workers uint32                         set the number of workers for this server (0 value means 1 worker per request)
      --readonly-grpc-network string                             network type to serve read-only gRPC ("tcp", "tcp4", "tcp6", "unix", "unixpacket") (default "tcp")
      --readonly-grpc-tls-cert-path string                       local path to the TLS certificate used to serve read-only gRPC
      --readonly-grpc-tls-key-path string                        local path to the TLS key used to serve read-only gRPC
      --readonly-http-addr string                                address to listen on to serve read-only HTTP (default ":8444")
      --readonly-http-enabled                                    enable http read-only HTTP server
      --readonly-http-tls-cert-path string                       local path to the TLS certificate used to serve read-only HTTP
      --readonly-http-tls-key-path string                        local path to the TLS key used to serve read-only HTTP
      --termination-log-path string                              define the path to the termination log file, which contains a JSON payload to surface as reason for termination - disabled by default
      --update-relationships-max-preconditions-per-call uint16   maximum number of preconditions allowed for WriteRelationships and DeleteRelationships calls (default 1000)
      --write-relationships-max-updates-per-call uint16          maximum number of updates allowed for WriteRelationships calls (default 1000)
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
