# Docs

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg "Apache 2.0 License")](https://www.apache.org/licenses/LICENSE-2.0.html)
[![Links](https://github.com/authzed/docs/actions/workflows/link-checker.yaml/badge.svg "Links")](https://github.com/authzed/docs/actions/workflows/link-checker.yaml)
[![Build Status](https://github.com/authzed/docs/workflows/Lint/badge.svg "GitHub Actions")](https://github.com/authzed/docs/actions)
[![Mailing List](https://img.shields.io/badge/email-google%20groups-4285F4 "authzed-oss@googlegroups.com")](https://groups.google.com/g/authzed-oss)
[![Discord Server](https://img.shields.io/discord/844600078504951838?color=7289da&logo=discord "Discord Server")](https://discord.gg/jTysUaxXzM)
[![Twitter](https://img.shields.io/twitter/follow/authzed?color=%23179CF0&logo=twitter&style=flat-square "@authzed on Twitter")](https://twitter.com/authzed)

This project houses the [Authzed] & [SpiceDB] documentation [website].

[Authzed]: https://authzed.com
[SpiceDB]: https://github.com/authzed/spicedb
[website]: https://authzed.com/docs

See [CONTRIBUTING.md](/CONTRIBUTING.md) for instructions on how to contribute and perform common tasks like building the project and running tests.

## Getting Started

Install pnpm :

```sh
brew install pnpm
```

Install dependencies:

```sh
pnpm install
```

Run a development server:

```sh
pnpm run dev
```

Now you should be able to see the docs rendered at http://localhost:3000


Run linters:

```sh
pnpm run lint
````
