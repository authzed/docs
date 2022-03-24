---
slug: /
summary: "Documentation for Authzed, the planet-scale, serverless database platform for SpiceDB."
---

# Overview

## What is Authzed? What is SpiceDB?

[SpiceDB] is a database system for managing security-critical permissions checking.

SpiceDB acts as a centralized service that stores authorization data.
Once stored, data can be performantly queried to answer questions such as "Does this user have access to this resource?" and "What are all the resources this user has access to?".

[Authzed] operates the globally available, serverless database platform for SpiceDB.

## Getting Started

1. Log into the [Authzed dashboard] to create a serverless SpiceDB instance or [Install SpiceDB locally]
2. Start the [Protecting Your First App] guide

## Other Resources

- Follow the guide for [developing a schema]
- [Watch a video] of us modeling GitHub
- Read the schema language [design documentation]
- [Jump into the playground], load up some examples, and mess around
- Explore the gRPC API documentation on the [Buf Registry]
- [Install zed] and interact with a live database

[Install SpiceDB locally]: /guides/installing
[Authzed]: https://authzed.com
[Authzed dashboard]: https://app.authzed.com
[SpiceDB]: https://github.com/authzed/spicedb
[developing a schema]: /guides/schema
[Watch a video]: https://www.youtube.com/watch?v=x3-B9-ICj0w
[design documentation]: https://docs.authzed.com/reference/schema-lang
[Jump into the playground]: https://play.authzed.com
[Protecting Your First App]: /guides/first-app
[Buf Registry]: https://buf.build/authzed/api/docs
[Install zed]: https://github.com/authzed/zed
