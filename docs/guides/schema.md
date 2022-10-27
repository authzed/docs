# Developing a Schema

import {InlinePlayground} from '../../src/components/InlinePlayground';

## What is a schema?

The **Schema** of [SpiceDB] or a Permissions System in [Authzed] defines the types of objects found, how those objects relate to one another, and the permissions that can be computed off of those relations.

Examples of object types include resources, users, groups, documents, or any kind of object either being protected or for whom something is being protected.

For the exhaustive description of the language used to write schemas, check out the [schema language reference].

[schema language reference]: /reference/schema-lang
[SpiceDB]: https://github.com/authzed/spicedb
[Authzed]: https://app.authzed.com

:::warning
This guide does not specify prefixes on its definitions. SpiceDB and the playground tool accept schema without prefixes, but they are required in Authzed.

If you intend to deploy these examples to Authzed, you'll need to place `yourprefix/` in front of all definitions and references like so:

```definition document { ... }```
->
```definition yourprefix/document { ... }```
:::

## Defining object types

The first step in defining the schema is to write one or more **object definitions**, indicating the types of objects supported in your permissions system.
Object definitions can be thought of as analogous to a `class` in an object oriented programming language (without the inheritance), or tables in a relationship database.

For this example, let's imagine a basic system consisting of a resource to be protected, such as a document, and users that can potentially access that resource.

We begin by defining each of the object types via the `definition` keyword:

```zed
/** user represents a registered user's account in our application */
definition user {}

/** document represents a document with access control */
definition document {}
```

So far, our schema and object definitions don't do much: They define the two types of objects for our system, but as they don't have any **relations** or **permissions** defined, the objects cannot be related to one another in any form, nor can we check any permissions on them.

## Defining relations

Our next step, therefore, is to decide how our objects can relate to one another, thus defining the kind of relationships we can store in SpiceDB or Authzed.

For this example, we've chosen a simple RBAC-style permissions model, where users can be granted a *role*, such as *reader*, on our resource (`document`).

The choice of RBAC therefore means that the relationship between our resource (`document`) and our users will be defined by the roles we want.
We can therefore start by defining a relation on our `document` type to represent one of these roles (here, `reader`):

```zed
/** user represents a registered user's account in our application */
definition user {}

/** document represents a document with access control */
definition document {
  /** reader indicates that the user is a reader on the document */
  relation reader: user
}
```

:::note
Note the inclusion of `user` on the right hand side of the relation: This indicates that only objects of type `user` can relate via a `reader` relationship to a document.

If we wanted more than a single allowed object type, the `|` character can be used:

```zed
relation reader: user | anotherobjecttype
```

:::

## Validating our schema

To validate that our schema is correct, the Authzed Playground supports the writing of *Test Relationships* to define the test data for our system.
Via the test relationships, we can define test data to be used for validation and verification in three places:

- **Checks Watches:** Live checks performed as we edit the schema
- **Assertions:** Assertions to be verified when validation is run
- **Expected Relations:** Exhaustive listing of all expected permissions and relations for a schema when validation is run

### What can we ask?

With the definition of our two object types, and the `reader` relation on our `document` resource, we now have enough to answer a basic question:

> Is a specific user a reader on a specific document?

In Authzed, such a question is answered via use of a [CheckPermission] call, which takes in two objects (the `resource` and the `subject`), as well as a possible permission (or relation) between them (the `permission`), and returns whether the [subject] is *reachable* from the resource.

```text
Can a specific user read the specific document?
      |___________| |__|     |_______________|
         subject permission      resource
```

To add this question for validation in the Authzed Playground, we must translate the question into the *Test Relationships* and the *Assertions*.

[CheckPermission]: https://buf.build/authzed/api/docs/main:authzed.api.v1#CheckPermission
[subject]: /guides/defining-a-subject-type

### Creating test relationships

To translate a CheckPermission, we first must write a relationship to represent the test data for the request.

First, let's reframe our question a bit to make the example easier:

```text
Is [specificuser] <reader> [specificdocument]?
```

To test the above, we need to add at least one relationship from a document to a user, indicating that the user is a reader on the document.

First, we must translate the objects into their object reference forms:

```text
document:specificdocument <reader> user:specificuser
```

Note that we've reversed the order here: [Relationships] always go from the **resource** (here `specificdocument`) to the **subject**.

Here, we've indicated to Authzed that the object is of kind `document`, while the subject is `user`, since those are the types we defined above.
The portion of the relationship after the `:` is the **ID** of each of the objects.

Note that we are using IDs `specificdocument` and `specificuser` in the object references.

:::info
In a real system, object IDs are most likely to be the primary key of the rows for these objects in the database tables representing documents and users, respectively.
Users are also sometimes represented by an external ID, such as the `sub` field of an OAuth token.

The choice of object IDs is up to you, but must be **unique** and **stable** within the set of IDs for an object type.
:::

Next, we need to indicate how the user is translated into a subject: In SpiceDB and Authzed, a subject is itself an object, and is therefore represented as an object reference (here `user:specificuser`) as well as an optional sub-relation.

```text
document:specificdocument <reader> user:specificuser
```

:::info
Note that we could have just as easily defined a relation on the user and used it instead.
A defined non-empty relation is typically used if you want to have *multiple* ways to represent an object as a subject.

For example, if the subject was a group, we might want to define our relation to accept `group#members` and have our relationship reference `group:specificgroup#members`, to indicate it is the group's members that are `reader`, rather than the group itself.
:::

The final step in translating is to link the object references by the relation we've created:

```relationship
document:specificdocument#reader@user:specificuser
|_______________________| |____| |_______________|
        resource         relation     subject
```

To connect our two object references via our relation `reader`, we use the syntax `#` and `@` to create the final relationship string.

We now have a valid [relationship] representing that `specificuser` can view `specificdocument`, which we can place into the "Test Data" tab of the Playground:

<InlinePlayground reference="r9EkIWREZAB1"/>

[Relationships]: /reference/glossary.md#relationship
[relationships]: /reference/glossary.md#relationship

### Writing Assertions

Now that we have a super-basic schema, and some data to validate, we can write *assertions* that can be run to ensure that our schema matches our expectations.

Assertions are written in a YAML form, with two sections (`assertTrue` and `assertFalse`), each containing a list of zero or more relationships (implicit or defined) to verify.

For our example, we wish to verify that the specific user we just gave the `reader` role indeed has said role, so we can write an assertion to validate it:

```yaml
assertTrue:
- "document:specificdocument#reader@user:specificuser"
assertFalse: []
```

Similarly, if we wanted to validate that *another* user does not have that role, we can add that unexpected relationship to the `assertFalse` branch:

```yaml
assertTrue:
- "document:specificdocument#reader@user:specificuser"
assertFalse:
- "document:specificdocument#reader@user:anotheruser"
```

Validation can be run by clicking the `Validate` button in the Playground

:::note
In addition the assertions tab, the Playground supports the use of "Check Watches", which are *live* assertions are run on all edit changes made.
Check Watches are super useful when you are actively editing a schema, so you can in real-time know if you have made a breaking change.

<img src="/img/check-watch.png"/>
:::

### Writing Expected Relations

In addition to *Assertions*, the Authzed Playground also supports the concept of *Expected Relations*, which can be used to **exhaustively** check the membership of relations or permissions.

The Expected Relations consists of a YAML-formatted map, with each key representing a relation, and the values being a list of strings holding the full set of expected relations.

For example, we can write an Expected Relations of the form:

```yaml
document:specificdocument#reader: []
```

After hitting the `Update` button, we are given the fully expanded form:

```yaml
document:specificdocument#reader:
- '[user:specificuser] is <document:specificdocument#reader>'
```

While not demonstrating much more power than the assertions we wrote above, Expected Relations becomes more powerful once we add additional relations and, later, permissions to our schema.

## Expanding our configuration

While being able to ask whether a user is a reader of a document is super useful, it is expected that the majority of permissions systems will consist of more than a single role.

As we discussed at the beginning of the guide, for our example we'd like to have a second role, that of `writer`, which will allow us to check if a user is a writer on the document.

### Adding the writer relation

To begin, we once again start by adding another relation, in this case `writer`:

```zed title="Schema"
/** user represents a registered user's account in our application */
definition user {}

/** document represents a document with access control */
definition document {
  /** reader indicates that the user is a reader on the document */
  relation reader: user

  /** writer indicates that the user is a writer on the document */
  relation writer: user
}
```

Next, we'd like to be able to test our new relation, so we add another test relationship for a different user:

```relationship title="Test Relationships"
document:specificdocument#reader@user:specificuser
document:specificdocument#writer@user:differentuser
```

To verify our test relationships worked, we can add another assertion, and also assert that the original user (`specificuser`) is *not* a writer:

```yaml title="Assertions"
assertTrue:
- "document:specificdocument#reader@user:specificuser
- "document:specificdocument#writer@user:differentuser
assertFalse:
- "document:specificdocument#reader@user:anotheruser"
- "document:specificdocument#writer@user:specificuser"
```

Finally, we can add an expected relation for the new relation, to validate it:

```yaml title="Expected Relations"
document:specificdocument#reader:
- '[user:specificuser] is <document:specificdocument#reader>'
document:specificdocument#writer:
- '[user:differentuser] is <document:specificdocument#writer>'
```

## Defining permissions

The above configuration and validation exposes one issue, however: users are assigned to a single relation `writer` or `reader`, but what if we wanted all users who could write a document to also be able to read a document?

As a naive solution, we could create a `reader` relationship for every user whenever we create a `writer` relationship, but that would get difficult to maintain very quickly.

Instead, we'd ideally like a user with role `writer` to be **implicitly** allowed to a read a document, such that we only ever need to write *one* relationship representing the user's **actual** relation/role to the document.

The solution to this problem is the second concept available within the Schema Language: **permissions**

A `permission` in schema defines a permission *computed* from one or more other relations or permissions.

Let's take our schema again from above:

```zed title="Schema (without permission)"
/** user represents a registered user's account in our application */
definition user {}

/** document represents a document with access control */
definition document {
  /** reader indicates that the user is a reader on the document */
  relation reader: user

  /** writer indicates that the user is a writer on the document */
  relation writer: user
}
```

Previously, we were Checking if a specific user had a specific **role** (such as `reader`) on the document.
Now, however, we want to Check if a specific user has a specific **permission** on the document, such as the ability to view the document.

To support this use case, we can define a `permission`:

```zed title="Schema (with permission)"
/** user represents a registered user's account in our application */
definition user {}

/** document represents a document with access control */
definition document {
  /** reader indicates that the user is a reader on the document */
  relation reader: user

  /** writer indicates that the user is a writer on the document */
  relation writer: user

  /** view indicates whether the user can view the document */
  permission view = reader + writer
}
```

A `permission`, unlike a `relation`, does not represent a concrete relationship between a resource and a subject.
Rather, the permission is *computed* based on the expression found after the `=`.
Here, we compute the `view` permission to include any users found to have either the `reader` OR `writer` role, thus allowing users with either (or both) roles to view the document, as we intended.

### Updating our expected relations

Now that we've updated our schema with our new permission, we can update our assertions and expected relations to ensure it functions as we expect.

To start, we add an assertion that checks if the users can `view` the document:

```yaml title="Assertions"
assertTrue:
- "document:specificdocument#reader@user:specificuser"
- "document:specificdocument#writer@user:differentuser"
- "document:specificdocument#view@user:specificuser"
- "document:specificdocument#view@user:differentuser"
assertFalse:
- "document:specificdocument#reader@user:anotheruser"
- "document:specificdocument#writer@user:specificuser"
```

Next, we can update the expected relations to add the `view` permission, and ensure that both users have that permission on the document:

```yaml title="Expected Relations"
document:specificdocument#reader:
- '[user:specificuser] is <document:specificdocument#reader>'
document:specificdocument#view:
- '[user:differentuser] is <document:specificdocument#writer>'
- '[user:specificuser] is <document:specificdocument#reader>'
document:specificdocument#writer:
- '[user:differentuser] is <document:specificdocument#writer>'
```

Note that the contents of the angled brackets for `differentuser` and `specificuser` are **different**: they indicate the *relation* by which the permission was transitively granted.

:::note
Expected Relations includes the relation by which a subject was found for a permission to ensure that not only is the permission is valid, but also that the *way* a permission was validated matches that expected.

If there are multiple ways that a subject can be found for a permission, Expected Relations will require *all* of them to be listed to be valid.
:::

#### Working example

<InlinePlayground reference="qWR_YFS_KR1L"/>

### Preparing to inherit permissions

As we've seen above, we can use `permission` to define *implicit* permissions, such as a `view` permission consisting of users either the `reader` or `writer` role. Implicit permissions on a specific object type, however, are often insufficient: Sometimes permissions need to be **inherited** between object types.

As an example: Imagine that we add the concept of an `organization` to our permissions system, where any user that is an administrator of an organization automatically gains the ability to `view` any `document` within that organization... how would we define such a permissions schema?

### Defining the organization type

To begin, we must first define the object type that represents our organization, including the `administrator` relation, to represent the administrator role for users:

```zed title="Schema"
/** user represents a registered user's account in our application */
definition user {}

/** organization represents an organization that contains documents */
definition organization {
  /** administrator indicates that the user is an admin of the org */
  relation administrator: user
}

/** document represents a document with access control */
definition document {
  /** reader indicates that the user is a reader on the document */
  relation reader: user

  /** writer indicates that the user is a writer on the document */
  relation writer: user

  /** view indicates whether the user can view the document */
  permission view = reader + writer
}
```

### Connecting organizations and documents

In order for our inheritance to function, we must define a way to indicate that a document "lives" under an organization. Fortunately, this is just another relationship (between a `document` and its parent `organization`), so we can use another relation within the `document` type:

```zed title="Schema"
/** user represents a registered user's account in our application */
definition user {}

/** organization represents an organization that contains documents */
definition organization {
  /** administrator indicates that the user is an admin of the org */
  relation administrator: user
}

/** document represents a document with access control */
definition document {
  /** docorg indicates that the organization owns this document */
  relation docorg: organization

  /** reader indicates that the user is a reader on the document */
  relation reader: user

  /** writer indicates that the user is a writer on the document */
  relation writer: user

  /** view indicates whether the user can view the document */
  permission view = reader + writer
}
```

Here we've chosen to call this relation `docorg`, but it could be called anything: it is generally recommended to use either a contraction of the two namespaces being connected or, alternatively, a term representing the actual relationship between the object types (such as `parent`).

### Adding the relationship

Now that we've defined the `relation` to hold our new relationship, we can add a test relationship in our test relationships:

```relationship title="Test Relationships"
document:specificdocument#docorg@organization:someorg
```

:::info
Note the use of the organization as the **subject** in this relationship
:::

### Inheriting permissions

Now that we have a means of stating that a document is owned by an organization, and a relation to define administrators role on the organization itself, our final steps are to add an `view_all_documents` permission to the organization and to edit the `view` permission to take this permission into account.

To do so, we make use of the arrow operator (`->`), which allows for referencing permissions *across* another relation or permission:

```zed title="Schema"
/** user represents a registered user's account in our application */
definition user {}

/** organization represents an organization that contains documents */
definition organization {
  /** administrator indicates that the user is an admin of the org */
  relation administrator: user

  /** view_all_documents indicates whether a user can view all documents in the org */
  permission view_all_documents = administrator
}

/** document represents a document with access control */
definition document {
  /** docorg indicates that the organization owns this document */
  relation docorg: organization

  /** reader indicates that the user is a reader on the document */
  relation reader: user

  /** writer indicates that the user is a writer on the document */
  relation writer: user

  /** view indicates whether the user can view the document */
  permission view = reader + writer + docorg->view_all_documents
}
```

The expression `docorg->view_all_documents` indicates to SpiceDB or Authzed to follow the `docorg` to any organizations found for the document, and then check for the user against the `view_all_documents` permission.

By use of this expression, any user defined as an administrator of the organization that owns the document will also be able to view the document!

:::note
It is *recommended* that the right side of all arrows refer to **permissions**, instead
of relations.
This allows for easy nested computation, and is more readable.
:::

### Adding an administrator user

Now that we've declared that all users in `administrator` on the organization are also granted the `view` permission, let's define at least one user in our test data to be an adminstrator:

```relationship title="Test Relationships"
organization:someorg#administrator@user:someadminuser
```

### Testing inherited permissions

Finally, we can add the user to the declarations in Assertions and Expected Relations and verify that the inheritance works:

```yaml title="Assertions"
assertTrue:
- "document:specificdocument#reader@user:specificuser"
- "document:specificdocument#writer@user:differentuser"
- "document:specificdocument#view@user:specificuser"
- "document:specificdocument#view@user:differentuser"
- "document:specificdocument#view@user:someadminuser"
assertFalse:
- "document:specificdocument#reader@user:anotheruser"
- "document:specificdocument#writer@user:specificuser"
```

```yaml title="Expected Relations"
document:specificdocument#reader:
- '[user:specificuser] is <document:specificdocument#reader>'
document:specificdocument#view:
- '[user:differentuser] is <document:specificdocument#writer>'
- '[user:someadminuser] is <organization:someorg#administrator>'
- '[user:specificuser] is <document:specificdocument#reader>'
document:specificdocument#writer:
- '[user:differentuser] is <document:specificdocument#writer>'
```

:::info
Note the expectation of `<organization:someorg#administrator>` for `someadminuser`, instead of `reader` or `writer` on the document: the permission is being granted by virtue of the user being an administrator of the organization.
:::

## Fully working example

And that's it! We now have a fully working permissions system:

<InlinePlayground reference="qli9YpRRUg3x"/>

## Get started for real

Want to get started for real? [Start protecting your first application](/guides/first-app) or [Visit the Discord](https://discord.com/invite/jTysUaxXzM) if you have any questions!

[Authzed Playground]: https://play.authzed.com
