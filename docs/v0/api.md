# gRPC API v0

import {ApiExample, ApiSample} from '../../src/components/ApiExample';

:::note
This page makes use of Zanzibar terminology and namespace configuration.
:::

The v0 Authzed gRPC API is composed of two gRPC services: ACLService and NamespaceService.

## ACLService.Check

Check Requests are the basic permissions checking mechanism in Authzed and are the most common API call.

A Check Request determines if the specified `user` (represented by an Object and Relation) is found within the `test_userset`.

### Request

#### Parameters

:::note
It is recommended to specify the `at_revision` [Zookie] value, which will return the namespace's configuration as of the logical timestamp represented by that [Zookie].
:::

[Zookie]: /v0/concepts#zookies

| Name           | Type                | Required             |
| ------------   | ------------------- | -------------------- |
| `test_userset` | `ObjectAndRelation` | Yes                  |
| `user`         | `User`              | Yes                  |
| `at_revision`  | `Zookie`            | No (but recommended) |

#### Request Definition

```proto
message CheckRequest {
    ObjectAndRelation test_userset = 1;
    User user = 2;
    Zookie at_revision = 3;
}
```

<details>
<summary>Additional Protocol Buffer definitions used</summary>

```proto
message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message User {
    oneof user_oneof {
        uint64 user_id = 1;
        ObjectAndRelation userset = 2;
    }
}

message Zookie { string token = 1; }
```

</details>

#### Request Example

```proto
{
    test_userset: {
        namespace: "mynotetakingapp/note"
        object_id: "328392"
        relation: "owner"
    }
    user: {
        userset: {
            namespace: "mynotetakingapp/user"
            object_id: "213"
            relation: "..."
        }
    }
    at_revision: { token: "CAESAggB" }
}
```

### Response

A CheckResponse contains two values:

- a boolean that indicates whether provided `user` is a member of the provided `test_userset`
- a [Zookie](/concept/zookies)

#### Response Definition

```proto
message CheckResponse {
    enum Membership {
        NOT_MEMBER = 1; MEMBER = 2;
    }

    Zookie revision = 2;
    Membership membership = 3;
}

message Zookie { string token = 1; }
```

#### Response Example

```proto
{
    revision { token: "CAESAggB" }
    result: MEMBER
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **RESOURCE_EXHAUSTED**: processing the request surpassed the maximum depth of relationship resolution
- **FAILED_PRECONDITION**: a specified namespace or relation does not exist

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "check_namespace": {
        "title": "Namespace",
        "description": "The namespace containing the object to check",
        "placeholder": "mynamespace",
    },
    "check_object_id": {
        "title": "Object ID",
        "description": "The ID of the object to check",
        "placeholder": "someobject",
    },
    "check_relation": {
        "title": "Relation",
        "description": "The relation to check for the object",
        "placeholder": "viewer",
    },
    "check_user_namespace": {
        "title": "User namespace",
        "description": "The namespace for users in your tenant",
        "placeholder": "user",
    },
    "check_user_id": {
        "title": "User ID",
        "description": "The ID of the user against which to check",
        "placeholder": "someuserid",
    },
    "zookie": {
        "title": "Zookie",
        "description": "The opaque token that signifies a read should be as fresh as the write that produced this token.",
        "placeholder": "someopaquevalue"
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "test_userset": {
             "namespace": "$tenantslug/$check_namespace",
             "object_id": "$check_object_id",
             "relation": "$check_relation"
         },
         "user": {
             "userset": {
                 "namespace": "$tenantslug/$check_user_namespace",
                 "object_id": "$check_user_id",
                 "relation": "..."
             }
         },
         "at_revision": { "token": "$zookie" }
     }' \
    grpc.authzed.com:443 authzed.api.v0.ACLService/Check
```

</ApiSample>
</ApiExample>

## ACLService.ContentChangeCheck

Content-Change Check Requests are a special kind of [Check Request] that should be used before applications modify protected content.

The primary difference between regular checks and content-change checks is that content-change checks do not require a [Zookie] because they are always evaluated at the latest revision.
The [Zookie] returned by a Content-Change Check Response is intended to be saved alongside the protected content, so that the application can use it in future Check requests.
This avoids the [New Enemy Problem].

The following pseudo-code represents the desired usage of this API:

```py
def write_content(user, content_id, new_content):
    is_allowed, zookie = content_change_check(content_id, user)
    if is_allowed:
        storage.write_content(contentd_id, new_content, zookie)
        return success
    return forbidden
```

[Check Request]: /v0/api#aclservicecheck
[Zookie]: /v0/concepts#zookies
[New Enemy Problem]: /reference/glossary.md#new-enemy-problem

### Request

#### Parameters

| Name           | Type                | Required             |
| ------------   | ------------------- | -------------------- |
| `test_userset` | `ObjectAndRelation` | Yes                  |
| `user`         | `User`              | Yes                  |

#### Request Definition

```proto
message ContentChangeCheckRequest {
  ObjectAndRelation test_userset = 1;
  User user = 2;
}
```

<details>
<summary>Additional Protocol Buffer definitions used</summary>

```proto
message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message User {
    oneof user_oneof {
        uint64 user_id = 1;
        ObjectAndRelation userset = 2;
    }
}
```

</details>

#### Request Example

```proto
{
    test_userset: {
        namespace: "mynotetakingapp/note"
        object_id: "328392"
        relation: "owner"
    }
    user: {
        userset: {
            namespace: "mynotetakingapp/user"
            object_id: "213"
            relation: "..."
        }
    }
}
```

### Response

A Content-Change Check Response contains two values:

- a boolean that indicates whether provided `user` is a member of the provided `test_userset`
- a [Zookie](/concept/zookies)

#### Response Definition

```proto
message CheckResponse {
    enum Membership {
        NOT_MEMBER = 1; MEMBER = 2;
    }

    Zookie revision = 2;
    Membership membership = 3;
}

message Zookie { string token = 1; }
```

#### Response Example

```proto
{
    revision { token: "CAESAggB" }
    result: MEMBER
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **RESOURCE_EXHAUSTED**: processing the request surpassed the maximum depth of relationship resolution
- **FAILED_PRECONDITION**: a specified namespace or relation does not exist

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "check_namespace": {
        "title": "Namespace",
        "description": "The namespace containing the object to check",
        "placeholder": "mynamespace",
    },
    "check_object_id": {
        "title": "Object ID",
        "description": "The ID of the object to check",
        "placeholder": "someobject",
    },
    "check_relation": {
        "title": "Relation",
        "description": "The relation to check for the object",
        "placeholder": "viewer",
    },
    "check_user_namespace": {
        "title": "User namespace",
        "description": "The namespace for users in your tenant",
        "placeholder": "user",
    },
    "check_user_id": {
        "title": "User ID",
        "description": "The ID of the user against which to check",
        "placeholder": "someuserid",
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "test_userset": {
             "namespace": "$tenantslug/$check_namespace",
             "object_id": "$check_object_id",
             "relation": "$check_relation"
         },
         "user": {
             "userset": {
                 "namespace": "$tenantslug/$check_user_namespace",
                 "object_id": "$check_user_id",
                 "relation": "..."
             }
         }
     }' \
    grpc.authzed.com:443 authzed.api.v0.ACLService/ContentChangeCheck
```

</ApiSample>
</ApiExample>

## ACLService.Expand

Expand Requests provide the ability to list the users in a particular userset.

Unlike [Read Responses], Expand Responses follow indirect references.
For example, expanding a `viewer` relation, would also include users with `owner` relations that `viewer` includes as a part of a `userset_rewrite`.

[Read Responses]: /v0/api#response-3

### Request

#### Parameters

:::note
It is recommended to specify the `at_revision` [Zookie] value, which will return the namespace's configuration as of the logical timestamp represented by that Zookie.
:::

[Zookie]: /v0/concepts#zookies

| Name          | Type                | Required             |
| ------------- | ------------------- | -------------------- |
| `userset`     | `ObjectAndRelation` | Yes                  |
| `at_revision` | `Zookie`            | No (but recommended) |

#### Request Definition

```proto
message ExpandRequest {
    ObjectAndRelation userset = 1;
    Zookie at_revision = 2;
}
```

<details>
<summary>Additional Protocol buffer definitions used</summary>

```proto
message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message Zookie { string token = 1; }
```

</details>

#### Request Example

```proto
{
    userset: {
        namespace: "mynotetakingapp/note"
        object_id: "2112"
        relation: "viewer"
    }
    at_revision: { token: "CAESAggB" }
}
```

### Response

#### Response Definition

```proto
message ExpandResponse {
    RelationTupleTreeNode tree_node = 1;
    Zookie revision = 3;
}
```

<details>
<summary>Additional Protocol Buffer definitions used</summary>

```proto
message RelationTupleTreeNode {
  oneof node_type {
    SetOperationUserset intermediate_node = 1;
    DirectUserset leaf_node = 2;
  }
  ObjectAndRelation expanded = 3;
}

message SetOperationUserset {
  enum Operation { INVALID = 0; UNION = 1; INTERSECTION = 2; EXCLUSION = 3; }

  Operation operation = 1;
  repeated RelationTupleTreeNode child_nodes = 2;
}

message DirectUserset { repeated User users = 1; }

message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message User {
    oneof user_oneof {
        uint64 user_id = 1;
        ObjectAndRelation userset = 2;
    }
}

message Zookie { string token = 1; }
```

</details>

#### Response Example

```proto
{
    tree_node {
        leaf_node {
            users {
                userset {
                    namespace: "mynotetakingapp/user"
                    object_id: "213"
                    relation: "..."
                }
            }
            users {
                userset {
                    namespace: "mynotetakingapp/user"
                    object_id: "539"
                    relation: "..."
                }
            }
        }
        expanded {
            namespace: "mynotetakingapp/note"
            object_id: "2112"
            relation: "viewer"
        }
    }
    revision { token: "CAESAggG" }
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **RESOURCE_EXHAUSTED**: processing the request surpassed the maximum depth of relationship resolution
- **FAILED_PRECONDITION**: a specified namespace or relation does not exist

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "expand_namespace": {
        "title": "Namespace",
        "description": "The namespace of the userset that will be expanded",
        "placeholder": "mynamespace",
    },
    "expand_object_id": {
        "title": "Object ID",
        "description": "The ID of the object whose userset will be expanded",
        "placeholder": "someobject",
    },
    "expand_relation": {
        "title": "Relation",
        "description": "The relation of the object that will be expanded",
        "placeholder": "viewer",
    },
    "zookie": {
        "title": "Zookie",
        "description": "The opaque token that signifies a read should be as fresh as the write that produced this token.",
        "placeholder": "someopaquevalue"
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "userset": {
             "namespace": "$tenantslug/$expand_namespace",
             "object_id": "$expand_object_id",
             "relation": "$expand_relation"
         },
         "at_revision": { "token": "$zookie" }
     }' \
    grpc.authzed.com:443 authzed.api.v0.ACLService/Expand
```

</ApiSample>
</ApiExample>

## ACLService.Lookup

Lookup Requests provide the ability to list the objects for a particular relation and user.

### Request

#### Parameters

:::note
It is recommended to specify the `at_revision` [Zookie] value, which will return the data as of the logical timestamp represented by that Zookie.
:::

[Zookie]: /v0/concepts#zookies

| Name              | Type                | Required             |
| ----------------- | ------------------- | -------------------- |
| `object_relation` | `RelationReference` | Yes                  |
| `user`            | `ObjectAndRelation` | Yes                  |
| `at_revision`     | `Zookie`            | No (but recommended) |

#### Request Definition

```proto
message LookupRequest {
    RelationReference object_relation = 1;
    ObjectAndRelation user = 2;
    Zookie at_revision = 3;
}
```

<details>
<summary>Additional Protocol buffer definitions used</summary>

```proto
message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message RelationReference {
  string namespace = 1;
  string relation = 3;
}

message Zookie { string token = 1; }
```

</details>

#### Request Example

```proto
{
    user: {
        namespace: "mynotetakingapp/user"
        object_id: "someuserid"
        relation: "..."
    }
    object_relation: {
        namespace: "mynotetakingapp/note"
        relation: "viewer"
    }
    at_revision: { token: "CAESAggB" }
}
```

### Response

#### Response Definition

```proto
message LookupResponse {
    repeated string resolved_object_ids = 1;
    Zookie revision = 3;
}
```

#### Response Example

```proto
{
    resolved_object_ids {
        '2112',
        '3133',
    }
    revision { token: "CAESAggG" }
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **RESOURCE_EXHAUSTED**: processing the request surpassed the maximum depth of relationship resolution
- **FAILED_PRECONDITION**: a specified namespace or relation does not exist

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "user_namespace": {
        "title": "User Namespace",
        "description": "The namespace of the user",
        "placeholder": "mynamespace",
    },
    "user_object_id": {
        "title": "User ID",
        "description": "The ID of the user",
        "placeholder": "someuser",
    },
    "lookup_namespace": {
        "title": "Namespace",
        "description": "The namespace for the relation for which to lookup",
        "placeholder": "mynamespace",
    },
    "lookup_relation": {
        "title": "Relation",
        "description": "The relation for which to lookup",
        "placeholder": "viewer",
    },
    "zookie": {
        "title": "Zookie",
        "description": "The opaque token that signifies a read should be as fresh as the write that produced this token.",
        "placeholder": "someopaquevalue"
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
        "object_relation": {
             "namespace": "$tenantslug/$lookup_namespace",
             "relation": "$lookup_relation"
        },
        "user": {
             "namespace": "$tenantslug/$user_namespace",
             "object_id": "$user_object_id",
             "relation": "..."
         },
         "at_revision": { "token": "$zookie" }
     }' \
    grpc.authzed.com:443 authzed.api.v0.ACLService/Expand
```

</ApiSample>
</ApiExample>

## ACLService.Read

Read Requests provide the ability to retrieve sets of [Tuples] as provided by one or more filters.
Read Requests are rarely used, as [Expand Requests] are almost always the desired behavior.

Read Requests are bulk operations that can issue multiple filters in one request.
Filters are specified as a [Tuple] along with a list of fields.
If a field is not present in the Filter list, its value will be ignored and that field will be treated as a wildcard.

[Expand Requests]: #aclserviceexpand
[Tuples]: /v0/concepts#tuples
[Tuple]: /v0/concepts#tuples

### Request

#### Parameters

:::note
It is recommended to specify the `at_revision` [Zookie] value, which will return the namespace's configuration as of the logical timestamp represented by that Zookie.
:::

[Zookie]: /v0/concepts#zookies

| Name          | Type                  | Required             |
| ------------- | --------------------- | -------------------- |
| `tuplesets`   | `RelationTupleFilter` | Yes                  |
| `at_revision` | `Zookie`              | No (but recommended) |

#### Request Definition

It is required that the corresponding `Filter` ID must be present in the `Filters` list if any of the follow fields are set:

- `object_id`
- `relation`
- `userset`

```proto
message ReadRequest {
    repeated RelationTupleFilter tuplesets = 1;
    Zookie at_revision = 2;
}

message RelationTupleFilter {
    enum Filter {
        UNKNOWN = 0; OBJECT_ID = 1; RELATION = 2; USERSET = 4;
    }
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
    ObjectAndRelation userset = 5;

    repeated Filter filters = 6;
}
```

<details>
<summary>Additional Protocol Buffer definitions used</summary>

```proto
message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message Zookie { string token = 1; }
```

</details>

#### Request Example

Read all the direct relationships for my note taking app's user 2112:

```proto
{
    tuplesets: [
        {
            namespace: "mynotetakingapp/note"
            userset: {
                namespace: "mynotetakingapp/user"
                object_id: "2112"
                relation: "..."
            }
            filters: [ 4 ]
        }
    ]
    at_revision: { token: "CAESAggB" }
}
```

### Response

#### Response Definition

```proto
message ReadResponse {
    message Tupleset { repeated RelationTuple tuples = 1; }

    repeated Tupleset tuplesets = 1;
    Zookie revision = 2;
}
```

<details>
<summary>Additional Protocol Buffer definitions used</summary>

```proto
message RelationTuple {
    ObjectAndRelation object_and_relation = 1;
    User user = 2;
}

message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message User {
    oneof user_oneof {
        uint64 user_id = 1;
        ObjectAndRelation userset = 2;
    }
}


message Zookie { string token = 1; }
```

</details>

#### Response Example

```proto
{
    tuplesets {
        tuples {
            object_and_relation {
                namespace: "mynotetakingapp/note"
                object_id: "2112"
                relation: "editor"
            }
            user {
                userset {
                    namespace: "mynotetakingapp/user"
                    object_id: "213"
                    relation: "..."
                }
            }
        }
        tuples {
            object_and_relation {
                namespace: "mynotetakingapp/note"
                object_id: "2112"
                relation: "viewer"
            }
            user {
                userset {
                    namespace: "mynotetakingapp/user"
                    object_id: "539"
                    relation: "..."
                }
            }
        }
    }
    revision { token: "CAESAggG" }
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **FAILED_PRECONDITION**: a specified namespace or relation does not exist
- **OUT_OF_RANGE**: the specified zookie is too old to be used

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "read_namespace": {
        "title": "Namespace",
        "description": "The namespace of the Tuples that will be read.",
        "placeholder": "mynamespace",
    },
    "read_user_namespace": {
        "title": "User namespace",
        "description": "The namespace for users in your Tenant",
        "placeholder": "user",
    },
    "read_user_id": {
        "title": "User ID",
        "description": "The ID of the user that will filter Tuples.",
        "placeholder": "someuserid",
    },
    "zookie": {
        "title": "Zookie",
        "description": "The opaque token that signifies a read should be as fresh as the write that produced this token.",
        "placeholder": "someopaquevalue"
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "tuplesets": [
             {
                 "namespace": "$tenantslug/$read_namespace",
                 "userset": {
                     "namespace": "$tenantslug/$read_user_namespace",
                     "object_id": "$read_user_id",
                     "relation": "..."
                 },
                 "filters": [ 4 ]
             }
         ],
         "at_revision": { "token": "$zookie" }
     }' \
    grpc.authzed.com:443 authzed.api.v0.ACLService/Read
```

</ApiSample>
</ApiExample>

## ACLService.Write

Write Requests provide the ability to create, modify, or delete the relationships stored in Authzed.

Clients may modify a single relation tuple to add or remove an ACL.
They may also modify all tuples related to an object via a read-modify-write process with [optimistic concurrency control] that uses a read RPC followed by a Write RPC:

1. Read all relation tuples of an object, including a per-object "lock" tuple.
2. Generate the tuples to write or delete. Send the writes, along with a touch on the lock tuple, to Zanzibar, with the condition that the writes will be committed only if the lock tuple has not been modified since the read.
3. If the write condition is not met, go back to step 1. The lock tuple is just a regular relation tuple used by clients to detect write races.

[optimistic concurrency control]: https://en.wikipedia.org/wiki/Optimistic_concurrency_control

### Request

#### Parameters

| Name               | Type                  | Required |
| ------------------ | --------------------- | -------- |
| `write_conditions` | `RelationTupleUpdate` | No       |
| `updates`          | `RelationTuple`       | Yes      |

#### Request Definition

```proto
message WriteRequest {
    repeated RelationTuple write_conditions = 1;
    repeated RelationTupleUpdate updates = 2;
}
```

<details>
<summary>Additional Protocol Buffer definitions used</summary>

```proto
message RelationTupleUpdate {
    enum Operation { UNKNOWN = 0; CREATE = 1; TOUCH = 2; DELETE = 3; }
    Operation operation = 1;
    RelationTuple tuple = 2;
}

message RelationTuple {
    ObjectAndRelation object_and_relation = 1;
    User user = 2;
}

message ObjectAndRelation {
    string namespace = 1;
    string object_id = 2;
    string relation = 3;
}

message User {
    oneof user_oneof {
        uint64 user_id = 1;
        ObjectAndRelation userset = 2;
    }
}
```

</details>

#### Request Example

Adding user with ID 213 as an editor and on a note:

```proto
{
    updates: [
        {
            operation: 1,
            tuple: {
                object_and_relation: {
                    namespace: "mynotetakingapp/note"
                    object_id: "2112"
                    relation: "editor"
                }
                user: {
                    userset: {
                        namespace: "mynotetakingapp/user"
                        object_id: "213"
                        relation: "..."
                    }
                }
            }
        }
    ]
}
```

### Response

#### Response Definition

```
message WriteResponse { Zookie revision = 1; }
message Zookie { string token = 1; }
```

#### Response Example

```
{
    revision { token: "CAESAggB" }
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **FAILED_PRECONDITION**: a specified `write_condition` was not true or a provided namespace or relation does not exist

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "write_namespace": {
        "title": "Namespace",
        "description": "The namespace containing the object to check",
        "placeholder": "note",
    },
    "write_object_id": {
        "title": "Object ID",
        "description": "The ID of the object to check",
        "placeholder": "grocerylist",
    },
    "write_relation": {
        "title": "Relation",
        "description": "The relation to check for the object",
        "placeholder": "viewer",
    },
    "write_user_namespace": {
        "title": "User namespace",
        "description": "The namespace for users in your tenant",
        "placeholder": "user",
    },
    "write_user_id": {
        "title": "User ID",
        "description": "The ID of the user against which to check",
        "placeholder": "213",
    },
    "zookie": {
        "title": "Zookie",
        "description": "The opaque token that signifies a read should be as fresh as the write that produced this token.",
        "placeholder": "someopaquevalue"
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "updates": [
             {
                 "operation": 1,
                 "tuple": {
                     "object_and_relation": {
                         "namespace": "$tenantslug/$write_namespace",
                         "object_id": "$write_object_id",
                         "relation": "$write_relation"
                     },
                     "user": {
                         "userset": {
                             "namespace": "$tenantslug/$write_user_namespace",
                             "object_id": "$write_user_id",
                             "relation": "..."
                         }
                     }
                 }
             }
         ]
     }' \
    grpc.authzed.com:443 authzed.api.v0.ACLService.Write
```

</ApiSample>
</ApiExample>

## NamespaceService.ReadConfig

A read namespace configuration request is used to read the current configuration for a [namespace] in an Authzed [Tenant].

[namespace]: /v0/concepts#namespaces
[Tenant]: /v0/concepts#tenant

### Request

#### Parameters

:::note
It is recommended to specify the `at_revision` [Zookie] value, which will return the namespace's configuration as of the logical timestamp represented by that Zookie.
:::

[Zookie]: /v0/concepts#zookies

| Name           | Type                  | Required             |
| ------------   | --------------------- | -------------------- |
| `namespace`    | `string`              | Yes                  |
| `at_revision`  | `Zookie`              | No (but recommended) |

#### Request Definition

```proto
message ReadConfigRequest {
    string namespace = 1;
    Zookie at_revision = 2;
}
```

#### Request Example

```proto
{
    namespace: "mynotetakingapp/note"
    at_revision: { token: "CAESAggB" }
}
```

### Response

#### Response Definition

```proto
message ReadConfigResponse {
    string namespace = 1;
    NamespaceDefinition config = 2;
    Zookie revision = 4;
}
```

#### Response Example

```proto
{
    namespace: "mynotetakingapp/note"
    revision: { token: "GeFSffcB" }
    config: {
        name: "mynotetakingapp/note"
        relation: [
            {
                name: "viewer"
            }
            ... // Elided for brevity
        ]
    }
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate
- **NOT_FOUND**: the namespace being requested does not exist
- **OUT_OF_RANGE**: the specified zookie is too old to be used

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "namespace": {
        "title": "Namespace",
        "description": "The namespace to be read",
        "placeholder": "resource",
    },
    "zookie": {
        "title": "Zookie",
        "description": "The opaque token that signifies a read should be as fresh as the write that produced this token.",
        "placeholder": "someopaquevalue"
    }
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "namespace": "$tenantslug/$namespace",
         "at_revision": { "token": "$zookie" }
     }' \
    grpc.authzed.com:443 authzed.api.v0.NamespaceService.ReadConfig
```

</ApiSample>
</ApiExample>

## NamespaceService.WriteConfig

A write namespace configuration request is used to create or updated the configuration for a [namespace] in an Authzed [Tenant].

Writing a namespace configuration is typically the first API call made to Authzed after the creation of a tenant.

:::warning
Note that a write namespace configuration will overwrite any existing namespace
with the same name in the tenant.
:::

[namespace]: /v0/concepts#namespaces
[Tenant]: /v0/concepts#tenant

### Request

#### Parameters

| Name           | Type                  | Required             |
| ------------   | --------------------- | -------------------- |
| `config`       | `NamespaceDefinition` | Yes                  |

#### Request Definition

```proto
message WriteConfigRequest {
    NamespaceDefinition config = 2;
}

message NamespaceDefinition {
    string name = 1;
    repeated Relation relation = 2;
}
```

<details>
<summary>Remaining Protocol Buffers for definining namespaces</summary>
<div>

```proto
message Relation {
    string name = 1;
    UsersetRewrite userset_rewrite = 2;
}

message UsersetRewrite {
    oneof rewrite_operation {
        SetOperation union = 1;
        SetOperation intersection = 2;
        SetOperation exclusion = 3;
    }
}

message SetOperation {
    message Child {
        message This {}

        oneof child_type {
            This _this = 1;
            ComputedUserset computed_userset = 2;
            TupleToUserset tuple_to_userset = 3;
            UsersetRewrite userset_rewrite = 4;
        }
    }

    repeated Child child = 1;
}

message TupleToUserset {
    message Tupleset { string relation = 1; }

    Tupleset tupleset = 1;
    ComputedUserset computed_userset = 2;
}

message ComputedUserset {
    enum Object { TUPLE_OBJECT = 0; TUPLE_USERSET_OBJECT = 1; }

    Object object = 1;
    string relation = 2;
}
```

</div>
</details>

#### Request Example

```proto
{
    config: {
        name: "tenantslug/document"
        relation: [
            {
                name: "viewer"
            }
        ]
    }
}
```

### Response

The response of a write namespace configuration call will contain the initial [Zookie] for the namespace.

[Zookie]: /v0/concepts#zookies

#### Response Definition

```proto
message WriteConfigResponse { Zookie revision = 1; }

message Zookie { string token = 1; }
```

#### Response Example

```proto
{
    revision { token: "CAESAggB" }
}
```

#### Errors

- **INVALID_ARGUMENT**: a provided value has failed to semantically validate

For more generic failures, see the [gRPC Status Code documentation].

[gRPC Status Code documentation]: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md

### Code Samples

<ApiExample parameters={{
    "namespace": {
        "title": "Namespace",
        "description": "The namespace to be written",
        "placeholder": "resource",
    },
    "relation_name": {
        "title": "Relation Name",
        "description": "The name of a relation for the namespace",
        "placeholder": "viewer",
    },
}}>
<ApiSample language="grpcurl">

```
grpcurl -rpc-header "authorization: Bearer $token" -d \
    '{
         "config": {
             "name": "$tenantslug/$namespace",
             "relation": [
                 { "name": "$relation_name" }
             ]
         }
     }' \
    grpc.authzed.com:443 authzed.api.v0.NamespaceService.WriteConfig
```

</ApiSample>
</ApiExample>
