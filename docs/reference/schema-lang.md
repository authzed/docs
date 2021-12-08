# Schema Language

import {InlinePlayground} from '../../src/components/InlinePlayground';

## Overview

The *Schema Language* is a language for specifying the `definition`s of object types, their `relation`s to one another, and the `permission`s they expose as part of a *Permissions System*.

The Schema Language's extension for use on a file system is `.zed`

## Definitions

The top level of a Schema consists of zero or more Object `definition`s, which define the types exposed in the permissions system.

It might help to think about Object Definitions as similar to a class definition in an Object Oriented programming language.

The name of each Object Definition is prefixed with the Permissions System it will be applied to. This is done to make all Object names globally unique in Authzed.

```zed
/**
 * sometype is some type that I've decided to define
 */
definition sysprefix/sometype {}
```

:::note
Note that `sysprefix` is the prefix used in the examples. You'll need to replace it with the prefix from your permissions system.
:::

## Relations

A `relation` defines how two objects (or an object and subject) can relate to one another.
For example, a `reader` on a document, or a `member` of a group.

Relations are always defined with a *name* and one (or more) allowed *types* of objects that can be the subjects of that relation:

```zed
/**
 * user represents a user
 */
definition sysprefix/user {}

/**
 * document represents a document in the system
 */
definition sysprefix/document {
    /**
     * reader relates a user that is a reader on the document
     */
    relation reader: sysprefix/user
}
```

Relations can also "contain" references to other relations/permissions.
For example, a group's `member` relation might include the set of objects marked as `member` of another group, indicating that the other group's members are, themselves, members of this group:

```zed
definition sysprefix/user {}

definition sysprefix/group {
    /**
     * member includes both users and *all the members* of other groups.
     */
    relation member: sysprefix/user | sysprefix/group#member
}
```

:::info
`sysprefix/user` does not contain a sub-relation`

Occasionally you will see a subject which has a sub-relation such as `usergroup:admins#members` which refers not just to the `usergroup` as a whole, but the individual members which have that relation to the `usergroup`.
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

A `permission` defines a *computed set of objects* that have a permission of some kind on the parent object. For example, can a user `edit` a document.

Permissions are always defined with a *name* and an *expression* defining how that permission's allowed set of objects is computed:

```zed
definition sysprefix/user {}

definition sysprefix/document {
    relation writer: sysprefix/user
    relation reader: sysprefix/user

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

Union is the most common operation and is used to join different relations or permissions together to form a set of allowed objects.

For example, to grant a permission to both the `reader`s and `writer`s of a document:

```zed
permission combined = reader + writer
```

#### `&` (Intersection)

Intersects the set of objects found for the relations/permissions referenced

Intersection allows for a permission to only include those objects that were found in **both** relations/permissions.

For example, to grant a permission to a user that is both a `reader` and a `writer` of a document:

```zed
permission read_and_write = reader & writer
```

#### `-` (Exclusion)

Excludes the set of objects found for the right side relation/permission from those found in the left side relation/permission

Exclusion allows for computing the difference between two sets of relations/permissions

For example, to grant a permission to a user that is `reader` but not the `writer` of a document:

```zed
permission can_only_read = reader - writer
```

#### `->` (Arrow)

Arrows allow for "walking" the heirarchy of relations (and permissions) defined for an object, referencing a permission or relation on the *resulting* object.

For example, imagine a schema where a document is found under a folder:

```zed
definition sysprefix/user {}

definition sysprefix/folder {
    relation reader: sysprefix/user
}

definition sysprefix/document {
    /**
     * parent_folder defines the folder that holds this document
     */
    relation parent_folder: sysprefix/folder
}
```

We likely want to allow any `reader` of the folder to **also** be a reader of the document.
To accomplish this, we can use the arrow operator to walk to the `parent_folder`'s `reader` relation:

```zed
definition sysprefix/user {}

definition sysprefix/folder {
    relation reader: sysprefix/user
}

definition sysprefix/document {
    relation parent_folder: sysprefix/folder

    /**
     * read defines whether a user can read the document
     */
    permission read = parent_folder->reader
}
```

The expression `parent_folder->reader` indicates to "walk" from the `parent_folder` of the `document`, and then to include the objects found within `reader` of that folder.

Making use of a `union`, we can also include the *local* `reader` relation, allowing the `read` permission on a document can check whether a user is a `reader` of a document or a `reader` of its parent folder.

```zed
definition sysprefix/user {}

definition sysprefix/folder {
    relation reader: sysprefix/user
}

definition sysprefix/document {
    relation parent_folder: sysprefix/folder
    relation reader: sysprefix/user

    /**
     * read defines whether a user can read the document
     */
    permission read = reader + parent_folder->reader
}
```

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
You'll note that we also used `member` above in the relation example. Defining `member` as a **permission** might be found when you have multiple "ways" an object can be a member of another object, thus changing it from a direct relation to a computed set.
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

<InlinePlayground reference="Vwput-WCrLaz"/>

## Common Patterns

### Group membership

Apply specific users or members of a group to a permission on an object type.

<details>
    <summary>Example</summary>
    <p>
        In this example, a group can have users as admins and as members.
        Both admins and members are considered to have membership in the group.
        A role can be applied to individual users and groups.
        All individually applied users as well as members for applied groups will have the `allowed` permission.
    </p>

<InlinePlayground reference="CNe3PXNuhypm"/>
</details>

### Super-admin / site-wide permissions

Given an organizational hierarchy of objects where (regular) admin users may exist for a single level of the hierarchy, apply permissions for a set of super-admin users that span across all levels of the hierarchy.

<details>
    <summary>Example</summary>
    <p>
        In lieu of adding a <code>super_admin</code> relation on every object that can be administered, add a root object to the hierarchy, in this example <code>platform</code>.
        Super admin users can be applied to <code>platform</code> and a relation to <code>platform</code> on top level objects.
        Admin permission on resources is then defined as the direct owner of the resource as well as through a traversal of the object hierarchy to the platform super admin.
    </p>

<InlinePlayground reference="m1lRfaaYf9XP"/>
</details>

### Synthetic relations

Relation traversals can be modeled using intermediate, synthetic relations.

<details>
    <summary>Example</summary>
    <p>
        Given the example hierarchy, portfolio can have folders, folders can have documents, we’d like a reader of a portfolio to also be able to read documents contained in its folders.
        The read on documents could be thought of as:
    </p>
    <p>
        <code>
            reader + parent_folder-&gt;reader + parent_folder-&gt;parent_portfolio-&gt;reader
        </code>
    </p>
    <p>
        Synthetic relations can simulate multiple walks across permissions and relations.
    </p>

<InlinePlayground reference="O-Z9_Cd-f9K7" />
</details>

### Recursive permissions

Given a nested set of objects, apply a permission on the ancestors to its descendant objects.

<details>
    <summary>Example</summary>
    <p>
        In this example, a folder can have users with read permission.
        Additionally, users that can read the parent folder can also read the current folder.
        Checking read permission on a folder will recursively consider these relations as the answer is computed.
    </p>

<InlinePlayground reference="LS8xRirjo2Lt"/>
</details>

## Try it out

Try the schema Language out now in the [Authzed Playground]

[Authzed Playground]: https://play.authzed.com
