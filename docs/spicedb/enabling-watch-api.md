# Enabling Watch API

The [Watch API] is by default enabled for most [datastores].

[watch api]: https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.WatchService.Watch
[datastores]: selecting-a-datastore

However, Postgres and CockroachDB require special flags in order to enable the watch API, as they depend upon features not enabled by default in most installations.

## Postgres

To enable the Watch API on Postgres, it must be run with the Commit Timestamp tracking turned on:

```sh
postgres .... --track_commit_timestamp=on
```

## CRDB

To enable the Watch API on CockroachDB, it must be run with [experimental changefeeds] turned on.

See the [CRDB documentation] for how to enable and how to grant the proper privileges.

[experimental changefeeds]: https://www.cockroachlabs.com/docs/v22.1/changefeed-for
[crdb documentation]: https://www.cockroachlabs.com/docs/v22.1/changefeed-for
