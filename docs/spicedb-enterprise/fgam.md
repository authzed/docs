---
title: Fine-Grained Access Management for SpiceDB Enterprise
description: Learn how to configure Fine-Grained Access Management for SpiceDB Enterprise.
sidebar_label: Fine-Grained Access Management
---

# Fine-Grained Access Management in SpiceDB Enterprise

The `spicedb-enterprise` binary exposes additional functionality through `Extenders`. These can be enabled via CLI arguments. FGAM is one such extender.

## Enabling FGAM in SpiceDB Enterprise

The `spicedb-enterprise` exposes a CLI interface to run your Self-Hosted SpiceDB. It offers additional options not available in the upstream opensource SpiceDB.

The entrypoint is discovering how things work via the `--help` flag

<img src={require("/img/fgam/self-hosted/serve-command.png").default} alt="spicedb-enterprise --help" />

The `serve` command is the entry point to running SpiceDB, and you can see it exposes some additional flags to configure `Extenders`.

<img src={require("/img/fgam/self-hosted/serve-help.png").default} alt="spicedb-enterprise serve --help" />

- The `extender-enabled` lets you enable or disable extenders. Some are enabled by default and cannot be disabled. To enable FGAM set the flag like `--extender-enabled authzed-fgam`.
- `--extender-authzed-fgam-endpoint` let's you define a reference to a YAML configuration file that statically defines the FGAM configuration and as is expected to be handled via a GitOps proceses. The host SpiceDB is pointed to this configuration YAML file, and will be able to spawn an embedded in-memory SpiceDB. That instance is immutable and runs the extremely fast memory datastore to minimize the overhead.

## The static configuration YAML

FGAM's static configuration is handled via a YAML descriptor. This descriptor describes all the different FGAM concepts like services, roles, policies and tokens. As such, it must be subject to proper secret management in your deployment environment.

Here is an example showcasing the shape of this configuration file:

```yaml
role:
  - id: "admin"
    permission:
      authzed.v1/ReadSchema:           ""
      authzed.v1/WriteSchema:          ""
      authzed.v1/ReadRelationships:    ""
      authzed.v1/WriteRelationships:   ""
      authzed.v1/DeleteRelationships:  ""
      authzed.v1/CheckPermission:      ""
      authzed.v1/LookupResources:      ""
      authzed.v1/LookupSubjects:       ""
      authzed.v1/ExpandPermissionTree: ""
      authzed.v1/Watch:                ""
service_account:
  - id: "my_microservice"
    token:
      - id: "token_01"
        hash: "71c73ba92f2032416b18a4f4fffb2a825755bea6a8430f2622ab1f3fb35a10d0"
      - id: "token_02"
        hash: "fcdfc4fa3c5c7381789d90c3c67f6cebf151cbf7e7555e91e77be2aa3e0a4bdf"
policy:
  - id: "microservice_with_admin"
    principal_id: "my_microservice"
    principal_type: "service_account"
    roles:
      - "admin"
```

### Role

You can define any numner of Roles. The `permission` section describes the list of authzed.v1 API methods the Role has, and an optional CEL expression as condition.

- If omitted from the list, the permission is not granted
- If added to the list with an empty condition string, then the permission is granted unconditionally
- If added to the list with a non-empty condition string, then the permission is granted if the condition is satisfied at request time

To learn how to write CEL expression, see some examples in the FGAM docs, and for further information, check the official language description.

```yaml
role:
  - id: "admin"
    permission:
      authzed.v1/ReadSchema:           ""
      authzed.v1/WriteSchema:          ""
      authzed.v1/ReadRelationships:    ""
      authzed.v1/WriteRelationships:   ""
      authzed.v1/DeleteRelationships:  ""
      authzed.v1/CheckPermission:      ""
      authzed.v1/LookupResources:      ""
      authzed.v1/LookupSubjects:       ""
      authzed.v1/ExpandPermissionTree: ""
      authzed.v1/Watch:                ""
```

### Service Account

`service_account` accounts need a globally unique ID that will be referenced in a `policy`. You'd typically want a service account per client service and potentially execution environment. Service accounts can define zero or more tokens

### Tokens

Tokens need also a globally unique ID, and the hash of the secret. FGAM Token format looks like this:

```
sdbst_<hash_function>_<secret>
```

- The prefix allows SpiceDB to identify the type of token
- The only hash function supported right now is SHA256 (denoted with `h256`), and new functions might be added as the need arises.
- The plain-text secret. Follow your organizations best-practices around strong password generation

In the YAML file you'd need to define your token by applying the hash function only the secret portion - the prefixes are excluded of the hash.

To generate the hash for your secret, you can run:

```bash
echo -n thisisnotaverysecuresecret | sha256sum
```

The token to be provided in API calls by the client would look like this:

```
sdbst_h256_thisisnotaverysecuresecret
```

And the result of introducing it in the YAML configuration would be:

```yaml
service_account:
  - id: "my_microservice"
    token:
      - id: "token_01"
        hash: "71c73ba92f2032416b18a4f4fffb2a825755bea6a8430f2622ab1f3fb35a10d0"
```

### Policy

A policy needs a globally unique id, and binds together a service account and a role. You'll reference the principal (the target of the role assignment) and the role by their globally unique IDs. Additionally you'll need to specify the `principal_type` as `service_account`. Only a single role can be assigned for now, if you want more roles assigned to the same principal, create another policy.

```yaml
policy:
  - id: "microservice_with_admin"
    principal_id: "my_microservice"
    principal_type: "service_account"
    roles:
      - "admin"
```

## Running spicedb-enterprise with static FGAM configuration

Rolling out FGAM for a SpiceDB that is already in production requires careful consideration. There are two ways:

- Accepting downtime: your instance can take the downtime or is freshly deployed.
- Zero downtime: you have a production SpiceDB instance and don't want to cause downtime when enabling FGAM.

### Zero-downtime enablement

To enable FGAM on an already existing instance, follow these steps:

1. Create pre-shared keys that follow the FGAM token format for each client of your SpiceDB instance. You should add those to your SpiceDB instance configuration. You can do this by defining multiple PSKs via the ENV or flags as comma separated values
2. Update all your clients to use those new PSKs
3. Prepare the FGAM configuration YAML. This process heavily depends on what each client needs:
   1. You may want to start with FGAM tokens bound to a admin-like Role, since that's what the original PSKs effectively were. This is probably lower risk, and then from there you can move to start trimming down permissions.
   2. Or you may want to move directly to downscoped tokens for your individual services, creating the tokens you need. This may be simple if you have few clients, but more complex as the number of clients grow, and with a bigger blast radious of impact on rollout.
4. Deploy SpiceDB with the new configuration
