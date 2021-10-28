# API Clients

## Library

### Official

The Authzed team officially supports and maintains client libraries for a variety of languages.
Officially maintained client libraries can be found on the [authzed GitHub organization][authzed-github].

Official clients typically leverage their language's gRPC libraries to provide a client abstraction for each version of the API.
For example, in Go, [constructing a client] is no different from creating any other gRPC connection and can use any [gRPC DialOption] to configure advanced functionality such as proxying, retries, and more.

[authzed-github]: https://github.com/orgs/authzed/repositories?q=client+library
[constructing a client]: https://github.com/authzed/authzed-go#initializing-a-client
[gRPC DialOption]: https://pkg.go.dev/google.golang.org/grpc#DialOption

### Third Party

Any developer can generate their own clients from the published [Protobuf Definitions].
Regardless of language, we recommend using the [buf toolchain] to manage the generation workflow.

We recommend GitHub users to tag their repositories with [`authzed-client`][az-tagsearch] and [`spicedb-client`][sdb-tagsearch] to help withdiscovery.

If you are interested in additional language or building your own, feel free to jump into [Discord] to share and collaborate with other developers.

[Protobuf Definitions]: https://buf.build/authzed/api
[buf toolchain]: https://docs.buf.build
[az-tagsearch]: https://github.com/topics/authzed-client
[sdb-tagsearch]: https://github.com/topics/spicedb-client
[Discord]: https://authzed.com/discord

## Command Line

### zed

[zed] is the official command-line tool for managing Authzed and SpiceDB.

Once configured with credentials, zed usage looks like: 

```
$ zed schema read
definition user {}

definition document {
    relation writer: user
    relation reader: user

    permission edit = writer
    permission view = reader + edit
}

$ zed permission check document:firstdoc writer user:emilia
false

$ zed relationship create document:firstdoc writer user:emilia
CAESAggB

$ zed permission check document:firstdoc writer user:emilia
true
```

[zed]: https://github.com/authzed/zed

### grpcurl

[grpcurl] is a generic gRPC client that should feel familiar to users of curl.
It uses JSON representations of Protocol Buffers to specify messages.

We recommend this client over [grpc_cli](#grpc_cli) for generic gRPC interactions.

Example usage:

```
$ noglob grpcurl -rpc-header "authorization: Bearer myapikey" -d '{"schema": "definition user {}"}' grpc.authzed.com:50051 "authzed.api.v1.SchemaService/WriteSchema"
```

[grpcurl]: https://github.com/fullstorydev/grpcurl

### grpc_cli

[grpc_cli] is the official generic gRPC client and is sometimes installed with gRPC itself.
Despite that, it is relatively immature and not deemed stable by the gRPC team.

Because of this and the user experience being worse than [grpcurl](#grpcurl), we do not recommend it.

[grpc_cli]: https://github.com/grpc/grpc/blob/master/doc/command_line_tool.md

### curl

Users running [SpiceDB] with HTTP enabled, are able to use [curl] with a [JSON API][openapi].

Example usage:

```
curl -H "Authorization: Bearer myapikey" -X POST localhost:443/v1/schema/read
```

[SpiceDB]: https://github.com/authzed/spicedb
[curl]: https://curl.se
[openapi]: https://petstore.swagger.io/?url=https://raw.githubusercontent.com/authzed/authzed-go/main/proto/apidocs.swagger.json
