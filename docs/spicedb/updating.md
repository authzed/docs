# Updating SpiceDB

:::info
Want to use SpiceDB as a service without the need to update? Visit the [Authzed Dashboard] to create a new permissions system
:::

[Authzed Dashboard]: https://app.authzed.com

## Learning about updates

### Being notified of updates

Join the [SpiceDB Discord] to be notified of new releases of SpiceDB.

[SpiceDB Discord]: https://authzed.com/discord

### Checking for updates

Releases of SpiceDB can be found on the [SpiceDB Releases] page on GitHub.

[SpiceDB Releases]: https://github.com/authzed/spicedb/releases

## Applying an update

Applying an update for SpiceDB requires three steps:

### 1. Download new release of SpiceDB

Download the new release from the [SpiceDB Releases] page or from [DockerHub]

[DockerHub]: https://hub.docker.com/r/authzed/spicedb

### 2. Migrate the datastore

Run `spicedb migrate head` to migrate the existing cluster's datastore forward:

```sh
spicedb migrate head
```

:::note
**Unless otherwise documented**, this is a backward compatible change
:::

### 3. Deploy the new release of SpiceDB

Deploy the new release of SpiceDB using your deployment system.

If possible, it is recommended to use a rolling deployment, to ensure that the existing cluster can handle traffic while the nodes or pods for the new version come into service.
