# Writing Relationships

In [SpiceDB], a permissions system is defined by two items: the [schema] which defines *how* data can be represented, and the *relationships*, defining the way the objects are actually related to one another.

[schema]: /guides/schema.md
[SpiceDB]: https://github.com/authzed/spicedb

It is the application's responsibility to keep the relationships within SpiceDB up-to-date and reflecting the state of the application; how an application does so can vary based on the specifics of the application, so below we outline a few approaches.

:::note
Want to learn more about writing relationships to SpiceDB, the various strategies and their pros and cons? Read our [blog post about writing relationships]
:::

[blog post about writing relationships]: https://authzed.com/blog/writing-relationships-to-spicedb/

## SpiceDB-only relationships

Sometimes, an application does not even need to store permissions-related relationships in its relational database.

Consider a permissions system that allows for teams of users to be created and used to access a resource.
In SpiceDB's schema, this could be represented as:

```haskell
definition user {}

definition team {
  relation member: user
}

definition resource {
  relation reader: user | team#member
  permission view = reader
}
```

In the above example, the relationship between a resource and its teams, as well as a team and its members does not need to be stored in the application's database **at all**.

Rather, this information can be stored solely in SpiceDB, and accessed by the application via a [ReadRelationships] or [ExpandPermissionsTree] call when necessary.

[ReadRelationships]: https://buf.build/authzed/api/docs/main:authzed.api.v1#ReadRelationships
[ExpandPermissionsTree]: https://buf.build/authzed/api/docs/main:authzed.api.v1#ExpandPermissionTree

## Two writes + commit

The most common and straightforward way to store relationships in SpiceDB is to use a 2 phase commit-like approach, making use of a transaction from the relational database along with a [WriteRelationships] call to SpiceDB.

[WriteRelationships]: https://buf.build/authzed/api/docs/main:authzed.api.v1#WriteRelationships

```python title='Example of a 2PC-like approach'
try:
  tx = db.transaction()

  # Write relationships during a transaction so that it can be aborted on exception
  resp = spicedb_client.WriteRelationships(...)

  tx.add(db_models.Document(
    id=request.document_id,
    owner=user_id,
    zedtoken=resp.written_at
  ))
  tx.commit()
except:
  # Delete relationships written to SpiceDB and re-raise the exception
  tx.abort()
  spicedb_client.DeleteRelationships(...)
  raise
```

## Streaming commits

Another approach is to stream updates to both a relational database and SpiceDB via a third party streaming system such as [Kafka], using a pattern known as [Command Query Responsibility Segregation] (CQRS)

[Kafka]: https://kafka.apache.org/
[Command Query Responsibility Segregation]: https://www.confluent.io/blog/event-sourcing-cqrs-stream-processing-apache-kafka-whats-connection/

In this design, any updates to the relationships in both databases are published as **events** to the streaming service, with each event being consumed by a system which performs the updates in both the database and in SpiceDB.

## Asynchronous Updates

**NOTE:** This should *only* be used if your application supports less rigid consistency guarantees.

If an application does not require up-to-the-second consistent permissions checking, and some replication lag in permissions checking is acceptable, then asynchronous updates of the relationships in SpiceDB can be used.

In this design, a synchronization process, typically running in the background, is used to write relationships to SpiceDB in reaction to any changes that occur in the primary relational database.
