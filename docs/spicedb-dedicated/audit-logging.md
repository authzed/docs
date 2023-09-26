# Audit Logging in SpiceDB Dedicated

:::note
Audit Logging is still an in-preview feature, which means it does not have full UI for configuration
:::

Audit Logging is an optional feature for logging of all API made operations to a Permissions System, when deployed with SpiceDB Dedicated and SpiceDB Enterprise.

When enabled and properly configured, SpiceDB Dedicated/Enterprise will (asynchronously) log every API call made to the cluster to the log sink of your choice.

## Supported Log Sink Types

Currently supported log sink types (with more coming soon):

- Kafka
- Kinesis
- Firehose
