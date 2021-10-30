# Protecting Your First App

import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

:::caution Work in Progress
Not all languages in this guide are up to date.
:::

## Introduction

This guide walks through defining a permission system for a very simple blog application.

Each section demonstrates how to use the API to perform the required step and the [final section] demonstrates these APIs calls combined into one end-to-end integrated application.

[final section]: #end-to-end-example

## Prerequisites

- An [Authzed] account
- An [API Token] with _admin_ access to a new Permissions System

[Authzed]: https://app.authzed.com
[API Token]: /reference/api#authentication

## Installation

In order to interact with Authzed, you'll need an [Authzed API] client.

In addition to client libraries, the [zed command line tool] can be used to interact with the API from macOS or Linux shells.

Each tool is installed with its native package management tools:

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
brew install --HEAD authzed/tap/zed
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

[Authzed API]: /reference/api
[zed command line tool]: /reference/zed

## Defining and Updating a Schema

The first step in a new permissions system is to apply a _Schema_.

Schemas define the Objects in a Permissions System.

Objects have two kinds of properties: Relations to other Objects and Permissions.

Relations have types that specify which Objects can have that Relation.

Permissions are computed from combining Relations with set operations (union, intersection, exclusion).

The following is a basic Schema for a blog:

```zed
definition blog/user {}

definition blog/post {
  relation reader: blog/user
  relation writer: blog/user

  permission read = reader + writer
  permission write = writer
}
```

This example defines two types of Objects that will be used in the Permissions System: Users and Posts.
Posts can have two relations to Users: reader and writer.
Posts can have two permissions checked: read and write.

Notice that the read permission _unions_ both readers and writers.
By doing so, you avoid having to perform multiple checks for all the relations that should have access to an Object.

With the basics down, you can explore building your own schemas on the [Authzed Playground].

[Authzed Playground]: https://play.authzed.com

Now apply the schema using the command line or a client library:

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
zed schema write blog_permissions.zed
```

  </TabItem>
  <TabItem value="go">

```go
package main

import (
	"context"
	"log"
	"os"

	pb "github.com/authzed/authzed-go/proto/authzed/api/v1alpha1"
	authzed "github.com/authzed/authzed-go/v1alpha1"
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
		grpcutil.WithSystemCerts(false),
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
from authzed.api.v1alpha1 import Client, WriteSchemaRequest
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

client = Authzed::Api::V1alpha1::Client.new(
    target: 'grpc.authzed.com:443',
    interceptors: [Authzed::GrpcUtil::BearerToken.new(token: "t_your_token_here_1234567deadbeef")],
)

resp = client.schema_service.write_schema(
  Authzed::Api::V1alpha1::WriteSchemaRequest.new(
    schema: schema
  )
)

```

  </TabItem>
</Tabs>

## Creating Relationships

Once a Schema has been applied, the next step is to create _Relationships_ the follow that Schema.
Relationships are instances of a Relation between two Objects.

Create two relationships: one making Emilia a writer of the first post and another making Beatrice a reader of the first post.
You can also _touch_ and _delete_ relationships, but those are not as immediately useful for an empty permission system.

:::note
The API version of the client in the code examples has switched from v1alpha1 to v0.
Currently, the Schema API is the only API available in v1alpha1.
:::

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
zed relationship create user:emilia   writer posts:1
zed relationship create user:beatrice reader posts:1
```

  </TabItem>
  <TabItem value="go">

```go
package main

import (
	"context"
	"fmt"
	"log"

	pb "github.com/authzed/authzed-go/proto/authzed/api/v0"
	authzed "github.com/authzed/authzed-go/v0"
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

	request := &pb.WriteRequest{Updates: []*pb.RelationTupleUpdate{
		{ // Emilia is a Writer on Post 1
			Operation: pb.RelationTupleUpdate_CREATE,
			Tuple: &pb.RelationTuple{
				User: &pb.User{UserOneof: &pb.User_Userset{Userset: &pb.ObjectAndRelation{
					Namespace: "user",
					ObjectId:  "emilia",
					Relation:  "...",
				}}},
				ObjectAndRelation: &pb.ObjectAndRelation{
					Namespace: "post",
					ObjectId:  "1",
					Relation:  "writer",
				},
			},
		},
		{ // Beatrice is a Reader on Post 1
			Operation: pb.RelationTupleUpdate_CREATE,
			Tuple: &pb.RelationTuple{
				User: &pb.User{UserOneof: &pb.User_Userset{Userset: &pb.ObjectAndRelation{
					Namespace: "user",
					ObjectId:  "beatrice",
					Relation:  "...",
				}}},
				ObjectAndRelation: &pb.ObjectAndRelation{
					Namespace: "post",
					ObjectId:  "1",
					Relation:  "reader",
				},
			},
		},
	}}

	resp, err := client.Write(context.Background(), request)
	if err != nil {
		log.Fatalf("failed to write relations: %s", err)
	}
	fmt.Println(resp.Revision.Token)
}
```

  </TabItem>
  <TabItem value="python">

```python
from authzed.api.v0 import (
    Client,
    ObjectAndRelation,
    RelationTuple,
    RelationTupleUpdate,
    User,
    WriteRequest,
)
from grpcutil import bearer_token_credentials


client = Client(
    "grpc.authzed.com:443",
    bearer_token_credentials("t_your_token_here_1234567deadbeef"),
)

resp = client.Write(WriteRequest(updates=[
    # Emilia is a Writer on Post 1
    RelationTupleUpdate(
        operation=RelationTupleUpdate.Operation.CREATE,
        tuple=RelationTuple(
            user=User(namespace="blog/user", object_id="emilia"),
            object_and_relation=ObjectAndRelation(
                namespace="blog/post",
                object_id="1",
                relation="writer",
            ),
        ),
    ),
    # Beatrice is a Reader on Post 1
    RelationTupleUpdate(
        operation=RelationTupleUpdate.Operation.CREATE,
        tuple=RelationTuple(
            user=User(namespace="blog/user", object_id="beatrice"),
            object_and_relation=ObjectAndRelation(
                namespace="blog/post",
                object_id="1",
                relation="reader",
            ),
        ),
    ),
]))
```

  </TabItem>
  <TabItem value="java">

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

client = Authzed::Api::V0::Client.new(
  target: 'grpc.authzed.com:443',
  interceptors: [Authzed::GrpcUtil::BearerToken.new(token: 't_your_token_here_1234567deadbeef')],
)

client.acl_service.write(
  Authzed::Api::V0::WriteRequest.new(
    updates: [
      # Emilia is a Writer on Post 1
      Authzed::Api::V0::RelationTupleUpdate.new(
        operation: Authzed::Api::V0::RelationTupleUpdate::Operation::CREATE,
        tuple: Authzed::Api::V0::RelationTuple.new(
          user: Authzed::Api::V0::User.for(namespace: 'blog/user', object_id: 'emilia'),
          object_and_relation: Authzed::Api::V0::ObjectAndRelation.new(
            namespace: 'blog/post',
            object_id: '1',
            relation: 'writer'
          ),
        ),
      ),
      # Beatrice is a Reader on Post 1
      Authzed::Api::V0::RelationTupleUpdate.new(
        operation: Authzed::Api::V0::RelationTupleUpdate::Operation::CREATE,
        tuple: Authzed::Api::V0::RelationTuple.new(
          user: Authzed::Api::V0::User.for(namespace: 'blog/user', object_id: 'beatrice'),
          object_and_relation: Authzed::Api::V0::ObjectAndRelation.new(
            namespace: 'blog/post',
            object_id: '1',
            relation: 'reader'
          ),
        ),
      ),
    ]
  )
)

```

  </TabItem>
</Tabs>

## Checking Permissions

Permissions Systems that have existing relationships can perform _Permission checks_.
Checks determine whether an Object has permission to perform an action on another Object.
This most commonly takes the form of Users checking their access to perform [CRUD operations] on a resource in an application.

[CRUD operations]: https://en.wikipedia.org/wiki/Create%2C_read%2C_update_and_delete

The following demonstrates exhaustively checking all the permissions for Emilia and Beatrice on the first post;
notice that Emilia has read access implicitly through the writer relation:

<Tabs groupId="clients" defaultValue={"shell"} values={[
  {label: 'Shell', value: 'shell'},
  {label: 'Go', value: 'go'},
  {label: 'Python', value: 'python'},
  {label: 'Java', value: 'java'},
  {label: 'Ruby', value: 'ruby'},
]}>
  <TabItem value="shell">

```sh
zed permission check user:emilia   read  posts:1 # true
zed permission check user:emilia   write posts:1 # true
zed permission check user:beatrice read  posts:1 # true
zed permission check user:beatrice write posts:1 # false
```

  </TabItem>
  <TabItem value="go">

```go
package main

import (
	"context"
	"log"

	pb "github.com/authzed/authzed-go/proto/authzed/api/v0"
	authzed "github.com/authzed/authzed-go/v0"
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

	emilia := &pb.User{UserOneof: &pb.User_Userset{Userset: &pb.ObjectAndRelation{
		Namespace: "user",
		ObjectId:  "emilia",
		Relation:  "...",
	}}}

	beatrice := &pb.User{UserOneof: &pb.User_Userset{Userset: &pb.ObjectAndRelation{
		Namespace: "user",
		ObjectId:  "beatrice",
		Relation:  "...",
	}}}

	post1Reader := &pb.ObjectAndRelation{Namespace: "post", ObjectId: "1", Relation: "reader"}
	post1Writer := &pb.ObjectAndRelation{Namespace: "post", ObjectId: "1", Relation: "writer"}

	resp, err := client.Check(ctx, &pb.CheckRequest{User: emilia, TestUserset: post1Reader})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Membership == pb.CheckResponse_MEMBER

	resp, err = client.Check(ctx, &pb.CheckRequest{User: emilia, TestUserset: post1Writer})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Membership == pb.CheckResponse_MEMBER

	resp, err = client.Check(ctx, &pb.CheckRequest{User: beatrice, TestUserset: post1Reader})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Membership == pb.CheckResponse_MEMBER

	resp, err = client.Check(ctx, &pb.CheckRequest{User: beatrice, TestUserset: post1Writer})
	if err != nil {
		log.Fatalf("failed to check permission: %s", err)
	}
	// resp.Membership != pb.CheckResponse_MEMBER
}
```

  </TabItem>
  <TabItem value="python">

```python
from authzed.api.v0 import CheckRequest, Client, ObjectAndRelation, User
from grpcutil import bearer_token_credentials


emilia = User("blog/user", "emilia")
beatrice = User("blog/user", "beatrice")

post_one_reader = ObjectAndRelation(
    namespace="blog/post",
    object_id="1",
    relation="reader",
)
post_one_writer = ObjectAndRelation(
    namespace="blog/post",
    object_id="1",
    relation="writer",
)

client = Client(
    "grpc.authzed.com:443",
    bearer_token_credentials("t_your_token_here_1234567deadbeef"),
)

resp = client.Check(CheckRequest(user=emilia, test_userset=post_one_reader))
assert resp.is_member
resp = client.Check(CheckRequest(user=emilia, test_userset=post_one_writer))
assert resp.is_member

resp = client.Check(CheckRequest(user=beatrice, test_userset=post_one_reader))
assert resp.is_member
resp = client.Check(CheckRequest(user=beatrice, test_userset=post_one_writer))
assert not resp.is_member
```

  </TabItem>
  <TabItem value="java">

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

emilia = Authzed::Api::V0::User.for(namespace: 'blog/user', object_id: 'emilia')
beatrice = Authzed::Api::V0::User.for(namespace: 'blog/user', object_id: 'beatrice')

post_one_reader = Authzed::Api::V0::ObjectAndRelation.new(
  namespace: 'blog/post',
  object_id: '1',
  relation: 'reader')

post_one_writer = Authzed::Api::V0::ObjectAndRelation.new(
  namespace: 'blog/post',
  object_id: '1',
  relation: 'writer')

client = Authzed::Api::V0::Client.new(
  target: 'grpc.authzed.com:443',
  interceptors: [Authzed::GrpcUtil::BearerToken.new(token: 't_your_token_here_1234567deadbeef')],
)

resp = client.acl_service.check(
  Authzed::Api::V0::CheckRequest.new(test_userset: post_one_reader, user: emilia)
)
raise unless resp.is_member

resp = client.acl_service.check(
  Authzed::Api::V0::CheckRequest.new(test_userset: post_one_writer, user: emilia)
)
raise unless resp.is_member

resp = client.acl_service.check(
  Authzed::Api::V0::CheckRequest.new(test_userset: post_one_reader, user: beatrice)
)
raise unless resp.is_member

resp = client.acl_service.check(
  Authzed::Api::V0::CheckRequest.new(test_userset: post_one_writer, user: beatrice)
)
raise if resp.is_member

```

  </TabItem>
</Tabs>

## End-to-End Example

This document has covered independent usage of each API call needed to integrate an application, but it has not shown the integration points in a typical application.
To see examples and learn more about where these APIs should be called within your application, see the following:

Resources for end-to-end examples include:

- [The Authzed Demo Video](https://authzed.com/demo)
- [Real World Flask](https://github.com/authzed/flask-realworld-example-app) with [Real World React Redux](https://github.com/authzed/react-redux-realworld-example-app)
