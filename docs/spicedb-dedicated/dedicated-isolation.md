# SpiceDB Dedicated Isolation

SpiceDB Dedicated isolates your workloads from other customers. Cloud accounts, compute resources, databases, and networking are all dedicated to you.

Additionally, SpiceDB allows you to deploy multiple isolated Permissions Systems into a single SpiceDB Dedicated environment. Each Permissions Systems has it’s own schema and set of relationships. Also, these Permissions Systems impose memory and CPU limits so one Permissions System can’t crowd out another Permissions System.

By default, API tokens are scoped to a particular Permissions System. [Fine Grained Access Management (FGAM)](/spicedb-dedicated/fgam.md) can take this farther by restricting API tokens to specified APIs, object types, or object IDs.

The below diagram gives an overview of the SpiceDB Dedicated isolation model.

<img src={require("/img/dedicated-isolation.png").default} alt="dedicated isolation model" />
