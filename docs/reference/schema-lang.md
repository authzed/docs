# Schema Language

import {InlinePlayground} from '../../src/components/InlinePlayground';

## Overview

The **Schema** of [SpiceDB] or a Permissions System in [Authzed] defines the types of objects found, how those objects relate to one another, and the permissions that can be computed off of those relations.

The Schema Language's extension for use on a file system is `.zed`

[SpiceDB]: https://github.com/authzed/spicedb
[Authzed]: https://app.authzed.com

## Definitions

The top level of a Schema consists of zero or more object `definition`s, which define the types exposed in the permissions system.

It might help to think about Object Definitions as similar to a class definition in an Object Oriented programming language.

If being used with Authzed, the name of each Object Definition is prefixed with the Permissions System to which it will be applied.
This is done to make all Object names globally unique in Authzed.

For SpiceDB, prefixes can be used to logically group types, but are otherwise unnecessary.

```zed
/**
 * sometype is some type that I've decided to define
 */
definition sometype {}
```

:::note
Note that the examples are unprefixed. You'll need to add the prefix from your permissions system if calling `WriteSchema` for a permissions system hosted in Authzed.
:::

## Relations

A `relation` defines how two objects (or an object and subject) can relate to one another.
For example, a `reader` on a document, or a `member` of a group.

Relations are always defined with a *name* and one (or more) allowed *types* of objects that can be the subjects of that relation:

```zed
/**
 * user represents a user
 */
definition user {}

/**
 * document represents a document in the system
 */
definition document {
    /**
     * reader relates a user that is a reader on the document
     */
    relation reader: user
}
```

:::info
In the above example, the `user` on `reader` does not contain a sub-relation

Occasionally you will see a subject which has a sub-relation such as `usergroup:admins#members` which refers not just to the `usergroup` as a whole, but the set of members which have that relation to the `usergroup`.
:::

### Subrelations

Relations can also "contain" references to other relations/permissions.
For example, a group's `member` relation might include the set of objects marked as `member` of another group, indicating that the other group's members are, themselves, members of this group:

```zed
definition user {}

definition group {
    /**
     * member can include both users and *the set of members* of other specific groups.
     */
    relation member: user | group#member
}
```

### Wildcards

Relations can also specify wildcards to indicate that a grant can be made to the resource *type* as a whole, rather than a particular resource. This allows *public* access to be granted to a particular subject type.

For example, a `viewer` might indicate that *all* users can be granted the ability to view the resource:

```zed
definition sysprefix/user {}

definition sysprefix/resource {
    /**
     * viewer can be granted to a specific user or granted to *all* users.
     */
    relation viewer: sysprefix/user | sysprefix/user:*
}
```

To be made public, the wildcard relationship would be written linking the specific document to *any* user:

```relationship
sysprefix/resource:someresource viewer sysprefix/user:*
```

Now *any* user is a `viewer` of the resource.

:::warning
Be **very careful** with wildcard support in your schema! **Only** grant it to read permissions, unless you intend to allow for universal writing.
:::

### Naming Relations

Relations define how one object relates to another object/subject, and thus **relations should be named as adjectives**, read as `{relation name} (of the object)`.

Examples:

| Name     | Read as                |
| -------- | ---------------------- |
| `reader` | reader of the document |
| `writer` | writer of the document |
| `member` | member of the group    |
| `parent` | parent of the folder   |

## Permissions

A `permission` defines a *computed set of subjects* that have a permission of some kind on the parent object. For example, is a user within the set of users that can `edit` a document.

Permissions are always defined with a *name* and an *expression* defining how that permission's allowed set of subjects is computed:

```zed
definition user {}

definition document {
    relation writer: user
    relation reader: user

    /**
     * edit determines whether a user can edit the document
     */
    permission edit = writer

    /**
     * view determines whether a user can view the document
     */
    permission view = reader + writer
}
```

### Operations

Permissions support four kinds of operations: **union**, **intersection**, **exclusion** and **arrow**.

#### `+` (Union)

Unions together the relations/permissions referenced

Union is the most common operation and is used to join different relations or permissions together to form a set of allowed subjects.

For example, to grant a permission to both the `reader`s and `writer`s of a document:

```zed
permission combined = reader + writer
```

#### `&` (Intersection)

Intersects the set of subjects found for the relations/permissions referenced

Intersection allows for a permission to only include those subjects that were found in **both** relations/permissions.

For example, to grant a permission to a user that is both a `reader` and a `writer` of a document:

```zed
permission read_and_write = reader & writer
```

#### `-` (Exclusion)

Excludes the set of subjects found for the right side relation/permission from those found in the left side relation/permission

Exclusion allows for computing the difference between two sets of relations/permissions

For example, to grant a permission to a user that is `reader` but not the `writer` of a document:

```zed
permission can_only_read = reader - writer
```

#### `->` (Arrow)

Arrows allow for "walking" the heirarchy of relations (and permissions) defined for an object, referencing a permission or relation on the *resulting* object.

For example, imagine a schema where a document is found under a folder:

```zed
definition user {}

definition folder {
    relation reader: user
}

definition document {
    /**
     * parent_folder defines the folder that holds this document
     */
    relation parent_folder: folder
}
```

We likely want to allow any `reader` of the folder to **also** be a reader of the document.

To accomplish this, we can use the arrow operator to walk to the `parent_folder`'s `read` permission, thus including any subjects found there as well:

```zed
definition user {}

definition folder {
    relation reader: user
    permission read = reader
}

definition document {
    relation parent_folder: folder

    /**
     * read defines whether a user can read the document
     */
    permission read = parent_folder->read
}
```

The expression `parent_folder->read` indicates to "walk" from the `parent_folder` of the `document`, and then to include the subjects found for the `read` permission of that folder.

Making use of a `union`, we can also include the local `reader` relation, allowing the `read` permission on a document can check whether a user is a `reader` of a document or a `reader` of its parent folder.

```zed
definition user {}

definition folder {
    relation reader: user
    permission read = reader
}

definition document {
    relation parent_folder: folder
    relation reader: user

    /**
     * read defines whether a user can read the document
     */
    permission read = reader + parent_folder->read
}
```

:::note
It is *recommended* that the right side of all arrows refer to **permissions**, instead
of relations. This allows for easy nested computation, and is more readable.
:::

### Naming Permissions

Permissions define a set of objects that can perform an action or have some attribute, and thus **permissions should be named as verbs or nouns**, read as  `(is/can) {permission name} (the object)`.

Examples:

| Name     | Read as                 |
| -------- | ----------------------- |
| `read`   | can read the object     |
| `write`  | can write the object    |
| `delete` | can delete the object   |
| `member` | is member of the object |

:::note
You'll note that we also used `member` above in the relation example. Defining `member` as a **permission** might be found when you have multiple "ways" a subject can be a member of a resource, thus changing it from a simple relation to a *computed* set of subjects.
:::

## Comments

### Documentation Comments

:::note
It is **highly** recommended to put doc comments on all definitions, relations and permissions.
:::

```zed
/**
 * something has some doc comment
 */
```

### Non-doc comments

```zed
// Some comment
/* Some comment */
```

## Full Example

<InlinePlayground reference="vlduOcwEOmVY"/>

## Common Patterns

### Group membership

Apply specific users or members of a group to a permission on an object type.

In this example, a group can have users as admins and as members.
Both admins and members are considered to have membership in the group.
A role can be applied to individual users and groups.
All individually applied users as well as members for applied groups will have the `allowed` permission.

<InlinePlayground reference="CNe3PXNuhypm"/>

### Global admin permissions

Given an organizational hierarchy of objects where (regular) admin users may exist for a single level of the hierarchy, apply permissions for a set of super-admin users that span across all levels of the hierarchy.

In lieu of adding a <code>super_admin</code> relation on every object that can be administered, add a root object to the hierarchy, in this example <code>platform</code>.
Super admin users can be applied to <code>platform</code> and a relation to <code>platform</code> on top level objects.
Admin permission on resources is then defined as the direct owner of the resource as well as through a traversal of the object hierarchy to the platform super admin.

<InlinePlayground reference="m1lRfaaYf9XP"/>

### Synthetic relations

Relation traversals can be modeled using intermediate, synthetic relations.

Given the example hierarchy, portfolio can have folders, folders can have documents, we’d like a viewer of a portfolio to also be able to read documents contained in its folders.
The read on documents could be thought of as:

```
reader + parent_folder->reader + parent_folder->parent_portfolio->read
```

Synthetic relations can simulate multiple walks across permissions and relations.

<InlinePlayground reference="_VZkOgNX6xfw" />

### Recursive permissions

Given a nested set of objects, apply a permission on an object to its descendant objects.

In this example, a folder can have users with read permission.
Additionally, users that can read the parent folder can also read the current folder.
Checking read permission on a folder will recursively consider these relations as the answer is computed.

<InlinePlayground reference="8tE13O7iMM8W"/>

:::note
Note that since `parent->read` calls the same `read` permission, it will form a recursive
lookup across the chain of parent folder(s).
:::

### Recursive permissions across different resource types

If a non-recursive resource is used as the starting point for a recursive lookup, it is
**very important** that the permission name used on the right side of the arrow is the **same** in both the starting resource type and the parent resource type(s):

<InlinePlayground reference="EWVhjM3vGxE6"/>

## Try it out

Try the schema Language out now in the [Authzed Playground]

[Authzed Playground]: https://play.authzed.com
