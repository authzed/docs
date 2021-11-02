# Protecting Your First App

import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

## Introduction

This guide walks through the steps required to deeply integrate an application with SpiceDB.
Not all software requires this level of integration, but it is preferable for greenfield applications or applications that are central in an architecture with multiple services.

Instead of introducing an unfamiliar example app and altering various locations in its code, this guide is written such that each step is a standalone snippet of code that demonstrates an integration point and finding where those points exist in your codebase is an exercise left to the reader.

## Prerequisites

- An [Authzed] permission system **OR** a running instance of [SpiceDB][SpiceDB]
- An [API Token] with `admin` access **OR** the configured preshared key for SpiceDB

[Authzed]: https://app.authzed.com
[API Token]: /reference/api#authentication
[SpiceDB]: https://github.com/authzed/spicedb

:::warning
Throughout this guide various substitutions must be made in the provided code snippets:

- Authzed users must replace the `blog` prefix throughout this guide with their own permission system's slug
- SpiceDB users must replace `grpc.authzed.com:443` with their own SpiceDB endpoint
- All users must replace `t_your_token_here_1234567deadbeef` with their API token or preshared key
:::

## Installation

The first step to integrating any software is ensuring you have an [API client].

[API client]: reference/clients.md

Each tool is installed with its ecosystem's package management tools:

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
brew install authzed/tap/zed
zed context set blog grpc.authzed.com:443 t_your_token_here_1234567deadbeef
```

  </TabItem>
  <TabItem value="go">

```sh
go get github.com/authzed/authzed-go
```

  </TabItem>
  <TabItem value="python">

```sh
pip install authzed
```

  </TabItem>
  <TabItem value="java">

```java
// build.gradle
dependencies {
  implementation "com.authzed.api:authzed:0.0.1"
}
```

  </TabItem>
  <TabItem value="ruby">

```sh
gem install authzed
```

  </TabItem>
</Tabs>

## Defining and Applying a Schema

Regardless of whether or not you have a preexisting schema written to your permission system, integrating a new application will typically require you add new definitions to the [Schema].
As a quick recap, Schemas define the objects, their relations, and their checkable permissions that will be available to be used with the permission system.

[Schema]: /guides/schema.md

We'll be using the following blog example throughout this guide:

```zed
definition blog/user {}

definition blog/post {
	relation reader: blog/user
	relation writer: blog/user

	permission read = reader + writer
	permission write = writer
}
```

This example defines two types of objects that will be used in the permissions system: `user` and `post`.
Each post can have two kinds of relations to users: `reader` and `writer`.
Each post can have two permissions checked: `read` and `write`.
The `read` permission [unions] together both readers and writers, so that any writer is implicitly granted read, as well.
Feel free to start with design to modify and test your own experiments in the [playground].

[unions]: /reference/schema-lang.md#-union
[playground]: https://play.authzed.com/s/mVBBpf5poNd8/schema

With a schema designed, we can now move on using our client to to apply that schema to the permission system.

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
zed schema write <(cat << EOF
definition blog/user {}

definition blog/post {
	relation reader: blog/user
	relation writer: blog/user

	permission read = reader + writer
	permission write = writer
}
EOF
)
```

  </TabItem>
  <TabItem value="go">

```go
package main

import (
	"context"
	"log"
	"os"

	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
	"github.com/authzed/authzed-go/v1"
	"github.com/authzed/grpcutil"
)

const schema = `definition blog/user {}

definition blog/post {
	relation reader: blog/user
	relation writer: blog/user

	permission read = reader + writer
	permission write = writer
}`

func main() {
	client, err := authzed.NewClient(
		"grpc.authzed.com:443",
		grpcutil.WithBearerToken("t_your_token_here_1234567deadbeef"),
		grpcutil.WithSystemCerts(grpcutil.VerifyCA),
	)
	if err != nil {
		log.Fatalf("unable to initialize client: %s", err)
	}

	request := &pb.WriteSchemaRequest{Schema: schema}
	resp, err := client.WriteSchema(context.Background(), request)
	if err != nil {
		log.Fatalf("failed to write schema: %s", err)
	}
}
```

  </TabItem>
  <TabItem value="python">

```python
from authzed.api.v1 import Client, WriteSchemaRequest
from grpcutil import bearer_token_credentials


SCHEMA = """definition blog/user {}

definition blog/post {
    relation reader: blog/user
    relation writer: blog/user

    permission read = reader + writer
    permission write = writer
}"""

client = Client(
    "grpc.authzed.com:443",
    bearer_token_credentials("t_your_token_here_1234567deadbeef"),
)

resp = client.WriteSchema(WriteSchemaRequest(schema=SCHEMA))
```

  </TabItem>
  <TabItem value="java">

:::warning
This example uses the legacy v1alpha1 API.
:::

```java

import com.authzed.api.v1alpha1.Schema;
import com.authzed.api.v1alpha1.SchemaServiceGrpc;
import com.authzed.grpcutil.BearerToken;
import io.grpc.*;

import java.util.concurrent.TimeUnit;

public class App {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder
                .forTarget("grpc.authzed.com:443")
                .useTransportSecurity()
                .build();
        try {
            SchemaServiceGrpc.SchemaServiceBlockingStub blockingStub = SchemaServiceGrpc.newBlockingStub(channel);
            blockingStub.withCallCredentials(new BearerToken("t_your_token_here_1234567deadbeef"));

            String schema = """
                    definition blog/user {}

                    definition blog/post {
                      relation reader: blog/user
                      relation writer: blog/user

                      permission read = reader + writer
                      permission write = writer
                    }
                    """;
            Schema.WriteSchemaRequest request = Schema.WriteSchemaRequest
                    .newBuilder()
                    .setSchema(schema)
                    .build();

            Schema.WriteSchemaResponse response;
            response = blockingStub.writeSchema(request);

        } finally {
            try {
                channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                // Uh oh!
            }
        }
    }
}

```

  </TabItem>
  <TabItem value="ruby">

```rb
require 'authzed'

schema = <<~SCHEMA
    definition blog/user {}

    definition blog/post {
      relation reader: blog/user
      relation writer: blog/user

      permission read = reader + writer
      permission write = writer
    }
    SCHEMA

client = Authzed::Api::V1::Client.new(
    target: 'grpc.authzed.com:443',
    interceptors: [Authzed::GrpcUtil::BearerToken.new(token: 't_your_token_here_1234567deadbeef')],
)

resp = client.schema_service.write_schema(
  Authzed::Api::V1::WriteSchemaRequest.new(schema: schema)
)
```

  </TabItem>
</Tabs>

:::note
Similar to applying schema changes for relational databases, production environments will likely want to write backward-compatible changes and apply those changes to the permission system using a schema migration toolchain.
:::

## Storing Relationships

After a permission system has its schema applied, it is ready to have its relationships be created, touched, or deleted.
Relationships are live instances of relations between objects.
Because the relationships stored in the system can change at runtime, this is a powerful primitive for dynamically granting or revoking access to the resources you've modeled.
When applications modify or create rows in their database, they will also typically create or update relationships.

:::info
Writing relationships returns a [ZedToken] which is critical to ensuring performance and [consistency].
:::

[ZedToken]: /reference/zedtokens-and-zookies.md
[consistency]: /reference/api-consistency.md

In the following example, we'll be creating two relationships: one making Emilia a writer of the first post and another making Beatrice a reader of the first post.
You can also [touch and delete] relationships, but those are not as immediately useful for an empty permission system.

[touch and delete]: https://buf.build/authzed/api/docs/main/authzed.api.v1#authzed.api.v1.RelationshipUpdate

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
zed relationship create posts:1 writer user:emilia
zed relationship create posts:1 reader user:beatrice
```

  </TabItem>
  <TabItem value="go">

```go
package main

import (
	"context"
	"fmt"
	"log"

	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
	"github.com/authzed/authzed-go/v0"
	"github.com/authzed/grpcutil"
)

func main() {
	client, err := authzed.NewClient(
		"grpc.authzed.com:443",
		grpcutil.WithBearerToken("t_your_token_here_1234567deadbeef"),
		grpcutil.WithSystemCerts(grpcutil.VerifyCA),
	)
	if err != nil {
		log.Fatalf("unable to initialize client: %s", err)
	}

	request := &pb.WriteRequest{Updates: []*pb.RelationshipUpdate{
		{ // Emilia is a Writer on Post 1
			Operation: v1.RelationshipUpdate_OPERATION_CREATE,
			Relationship: &pb.Relationship{
				Resource: &pb.ObjectReference{
					ObjectType: "blog/post",
					ObjectId: "1",
				},
				Relation: "writer",
				Subject: &pb.SubjectReference{
					Object: &pb.ObjectReference{
						ObjectType: "blog/user",
						ObjectId: "emilia",
					}
				},
			},
		},
		{ // Beatrice is a Reader on Post 1
			Operation: v1.RelationshipUpdate_OPERATION_CREATE,
			Relationship: &pb.Relationship{
				Resource: &pb.ObjectReference{
					ObjectType: "blog/post",
					ObjectId: "1",
				},
				Relation: "reader",
				Subject: &pb.SubjectReference{
					Object: &pb.ObjectReference{
						ObjectType: "blog/user",
						ObjectId: "beatrice",
					}
				},
			},
		},
	}}

	resp, err := client.WriteRelationships(context.Background(), request)
	if err != nil {
		log.Fatalf("failed to write relations: %s", err)
	}
	fmt.Println(resp.WrittenAt.Token)
}
```

  </TabItem>
  <TabItem value="python">

```python
from authzed.api.v1 import (
    Client,
    ObjectReference,
    Relationship,
    RelationshipUpdate,
    SubjectReference,
    WriteRelationshipsRequest,
)
from grpcutil import bearer_token_credentials

client = Client(
    "grpc.authzed.com:443",
    bearer_token_credentials("t_your_token_here_1234567deadbeef"),
)

resp = client.WriteRelationships(
    WriteRelationshipsRequest(
        updates=[
            # Emilia is a Writer on Post 1
            RelationshipUpdate(
                operation=RelationshipUpdate.Operation.OPERATION_CREATE,
                relationship=Relationship(
                    resource=ObjectReference(object_type="blog/post", object_id="1"),
                    relation="writer",
                    subject=SubjectReference(
                        object=ObjectReference(
                            object_type="blog/user",
                            object_id="emilia",
                        )
                    ),
                ),
            ),
            # Beatrice is a Reader on Post 1
            RelationshipUpdate(
                operation=RelationshipUpdate.Operation.OPERATION_CREATE,
                relationship=Relationship(
                    resource=ObjectReference(object_type="blog/post", object_id="1"),
                    relation="reader",
                    subject=SubjectReference(
                        object=ObjectReference(
                            object_type="blog/user",
                            object_id="beatrice",
                        )
                    ),
                ),
            ),
        ]
    )
)

print(resp.written_at.token)
```

  </TabItem>
  <TabItem value="java">

:::warning
This example uses the legacy v0 API.
:::

```java

import com.authzed.api.v0.ACLServiceGrpc;
import com.authzed.api.v0.AclService;
import com.authzed.api.v0.Core;
import com.authzed.grpcutil.BearerToken;
import io.grpc.*;

import java.util.concurrent.TimeUnit;

public class App {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder
                .forTarget("grpc.authzed.com:443")
                .useTransportSecurity()
                .build();
        try {
            ACLServiceGrpc.ACLServiceBlockingStub v0blockingStub = ACLServiceGrpc.newBlockingStub(channel);
            v0blockingStub.withCallCredentials(new BearerToken("t_your_token_here_1234567deadbeef"));
            AclService.WriteRequest request = AclService.WriteRequest
                    .newBuilder()
                    .addUpdates(
                            Core.RelationTupleUpdate
                                    .newBuilder()
                                    .setOperationValue(Core.RelationTupleUpdate.Operation.CREATE_VALUE)
                                    .setTuple(
                                            Core.RelationTuple
                                                    .newBuilder()
                                                    .setUser(
                                                            Core.User
                                                                    .newBuilder()
                                                                    .setUserset(
                                                                            Core.ObjectAndRelation
                                                                                    .newBuilder()
                                                                                    .setNamespace("blog/user")
                                                                                    .setObjectId("emilia")
                                                                                    .setRelation("...")
                                                                                    .build()
                                                                    )
                                                                    .build()
                                                    )
                                                    .setObjectAndRelation(
                                                            Core.ObjectAndRelation
                                                                    .newBuilder()
                                                                    .setNamespace("blog/post")
                                                                    .setObjectId("1")
                                                                    .setRelation("author")
                                                                    .build()
                                                    )
                                    )
                                    .build())
                    .build();

            AclService.WriteResponse response;
            response = v0blockingStub.write(request);

        } finally {
            try {
                channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                // Uh oh!
            }
        }
    }
}
```

  </TabItem>
  <TabItem value="ruby">

```ruby
require 'authzed'

client = Authzed::Api::V1::Client.new(
  target: 'grpc.authzed.com:443',
  interceptors: [Authzed::GrpcUtil::BearerToken.new(token: 't_your_token_here_1234567deadbeef')],
)

resp = client.permissions_service.write_relationships(
  Authzed::Api::V1::WriteRelationshipsRequest.new(
    updates: [
      # Emilia is a Writer on Post 1
      Authzed::Api::V1::Relationship.new(
        operation: Authzed::Api::V1::RelationshipUpdate::Operation::CREATE,
        relationship: Authzed::Api::V1::Relationship.new(
          resource: Authzed::Api::V1::ObjectReference.new(object_type: 'blog/post', object_id: '1'),
          relation: 'writer',
          subject: Authzed::Api::V1::SubjectReference.new(
            object: Authzed::Api::V1::ObjectReference.new(object_type: 'blog/user', object_id: 'emilia'),
          ),
        ),
      ),
      # Beatrice is a Reader on Post 1
      Authzed::Api::V1::Relationship.new(
        operation: Authzed::Api::V1::RelationshipUpdate::Operation::CREATE,
        relationship: Authzed::Api::V1::Relationship.new(
          resource: Authzed::Api::V1::ObjectReference.new(object_type: 'blog/post', object_id: '1'),
          relation: 'reader',
          subject: Authzed::Api::V1::SubjectReference.new(
            object: Authzed::Api::V1::ObjectReference.new(object_type: 'blog/user', object_id: 'beatrice'),
          ),
        ),
      ),
    ]
  )
)

puts resp.written_at.token
```

  </TabItem>
</Tabs>

## Checking Permissions

Permissions Systems that have stored relationships are capable of performing permission checks.
Checks do not only test for the existence of direct relationships, but will also compute and traverse transitive relationships.
For example, in our example schema, writers have both write and read, so there's no need to create a read relationship for a subject that is already a writer.

The following examples demonstrate exactly that:

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
zed permission check post:1 read  user:emilia   # true
zed permission check post:1 write user:emilia   # true
zed permission check post:1 read  user:beatrice # true
zed permission check post:1 write user:beatrice # false
```

  </TabItem>
  <TabItem value="go">

```go
package main

import (
	"context"
	"log"

	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
	"github.com/authzed/authzed-go/v1"
	"github.com/authzed/grpcutil"
)

func main() {
	client, err := authzed.NewClient(
		"grpc.authzed.com:443",
		grpcutil.WithBearerToken("t_your_token_here_1234567deadbeef"),
		grpcutil.WithSystemCerts(false),
	)
	if err != nil {
		log.Fatalf("unable to initialize client: %s", err)
	}

	ctx := context.Background()

	emilia := &pb.SubjectReference{Object: &pb.ObjectReference{
		ObjectType: "blog/user",
		ObjectId:  "emilia",
	}}

	beatrice := &pb.SubjectReference{Object: &pb.ObjectReference{
		ObjectType: "user",
		ObjectId:  "beatrice",
	}}

	firstPost := &pb.ObjectReference{
		ObjectType: "blog/post",
		ObjectId: "1",
	}

	resp, err := client.CheckPermission(ctx, &pb.CheckPermissionRequest{
		Resource: firstPost,
		Permission: "read",
		Subject: emilia,
	})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Permissionship == v1.CheckPermissionResponse_PERMISSIONSHIP_HAS_PERMISSION

	resp, err = client.CheckPermission(ctx, &pb.CheckPermissionRequest{
		Resource: firstPost,
		Permission: "write",
		Subject: emilia,
	})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Permissionship == v1.CheckPermissionResponse_PERMISSIONSHIP_HAS_PERMISSION

	resp, err = client.CheckPermission(ctx, &pb.CheckPermissionRequest{
		Resource: firstPost,
		Permission: "read",
		Subject: beatrice,
	})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Permissionship == v1.CheckPermissionResponse_PERMISSIONSHIP_HAS_PERMISSION

	resp, err = client.CheckPermission(ctx, &pb.CheckPermissionRequest{
		Resource: firstPost,
		Permission: "write",
		Subject: beatrice,
	})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Permissionship == v1.CheckPermissionResponse_PERMISSIONSHIP_NO_PERMISSION
}
```

  </TabItem>
  <TabItem value="python">

```python
from authzed.api.v1 import (
    CheckPermissionRequest,
    CheckPermissionResponse,
    Client,
    ObjectReference,
    SubjectReference,
)
from grpcutil import bearer_token_credentials

emilia = SubjectReference(
    object=ObjectReference(
        object_type="blog/user",
        object_id="emilia",
    )
)
beatrice = SubjectReference(
    object=ObjectReference(
        object_type="blog/user",
        object_id="beatrice",
    )
)

post_one = ObjectReference(object_type="blog/post", object_id="1")

client = Client(
    "grpc.authzed.com:443",
    bearer_token_credentials("t_your_token_here_1234567deadbeef"),
)

resp = client.CheckPermission(
    CheckPermissionRequest(
        resource=post_one,
        permission="read",
        subject=emilia,
    )
)
assert resp.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION

resp = client.CheckPermission(
    CheckPermissionRequest(
        resource=post_one,
        permission="write",
        subject=emilia,
    )
)
assert resp.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION

resp = client.CheckPermission(
    CheckPermissionRequest(
        resource=post_one,
        permission="read",
        subject=beatrice,
    )
)
assert resp.permissionship == CheckPermissionResponse.PERMISSIONSHIP_HAS_PERMISSION

resp = client.CheckPermission(
    CheckPermissionRequest(
        resource=post_one,
        permission="write",
        subject=beatrice,
    )
)
assert resp.permissionship == CheckPermissionResponse.PERMISSIONSHIP_NO_PERMISSION
```

  </TabItem>
  <TabItem value="java">

:::warning
This example uses the legacy v0 API.
:::

```java
import com.authzed.api.v0.ACLServiceGrpc;
import com.authzed.api.v0.AclService;
import com.authzed.api.v0.Core;
import com.authzed.grpcutil.BearerToken;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

import java.util.concurrent.TimeUnit;

public class App {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder
                .forTarget("grpc.authzed.com:443")
                .useTransportSecurity()
                .build();
        try {
            ACLServiceGrpc.ACLServiceBlockingStub v0blockingStub = ACLServiceGrpc.newBlockingStub(channel);
            v0blockingStub.withCallCredentials(new BearerToken("t_your_token_here_1234567deadbeef"));

            Core.User emilia = Core.User
                    .newBuilder()
                    .setUserset(
                            Core.ObjectAndRelation
                                    .newBuilder()
                                    .setNamespace("blog/user")
                                    .setObjectId("emilia")
                                    .setRelation("...")
                                    .build()
                    )
                    .build();
            Core.ObjectAndRelation postOneReader = Core.ObjectAndRelation
                    .newBuilder()
                    .setNamespace("blog/post")
                    .setObjectId("1")
                    .setRelation("reader")
                    .build();
            AclService.CheckRequest request = AclService.CheckRequest
                    .newBuilder()
                    .setUser(emilia)
                    .setTestUserset(postOneReader)
                    .build();

            AclService.CheckResponse response;
            response = v0blockingStub.check(request);

        } finally {
            try {
                channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                // Uh oh!
            }
        }
    }
}

```

  </TabItem>
  <TabItem value="ruby">

```ruby
require 'authzed'

emilia = Authzed::Api::V1::SubjectReference.new(object: Authzed::Api::V1::ObjectReference.new(
  object_type: 'blog/user',
  object_id: 'emilia',
))
beatrice = Authzed::Api::V1::SubjectReference.new(object: Authzed::Api::V1::ObjectReference.new(
  object_type: 'blog/user',
  object_id: 'beatrice',
))
first_post = Authzed::Api::V1::ObjectReference.new(object_type: 'blog/post', object_id: '1'))

client = Authzed::Api::V0::Client.new(
  target: 'grpc.authzed.com:443',
  interceptors: [Authzed::GrpcUtil::BearerToken.new(token: 't_your_token_here_1234567deadbeef')],
)

resp = client.permissions_service.check_permission(Authzed::Api::V1::CheckPermissionRequest.new(
  resource: first_post,
  permission: 'read',
  subject: emilia,
))
raise unless Authzed::Api::V1::CheckPermissionResponse::Permissionship.resolve(resp.permissionship)) ==
  Authzed::Api::V1::CheckPermissionResponse::Permissionship::PERMISSIONSHIP_HAS_PERMISSION

resp = client.permissions_service.check_permission(Authzed::Api::V1::CheckPermissionRequest.new(
  resource: first_post,
  permission: 'write',
  subject: emilia,
))
raise unless Authzed::Api::V1::CheckPermissionResponse::Permissionship.resolve(resp.permissionship)) ==
  Authzed::Api::V1::CheckPermissionResponse::Permissionship::PERMISSIONSHIP_HAS_PERMISSION

resp = client.permissions_service.check_permission(Authzed::Api::V1::CheckPermissionRequest.new(
  resource: first_post,
  permission: 'read',
  subject: beatrice,
))
raise unless Authzed::Api::V1::CheckPermissionResponse::Permissionship.resolve(resp.permissionship)) ==
  Authzed::Api::V1::CheckPermissionResponse::Permissionship::PERMISSIONSHIP_HAS_PERMISSION

resp = client.permissions_service.check_permission(Authzed::Api::V1::CheckPermissionRequest.new(
  resource: first_post,
  permission: 'write',
  subject: beatrice,
))
raise unless Authzed::Api::V1::CheckPermissionResponse::Permissionship.resolve(resp.permissionship)) ==
  Authzed::Api::V1::CheckPermissionResponse::Permissionship::PERMISSIONSHIP_NO_PERMISSION
```

  </TabItem>
</Tabs>

:::note
In addition to checking permissions, it is also possible to perform checks on relations to determine membership.

This goes against the best practice because computing permissions are far more flexible, but can be useful when used with discretion.
:::
