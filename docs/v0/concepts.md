# API v0 Concepts

:::note
This page makes use of Zanzibar terminology and namespace configuration.
:::

## Users

A `user` defines a non-automated, real-life human that is accessing or making using of the Authzed API to check permissions, add tuples, or write/update [namespaces].

:::important
If an automated process or system is accessing the API, we recommend using a [client] instead.
:::

### Creating a user

A user can be "created" by logging into the Authzed Management Dashboard

### User Tokens

Users contain one or more [tokens], which are used to authenticate to the Authzed API on behalf of a client. A token can be added to a User in the Authzed Management Dashboard, under the `User Tokens` section (click on your user icon in the upper right hand corner).

### Using a User Token

To use a user token to authenticate to the Authzed API, place the token into the configuration of the client library being used. If making use of gRPC directly, the token can be passed via the `access_token`.

[namespaces]: #namespaces
[client]: #clients
[tokens]: #tokens

## Tenant

A `Tenant` is a logical grouping of [Namespaces], [Clients] and [Tokens].

Tenants typically represent a single application or set of microservices, that will all share the same permissions model.

### Tenant Slug

Tenants have a **globally unique** name called a `slug`, which is also used as the prefix for all [Namespaces] defined underneath that tenant.

For example, a tenant with the slug `myapplication`, might have namespaces:

- `myapplication/resource`
- `myapplication/group`
- `myapplication/user`

:::important
Since tenant slugs are globally unique, we recommend using a descriptive slug, such as your company name followed by the application name.
:::

### Tenant Kinds

Tenants can be defined as either `Development` or `Production` tenants.

A Development tenant allows for easy resetting of the entire tenant's [Namespaces] and [Tuples], and has limits on the numnber of tuples allowed and API calls made.

A Production tenant has no restrictions on API call or tuple count, but cannot be one-click cleared.

| Kind        | Easy To Clear | API and Tuple Limits |
| ----------- | ------------- | -------------------- |
| Development | Yes           | *Limited*            |
| Production  | *No*          | Unlimited            |


### Creating a Tenant

A tenant can be created in the `Tenants` section of the Authzed Management Dashboard.

### Using a Tenant

To make API calls to a Tenant, a [token] with permission on the tenant is required. Tokens can be created under [Clients] or [Users], and can be granted permissions on the tenant in the Authzed Management Dashboard.

[Namespaces]: #namespaces
[Tuples]: #tuples
[Clients]: #clients
[Tokens]: #tokens
[token]: #tokens
[Users]: #users

## Clients

A `client` defines an *automated system or tool* that is accessing or making using of the Authzed API to check permissions, add tuples, or write/update [namespaces].

### Creating a client

A client can be created in the `Clients` section of the Authzed Management Dashboard.

### Client Tokens

Clients contain one or more [tokens], which are used to authenticate to the Authzed API on behalf of a client. A token can be added to a Client in the Authzed Management Dashboard.

### Using a Client Token

To use a client token to authenticate to the Authzed API, place the token into the configuration of the client library being used. If making use of gRPC directly, the token can be passed via the `access_token`.

[namespaces]: #namespaces
[tokens]: #tokens

## Tokens

A `token` is an authentication token to the Authzed API.

Tokens are created under [Clients] or [Users] and are given to the API to act on behalf of the client or user.

### Creating a token

See [Clients] or [Users] on how to create tokens for clients or users, respectively.

:::warning
Tokens are **not stored by Authzed**.
When creating a token **make sure to copy and save it somewhere safe**, as we will not be able to give it to you again.
:::

### Using a token

To use a token to authenticate to the Authzed API, place the token into the configuration of the client library being used. If making use of gRPC directly, the token can be passed via the `access_token`.

### Assignment permissions to a token

To grant a token the ability to read, write or admininister a [Tenant], add the [client] or [user] to the Tenant's permissions in the Authzed Management Dashboard.

[Tenant]: #tenants
[Clients]: #clients
[client]: #clients
[Users]: #users
[user]: #users

## Namespaces

Namespaces are the top-level construct within Authzed.

A `namespace` defines a class of object (such as a resource or user or group), and an optional grouping of permissions data called a [relation].

[Relations] are a grouping of attributes attached to items (called [tuples]), along with the policy of how to resolve answer permissions questions (how to resolve [check] requests).

Examples include resources, users, groups, documents, or any kind of object either being protected or for whom something is being protected.

:::warning
The concept of a namespace has been deprecated in favor of Object Definitions in Schemas (which are equivalent).

Even if you are using the v0 API, you likely want to use the v1 Schema API rather than Namespaces directly.

Read the updated [developing schema] guide to learn more.
:::

[relation]: #relations
[relations]: #relations
[tuples]: #tuples
[check]: /v0/api#aclservicecheck
[developing schema]: /guides/schema

## Relations

A `Relation` is a defined name in a [Namespace] that indicates the relationship between two `objects`.

Typically a relation is used to represent a role (such as `read` or `write`) between a resource object (e.g. a document) and a user, indicating that the user has that role on the object.

Relations are also used to represent non-role based relationships between objects, such as a user belonging to a group.

### Defining a relation

A relation is defined in a [Namespace]:

```proto
name: "thetenant/myresource"

relation { name: "thenameoftherelation" }
```

#### Relation rules

By default, a relation is resolved in [Check] and [Expand] by only returning the [tuples] found directly on the relation.

Relations can have their rules changed, however, by defining a `userset_rewrite` under the relation:

```authzed
relation {
    name: "read"

    userset_rewrite {
      union {
        child { _this {} }
        child {
          computed_userset { relation: "write" }
        }
     }
    }
}
```

In the above example, the relation `read` has its userset redefined to be the `union` of `_this` (the relation itself) and the userset from `write`, which indicates that all users granted `write` permission should also be granted, implicitly, the `read` permission as well.

### Objects

An `object` is the item "stored under" a relation by [Writing] a [tuple] with that relation and object ID.

For example, given a resource "myresource" with object ID `myresource`, we could write that it is under an organization by writing a tuple such as:

```
thetenant/organization:theorganization#resource@thetenant/resource:myresource#...
```

In the above example tuple, `theorganization` and `myresource` are the objects, with `theorganization` being an object of the namespace `organization`, and `myresource` being an object of the namespace `resource`.

### The `...` relation

The `...` relation is a special relation *implicitly defined* on all [namespaces].

It is used to reference a namespace as a whole, typically when you have a namespace defined to represent a user or resource and want to include that user or resource in another relation.

[Check]: /v0/api#aclservicecheck
[Expand]: /v0/api#aclserviceexpand
[tuples]: #tuples
[tuple]: #tuples
[Namespace]: #namespaces
[Namespaces]: #namespaces
[Writing]: #writing-tuples

## Userset Rewrites

A `userset_rewrite` rule can be thought of an override: It indicates to Authzed how to compute the set of userset tuples reachable from a relation.

To begin, let's take our existing `reader` relation and add a `userset_rewrite`:

```proto
name: "example/document"

relation {
    name: "reader"
    userset_rewrite {
        union {
            child { _this {} } # Indicates that `reader` can have its own tuples.
        }
    }
}

relation {
    name: "writer"
}
```

In the above, we add a `userset_rewrite` with a `union` rule, which tells Authzed to union together all the users found for each child rule.

The first rule we add is `_this`, which indicates to Authzed that `reader` should always include **its own** usersets (since we are defining validation tuples for it).

Next, we want to include all the usersets found in `writer` as well. We do so by adding another `child` to the `union` block with a `computed_userset` pointing to `writer`:

```proto
name: "example/document"

relation {
    name: "reader"
    userset_rewrite {
        union {
            child { _this {} } # Indicates that `reader` can have its own tuples.
            child { computed_userset { relation: "writer" } } # + those from `writer`.
        }
    }
}

relation {
    name: "writer"
}
```

### tuple_to_userset

`tuple_to_userset` provides a means of "walking" across one relation to another namespace, and the other relation within.

For example, to walk from a document's organization to the organization's admins:

```proto
name: "example/organization"

relation { name: "admin" }
```

```proto
name: "example/document"

relation {
    name: "docorg"
}

relation {
    name: "reader"
    userset_rewrite {
        union {
            child { _this {} } # Indicates that `reader` can have its own tuples.
            child { computed_userset { relation: "writer" } } # + those from `writer`.
        }
    }
}

relation {
    name: "writer"
    userset_rewrite {
        union {
            child { _this {} } # Indicates that `writer` can have its own tuples.
            child {
              tuple_to_userset {
                tupleset { relation: "docorg" } # Walk from document->organization
                computed_userset {
                  object: TUPLE_USERSET_OBJECT
                  relation: "admin"
                }
              }
            } # + those from `admin` on the organization
        }
    }
}
```

Because of how verbose `tuple_to_userset` is, we'll break down the example piece by piece:

The first child of `tuple_to_userset` is a `tupleset`, which indicates the `relation` to "walk" from the current object (in this case: `document`).
Here the `tupleset` and its `relation` indicates we want Authzed to "walk" from the document to any subjects found via the `docorg` relation.

:::info
Note that the walk does not specify the **target namespace**: This means if objects under two namespaces are referenced via the `docorg` relation, the "walk" will succeed across **both**.

Using a unique name for relations referenced by `tuple_to_userset` is therefore a really good practice.
:::

The second child of `tuple_to_userset` is a `computed_userset`; it is very similar to the one used above for implicitly defining that all readers are writers, with one extra piece: we specify an explicit `object` as `TUPLE_USERSET_OBJECT`.
This is necessary to indicate to Authzed that the relation within the `computed_userset` should be checked on the **result** of the "walk", rather than the original object.

:::note
No other values are supported here, so just always specify `TUPLE_USERSET_OBJECT` when using `tuple_to_userset`
:::

## Tuples

A `Tuple` is a representation of data and how it is stored in Authzed. All permissions and relationships between [objects] are stored in Authzed via tuples.

At its core, a Tuple is simply a representation of four pieces of information:

1. A [namespace]
2. An [object]
3. A [relation]
4. A user to which the object, via the relation, is linked in some way (the meaning of which is up to you)

### Compact Form

Tuples are typically represented in a compact form like so:

```
thetenant/namespace:object#relation@{user}
```

Since user is, itself, an object, we use a partial tuple for it as well:

```
thetenant/user:someusername#...
```

This results in our overall tuple:
```
thetenant/namespace:object#relation@thetenant/user:someusername#...
```

:::tip
The `...` relation is a special implicitly defined relation on all namespaces
:::

### What it represents

A tuple represents a link between one object and another, via the specified relation.

#### Example 1

For example, the tuple `thetenant/namespace:object#relation@thetenant/user:someusername#...` translates to:

> Object `object`, under namespace `thetenant/namespace` is related to the user `thetenant/user:someusername#...` via relation `relation`.

#### Example 2

As another example, the tuple `thetenant/document:mydocument#read@thetenant/user:someusername#...` translates to:

> Object `mydocument`, under namespace `thetenant/document` can be `read` by `thetenant/user:someusername#...`

| Namespace                            | Object         | Relation   | Target (User)                         |
| ------------------------------------ | ---------------| ---------- | ---------------------------- |
| `thetenant/document` | `mydocument` | `read`     | `thetenant/user:someusername#...` |


#### Example 3

As a third example, the tuple `thetenant/group:mygroup#member@thetenant/group:anothergroup#...` translates to:

> The group `anothergroup` is a `member` of the group `mygroup`

| Namespace                            | Object         | Relation   | Target (User)                         |
| ------------------------------------ | ---------------| ---------- | ---------------------------- |
| `thetenant/group` | `mygroup` | `member`     | `thetenant/group:anothergroup#...` |

[namespace]: #namespaces
[relation]: #relations
[objects]: #relations
[object]: #relations

## Writing Tuples

:::note
This page makes use of Zanzibar terminology and namespace configuration. Please refer to the [current Authzed terminology](/concepts/terminology) and schema configuration.
:::

The Authzed API supports two operations to update [tuples] in the system: `Write` and `Delete`. Both operations exist under the same call.

#### Create

The `Create` operation is used to create new [tuples] in the Authzed data layer, thereby defining relationships between objects.

#### Delete

The `Delete` operation is used to remove [tuples] from the Authzed data layer

#### Touch

The `Touch` operation is a special operation which will perform an upsert-like operation, inserting a new tuple if one doesn't exist and updating the transaction-time on a tuple if it does.

:::warning
Since `Touch` requires checking if a tuple exists and, if present, updating its transaction-time by re-inserting it if it does, it is a much heavier operation than a simple `Create`.
`Touch` should only be used for operations where a tuple needs to be marked as "fresh".
:::

### Calling the Write API

To change one or more tuples, issue a `WriteRequest` API call:

```proto
WriteRequest {
    updates {
        ...
    }
}
```

Each `update` consists of an operation to perform (`CREATE`, `DELETE` or `TOUCH`) and the tuple to update:

```proto
WriteRequest {
    updates {
        RelationTupleUpdate {
            operation: CREATE
            tuple: RelationTuple { .... }
        }
        RelationTupleUpdate {
            operation: DELETE
            tuple: RelationTuple { .... }
        }
    }
}
```

The result of the write (if it succeeds) contains a [Zookie].

### Preconditions

The `Write` API supports a section called `write_conditions`, which is a list of [tuples] that *must* exist in Authzed before the updates will occur; if any of the tuples are missing, the write will fail with an error code. Preconditions are typically used as a locking mechanism, to ensure distributed writers can coordinate.

Example:

```proto
WriteRequest {
    write_conditions {
        RelationTuple { .. must exist .. }
    }
    updates {
        RelationTupleUpdate {
            operation: CREATE
            tuple: RelationTuple { .... }
        }
        RelationTupleUpdate {
            operation: DELETE
            tuple: RelationTuple { .... }
        }
    }
}
```

[tuples]: #tuples
[Zookie]: #zookies

## Zookies

A `Zookie` is an opaque cookie passed to and from the Authzed API to ensure that permissions are not stale when checked against specific objects.

Zookies are passed from [Write] calls to clients and sent back from clients to Authzed in [Check] and [Expand] calls.

### Why is a Zookie needed?

A Zookie is necessary for Authzed to ensure that the [New Enemy Problem] cannot occur.

:::info
Zookies also allow Authzed to optimize the lookup of permissions: if the relations or objects have not changed in some time and by knowing that we have the sufficiently fresh copy of the permissions in a local cache, Authzed can use the cache rather than fetching from another node.
:::

### Storing and Using Zookies

It is generally recommend to store the Zookie returned by `Write` next to the object in your own database, and then to give it back to the Authzed API on all `Check` and `Expand` calls for that object.

[Check]: /v0/api#aclservicecheck
[Expand]: /v0/api#aclserviceexpand
[Write]: #writing-tuples
[New Enemy Problem]: /reference/glossary.md#new-enemy-problem
