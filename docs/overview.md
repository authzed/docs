---
slug: /
summary: "Documentation for Authzed, the planet-scale, serverless database platform for SpiceDB."
---

# SpiceDB and Authzed

<div style={{textAlign: 'center'}}>

!['Relationships'](/graph.svg)

<div class="overview-top-buttons">
<a href="/docs/spicedb/operator" class="btn">
    <i class="fa-solid fa-cubes"></i>
    Install the Operator
</a>
<a href="/docs/guides/first-app" class="btn with-left-margin">
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
<h2>Fine-grained relationship-based access control and permissions</h2>
<h4>Based on <a href="https://authzed.com/blog/what-is-zanzibar">Google Zanzibar</a> for scalable, reliable and verifiable permissions handling</h4>

## What is SpiceDB? What is Authzed?

[SpiceDB] is an **open source** database system for managing security-critical fine grained permissions checking.

SpiceDB acts as a centralized service that stores authorization data: Once stored, data can be performantly queried to answer questions such as <code>Does this user have access to this resource?</code> or <code>What are all the resources this user has access to?</code>.

[Authzed] operates SpiceDB for you: serverless, dedicated or on premises.

---

## Getting Started

Log into the [Authzed dashboard] to create a serverless SpiceDB instance or [run SpiceDB] yourself, and then:

<div class="next-steps-grid">
    <a href="/docs/guides/first-app">
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
[run spicedb]: spicedb/installing.md
[authzed]: https://authzed.com
[authzed dashboard]: https://app.authzed.com
[spicedb]: https://github.com/authzed/spicedb
[developing a schema]: guides/schema.md
[watch a video]: https://www.youtube.com/watch?v=x3-B9-ICj0w
[design documentation]: https://authzed.com/docs/reference/schema-lang
[jump into the playground]: https://play.authzed.com
[buf registry]: https://buf.build/authzed/api/docs
[install zed]: https://github.com/authzed/zed
[read the authzed blog]: https://authzed.com/blog
