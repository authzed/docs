# Overview

SpiceDB Enterprise is the production-ready version of SpiceDB we use in our managed services.
You can license SpiceDB Enterprise to deploy into your own envionment.

SpiceDB Enterprise comes with:

* [Fine-Grained Access Management tokens for your service accounts](/spicedb-enterprise/fgam)
* Full SpiceDB request audit logging
* Early access to security patches
* Additional enterprise-only functionality as it's released

For self-hosted deployments using SpiceDB Open Source or SpiceDB Enterprise we recommend purchasing a [support package](https://authzed.com/products/spicedb-sla-support).

For more information, please [schedule an introductory call](https://authzed.com/call/?utm_source=docs).

## Accessing SpiceDB Enterprise

SpiceDB Enterprise is made available via the [authzed-enterprise] GitHub organization as a container image stored in the [organization's registry].

[authzed-enterprise]: https://github.com/authzed-enterprise
[organization's registry]: https://github.com/orgs/authzed-enterprise/packages

Images are signed using [cosign], storing a signature of their digests alongside the image in the registry.
They are also published publically to the [rekor transparency log] operated by the [Linux Foundation's] security-focused foundation, the [OpenSSF].
You can read more about keyless container signing and verification in the [cosign documentation].

[cosign]: https://github.com/sigstore/cosign
[rekor transparency log]: https://rekor.sigstore.dev
[linux foundation's]: https://www.linuxfoundation.org
[openssf]: https://openssf.org
[cosign documentation]: https://github.com/sigstore/cosign/blob/main/KEYLESS.md

## Recommended environment for SpiceDB Enterprise

### Single-Region

- SpiceDB Enterprise
  - PostgreSQL datastore
- Environment
  - Kubernetes 1.24+
    - 3 4-vCPU Nodes
    - Project Contour Ingress 1.19+
    - Certmanager 1.6+

### Multi-Region

- SpiceDB Enterprise
  - CockroachDB or Cloud Spanner datastores
- Environments
  - Kubernetes 1.24+
    - 3 4-vCPU Nodes
    - Project Contour Ingress 1.19+
    - Certmanager 1.6+
