---
slug: /
summary: "Documentation for Authzed, the planet-scale, serverless database platform for SpiceDB."
---

# SpiceDB and Authzed

<div style={{textAlign: 'center'}}>

!['Relationships'](/graph.svg)

<div class="overview-top-buttons">
<a href="/spicedb/operator" class="btn">
    <i class="fa-solid fa-cubes"></i>
    Install the Operator
</a>
<a href="/guides/first-app" class="btn with-left-margin">
    <i class="fa fa-play"></i>
    Get Started Protecting Your App
</a>
<a href="https://authzed.com/discord" class="btn with-left-margin">
    <i class="fa-brands fa-discord"></i>
    Discuss on Discord
</a>
<a href="https://github.com/authzed/spicedb" class="btn with-left-margin">
    <i class="fa-brands fa-github"></i>
    Browse on GitHub
</a>
</div>
</div>

## What is SpiceDB?

SpiceDB is an open-source authorization system for managing security-critical fine grained authorization. It was inspired by [Google's Zanzibar whitepaper](https://zanzibar.tech) released in 2019 that details how Google manages to provide robust authorization to all of its core products without sacrificing performance and scale requirements. Google's Relationship-Based Access Control (ReBAC) approach has quickly become the go-to for building scalable authorization: with Slack, Carta, and Airbnb already following in Google's footsteps.

SpiceDB has grown into the most mature open-source implementation of the authorization system put forward by Google Zanzibar. SpiceDB implements Google's Zanzibar core features, along with improvements such as [SpiceDB Caveats](/reference/caveats), which let you combine policy-based authorization with relationship-based authorization. You can find the project on GitHub: [SpiceDB: Google Zanzibar-Inspired Authorization System](https://github.com/authzed/spicedb).

## How does SpiceDB work?

SpiceDB acts as a centralized service that allows you to store authorization data as relationships. The relationship data is stored as a graph and powers authorization requests. Your graph's schema is defined using [SpiceDB's Schema Language](/reference/schema-lang) which establishes the relationships and permissions that drive authorization decisions for your workload.

SpiceDB caches relationship data to performantly respond to client authorization requests, and persist the data to a datastore. Today, SpiceDB supports PostgreSQL, CockroachDB, and Google's Cloud Spanner for persisting relationships.

You integrate your applications with SpiceDB's API to write your schema, read and write relationships, and perform common authorization checks, e.g., "does this user have access to this resource?" or "what are all the resources this user has access to?" For a full list of the available SpiceDB libraries head over to [Awesome SpiceDB](https://github.com/authzed/awesome-spicedb).

## What is Authzed?

[Authzed] provides managed SpiceDB as a service with 2 products that let you deploy highly-available SpiceDB Enterprise Permissions Systems:

- [SpiceDB Serverless], our shared infrastructure offering
- [SpiceDB Dedicated], our private infrastructure offering

SpiceDB Enterprise has all the features of [SpiceDB Open-Source] with additional features to help you run confidently in production. You can also license a version of SpiceDB Enterprise for deploying in your own environement.

For SpiceDB Dedicated and licensing SpiceDB Enterprise please [book a call] to learn more.

---

## Getting Started

Log into the [Authzed dashboard] to create a serverless SpiceDB instance or [run SpiceDB] yourself, and then:

<div class="next-steps-grid">
    <a href="/guides/first-app">
        <Button class="btn btn-large">
            <i class="fa fa-play"></i>
            Start Protecting Your App
        </Button>
    </a>
    <a href="https://play.authzed.com">
        <Button class="btn btn-large">
            <i class="fa fa-file-code"></i>
            Start modeling in the Playground
        </Button>
    </a>
    <a href="https://github.com/authzed/zed">
        <Button class="btn btn-large">
            <i class="fa fa-terminal"></i>
            Install zed and interact with your database
        </Button>
    </a>
    <a href="https://www.youtube.com/watch?v=x3-B9-ICj0w">
        <Button class="btn btn-video">
            <div class="thumbnail">
                <i class="fa-brands fa-youtube"></i>
                <img src={require("/img/youtube_x3-B9-ICj0w.png").default} />
            </div>
            Modeling GitHub in Authzed
        </Button>
    </a>
    <a href="https://www.youtube.com/watch?v=dlARPyDVPZQ">
        <Button class="btn btn-video">
            <div class="thumbnail">
                <i class="fa-brands fa-youtube"></i>
                <img src={require("/img/youtube_dlARPyDVPZQ.png").default} />
            </div>
            Modeling Google Groups in Authzed
        </Button>
    </a>
    <a href="https://www.youtube.com/watch?v=WTfZsRPDv9Q">
        <Button class="btn btn-video">
            <div class="thumbnail">
                <i class="fa-brands fa-youtube"></i>
                <img src={require("/img/youtube_WTfZsRPDv9Q.png").default} />
            </div>
            Learn more about Zanizbar
        </Button>
    </a>
</div>

## Other Documentation and Guides

- Follow the guide for [developing a schema]
- Read the schema language [design documentation]
- Explore the gRPC API documentation on the [Buf Registry]
- [Read the Authzed Blog] for in-depth discussions about SpiceDB, Authzed, and other technical topics

## Have a question?

Join us on [Discord] to discuss any questions you may have!

[discord]: https://authzed.com/discord
[run spicedb]: /spicedb/installing
[authzed]: https://authzed.com
[authzed dashboard]: https://app.authzed.com
[spicedb]: https://github.com/authzed/spicedb
[developing a schema]: /guides/schema
[watch a video]: https://www.youtube.com/watch?v=x3-B9-ICj0w
[design documentation]: https://authzed.com/docs/reference/schema-lang
[jump into the playground]: https://play.authzed.com
[protecting your first app]: /guides/first-app
[buf registry]: https://buf.build/authzed/api/docs
[install zed]: https://github.com/authzed/zed
[read the authzed blog]: https://authzed.com/blog
[spicedb serverless]: https://authzed.com/products/spicedb-serverless
[spicedb dedicated]: https://authzed.com/products/spicedb-dedicated
[spicedb open source]: https://authzed.com/products/spicedb
[book a call]: https://authzed.com/call