# Caveats (Experiment)

:::warning
Caveats are currently marked as **experimental** and should not be used in production yet. Tooling also does not currently support caveats.
:::

## Getting Started

The caveats feature in SpiceDB is currently available at the HEAD revision on the main branch of SpiceDB:

```
git clone github.com/authzed/spicedb
git checkout main
cd cmd/spicedb
go build .
```

The feature can be enabled in any running SpiceDB instance by use of the flag or the environmental variable:

```
spicedb serve --experiment-enable-caveats=true …
```

Or

```
SPICEDB_EXPERIMENT_ENABLE_CAVEATS=true spicedb serve …
```

## Defining Caveats

Caveats are named expressions that can be defined in schema via the **WriteSchema** call, alongside the `definition`s for object types.

A `caveat` is defined with a name, one or more well-typed parameters, and an expression, which is a CEL ([https://github.com/google/cel-spec](https://github.com/google/cel-spec)) expression returning a boolean value:

```zed
caveat my_caveat(first_parameter int, second_parameter string) {
  first_parameter == 42 && second_parameter == "hello world"
}
```

### Parameter Types

The supported parameter types can be found at [https://github.com/authzed/spicedb/blob/main/pkg/caveats/types](https://github.com/authzed/spicedb/blob/main/pkg/caveats/types), and are currently:

<table>
  <tr>
   <td><strong>Type</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>any</code>
   </td>
   <td>Any value is allowed. Useful if you have a variant type.
   </td>
  </tr>
  <tr>
   <td><code>int</code>
   </td>
   <td>64-bit signed integer
   </td>
  </tr>
  <tr>
   <td><code>uint</code>
   </td>
   <td>64-bit unsigned integer
   </td>
  </tr>
  <tr>
   <td><code>bool</code>
   </td>
   <td>Boolean
   </td>
  </tr>
  <tr>
   <td><code>string</code>
   </td>
   <td>String
   </td>
  </tr>
  <tr>
   <td><code>double</code>
   </td>
   <td>Double-width float type
   </td>
  </tr>
  <tr>
   <td><code>bytes</code>
   </td>
   <td>A byte string
   </td>
  </tr>
  <tr>
   <td><code>duration</code>
   </td>
   <td>A duration of time
   </td>
  </tr>
  <tr>
   <td><code>timestamp</code>
   </td>
   <td>A timestamp in time (usually UTC)
   </td>
  </tr>
  <tr>
   <td><code>list&lt;T></code>
   </td>
   <td>A generic list of values of another type
   </td>
  </tr>
  <tr>
   <td><code>map&lt;T></code>
   </td>
   <td>A generic map of values of another type.
NOTE: all keys must be strings
   </td>
  </tr>
  <tr>
   <td><code>ipaddress</code>
   </td>
   <td>A custom type implemented by SpiceDB representing an IP Address
   </td>
  </tr>
</table>

### Some Examples

#### Basic comparison

```zed
caveat is_tuesday(today string) {
   today == 'tuesday'
}
```

#### Attribute Matching

The example below defines a caveat that requires that any expected attributes found within the expected map are a subset of the attributes in the provided map:

```zed
caveat attributes_match(expected map<any>, provided map<any>) {
   expected.isSubtreeOf(provided)
}
```

#### IP address checking

The example below defines a caveat that requires that a user’s IP address is within a specific CIDR range:

```zed
caveat ip_allowlist(user_ip ipaddress, cidr string) {
  user_ip.in_cidr(cidr)
}
```

## Allowing caveats on relations

To allow a caveat to be used when writing a relationship, the caveat must be specified on the relation within the schema via the **with** keyword:

```zed
definition resource {
  relation viewer: user | user with ip_allowlist
}
```

In the above example, a relationship can be written for the `viewer` relation to a `user` without a caveat OR with the `ip_allowlist` caveat.

To make the caveat **required**, the `user |` can be removed.

## Writing relationships with caveats and context

When writing a relationship for a relation, both the caveat and a portion of the “context” can be specified:

```
WriteRelationshipsRequest {
  Updates: [
    RelationshipUpdate{
      Operation: CREATE
      Relationship: {
        Resource: …,
        Relation: "viewer",
        Subject: …,
        OptionalCaveat: {
           CaveatName: "ip_allowlist",
           Context: structpb{
              "cidr": "1.2.3.0"
           }
        }
      }
    }
  ]
}
```

A few important notes:

- The **Context** of a caveat is defined both by the values written in the `Relationship`, as well as those provided in the `CheckPermissionRequest`: if empty, then only the context specified on a CheckPermission request will be used. Otherwise, the values in the `Relationship` take precedence over those in the `CheckPermissionRequest`.
  - Context of a caveat provided in `Relationship` is stored alongside the relationship and is provided to the caveat expression at runtime. This allows for **partial** binding of data at write time.
- The Context is a `structpb`, which is defined by Google and represents JSON-like data: [https://pkg.go.dev/google.golang.org/protobuf/types/known/structpb](https://pkg.go.dev/google.golang.org/protobuf/types/known/structpb)
  - To send 64-bit integers, encode them as strings.
- A relationship cannot be duplicated, with or without a caveat, e.g. two relationships that differ only on their use of a caveat cannot both exist.
- When deleting a relationship, a caveat does not need to be specified; the matching relationship will be deleted if present.

## Issuing checks

When issuing a **CheckPermission** request, additional caveat context can be specified to represent the known context at the time of the check:

```
CheckPermissionRequest {
  Resource: …,
  Permission: …,
  Subject: …,
  Context: {
    "user_ip": "1.2.3.4"
  }
}
```

The check engine will automatically apply the context found on the relationships, as well as the context provided by the **CheckPermission** call, and return one of three states ([https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.CheckPermissionResponse.Permissionship](https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.CheckPermissionResponse.Permissionship)):

- `PERMISSIONSHIP_NO_PERMISSION` - The subject does not have the permission on the resource.
- `PERMISSIONSHIP_HAS_PERMISSION` - The subject has permission on the resource.
- `PERMISSIONSHIP_CONDITIONAL_PERMISSION` - **SpiceDB was missing context information to fully determine whether the subject has permission.**

In the case of `PERMISSIONSHIP_CONDITIONAL_PERMISSION`, SpiceDB will also return the missing context fields in the **CheckPermissionResponse** so the caller knows what additional context to fill in if they wish to rerun the check and get a determined answer.

## LookupResources and LookupSubjects

Similarly to **CheckPermission**, both **LookupResources** and **LookupSubjects** can be provided with additional context and will return one of the two permission states for each of the results found (either has permission or conditionally has permission).

## Full Example

A full example of a schema with caveats can be found below, which allows users to `view` a resource if they are directly a `viewer` or they are a`viewer` within the correct IP CIDR range:

### Schema

```zed
definition user {}

caveat has_valid_ip(user_ip ipaddress, allowed_range string) {
  user_ip.in_cidr(allowed_range)
}

definition resource {
    relation viewer: user | user with has_valid_ip
    permission view = viewer
}
```

### Write Relationships

```
WriteRelationshipsRequest {
  Updates: [
    RelationshipUpdate{
      Operation: CREATE
      Relationship: {
        Resource: {
            ObjectType: "resource",
            ObjectId: "someresource",
        },
        Relation: "viewer",
        Subject: {
            ObjectType: "user",
            ObjectId: "sarah",
        },
        OptionalCaveat: {
           CaveatName: "has_valid_ip",
           Context: structpb{
              "allowed_range": "10.20.30.0",
           }
        }
      }
    }
  ]
}
```

### Check Permission

```
CheckPermissionRequest {
    Resource: {
        ObjectType: "resource",
        ObjectId: "someresource",
    },
    Permission: "view",
    Subject: {
        ObjectType: "user",
        ObjectId: "sarah",
    },
    Context: {
        "user_ip": "10.20.30.42",
    }
}
```

## Known Limitations

Below are known limitations of the current implementation which will be completed in the near future:

- The **zed** command line tool does not currently support Caveats.
- The Authzed Playground does not currently support Caveats.
- The development API does not currently support Caveats.
