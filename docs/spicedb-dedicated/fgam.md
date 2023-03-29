# Fine-Grained Access Management

Fine-Grained Access Management is an optional feature used to manage the access to permission systems deployed with SpiceDB Dedicated.
Those familiar with configuring IAM on any major cloud provider should feel comfortable with the basic concepts:

- [Service Accounts](#service-accounts) represent workloads (e.g. an application calling the SpiceDB API)
- [Roles](#roles) grant access to APIs and subsets of relationships using [CEL expressions]
- [Policies](#policy) bind a Service Account to a Role

## Concepts

### Service Accounts

Service Accounts are used to represent your workloads.
We recommend creating a Service Account for each application that will access the SpiceDB API.

A Service Account can have zero or more access tokens which are a long-lived credentials that identify the Service Account.
SpiceDB clients must provide a token in the Authorization header of an API request in order to perform actions granted to the Service Account through [Roles](#roles) bound by [Policies](#policy).

### Roles

Roles are lists of permissions for accessing the [SpiceDB API] that can be granted to zero or more [Service Accounts](#service-accounts) via [Policies](#policy).
Each permission specifies an RPC and an optional [CEL expression] which is evaluated at runtime to determine whether or not to grant the permission.

Adding the permission to a Role means each [Service Accounts](#service-accounts) assigned the Role will have the corresponding API access.
Calling the API method won't be authorized unless a [Service Accounts](#service-accounts) has been granted explicit access via a Role and a [Policy](#policy) binding it.

#### Advanced Roles with Conditions

Fine-Grained Access Management offers advanced permissions by letting users define dynamic conditions that need to be met at request time for the request to be authorized.
This is achieved by augmenting fine-grained permissions with Google's [CEL expressions] language.

Each role permission provides an input text box to introduce an conditional expression, which is optional.
When included, an API request will be authorized if:

- the service account has been granted a permission
- the expression of the permission is met

SpiceDB Dedicated will expose the protobuffer payload to the expression language, so the following variables will be available to be used in the expression:

- `WriteRelationshipsRequest`
- `ReadRelationshipsRequest`
- `DeleteRelationshipsRequest`
- `WriteSchemaRequest`
- `ReadSchemaRequest`
- `CheckPermissionRequest`
- `LookupResourcesRequest`
- `LookupSubjectsRequest`
- `ExpandPermissionTreeRequest`
- `WatchRequest`

This is powerful because it let's you extend the logic to authorize an API request beyond "granted / not granted".
Let's have a look at a few examples of what can be done:

| Example | Expresssion |
|---|---|
| Grants permissions to update only a specific type of resource on a write request  | `WriteRelationshipsRequest.updates.all(x, x.relationship.resource.object_type == "resource")`  |
|  Grants permission to update only a specific type of subject on a write request | `WriteRelationshipsRequest.updates.all(x, x.relationship.subject.object.object_type == "user")`  |
| Allows only write operations that use `CREATE`  | `WriteRelationshipsRequest.updates.all(x, x.operation == authzed.api.v1.RelationshipUpdate.Operation.OPERATION_CREATE)`  |
| Allows reading only relationships of a specific type of resource type | `ReadRelationshipsRequest.relationship_filter.resource_type == "resource"`  |
| Blocks writing the schema that contain specific strings | `!WriteSchemaRequest.schema.contains("blockchain")` |
| Only allows checking a specific permission | `CheckPermissionRequest.permission != "admin"` |
| Only allows looking up resources after a specific permission | `LookupResourcesRequest.permission != "admin"` |

Any of the public API types will be avaliable to the expression language, so you can traverse any type and their fields using language operators.
For more details on CEL's language definition, please refer to [CEL language specification].

### Policy

Policies bind [Roles](#roles) to [Service Accounts](#service-accounts).
Each Policy represents a 1:1 mapping of Service Account to Role.
Binding multiple Roles to a single Service Account is additive: if any of the Roles have a permission, then that granted that permission.

## Example: assign read-only role to service account

Let's illustrate how you can create a read-only role for your service.
You should start by making sure your Permission System has Fine-Grained Access Management enabled.
This can be done at permission system creation time, by enabling the corresponding option.

![Create Permission System with FGAM Enabled](/img/fgam/create-ps-fgam.png)

Once your permissions system has been created, you should be able to access the "Access Management" menu on your Permission System.
You'd be greeted with the list of available service accounts, which should be empty.
If you hit "Create Service Account", you'd be prompted to introduce a display name and a description.
Once you hit "Create Service Account", the information page is shown, with the global ID of the service, and the date and time of creation.

The Service Account page now shows the new service with the values provided, and you can use the bin icon on the right side of the entry to remove the Service Account.

![Create Service Account Animation](/img/fgam/create-service-account.gif)

Next let's go ahead and create a role that only has access to read-only operations on SpiceDB's API.
You'd hit the "Create Role" button and will be prompted to introduce a display name and a description.
In "API Permissions" you'd be offered with a drop-down with all of SpiceDB's public APIs.
Hit "Add Api Permission" if you'd like the role to have that permission.
The list of permissions currently in the role will be shown below.
You should leave the "Optional Expression" empty for now.

Once created, you'd be shown with the role information page, which includes the generated unique ID and the date and time of creation.
If you go back to the roles page, you should see your new read-only role listed there, and similarly to service accounts, a bin icon is shown on the right side of the entry to delete the role if you wish.

Please note Roles are immutable at the moment, but we will consider adding support for editing roles in the future.

![Create Role Animation](/img/fgam/create-role.gif)

This newly created role can now be granted to any service account by binding them through a Policy.
Head out to the Policy page, which gives you an overview of all existing policies.

If you hit the create policy, you'd be given the option to select the principal and the assigned role.
We will choose our demo service and hit "Create Policy".
Upon completion you'll be shown with the policy page, from which you can navigate to either the service account or the role.

![Create Policy Animation](/img/fgam/create-policy.gif)

The last step is to issue a token for our service account.
These are long-lived and so adequate secret management is warranted.

Go once again to `Access Management > Service Accounts` and choose `service-account-demo`.
This will take you to the service account page, which will show you `Details` and `Tokens` on the left side navigation menu.
Hit `Tokens`, you'll be shown with the list of tokens created for that Service Account.
If you click on `Create Token`, you'll be shown with a modal that will allow you to copy the token, or configure it in the `zed` command-line tool with a one-liner.
Whatever option you select, the token should be available for you, and should be listed in the tokens page for your service account.

![Create Token Animation](/img/fgam/create-token.gif)

[CEL expressions]: https://github.com/google/cel-spec
[CEL expression]: https://github.com/google/cel-spec
[SpiceDB API]: https://buf.build/authzed/api/docs/main:authzed.api.v1
[CEL language specification]: https://github.com/google/cel-spec/blob/81e07d7cf76e7fc89b177bd0fdee8ba6d6604bf5/doc/langdef.md
