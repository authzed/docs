# Authzed Enterprise

Authzed Enterprise is the on-premise installation of the exact same software powering Authzed.com.

Pricing is a flat-fee per cluster not limited by hardware resources (e.g. vCPUs) and is available upon request.
You can [contact us] for more details.

[contact us]: https://authzed.com/contact/?utm_source=docs

High level functionality includes:

- The [Dashboard] for managing organizations, teams, and credentials
  - Supports OIDC & Auth0 authentication
- SpiceDB Enterprise, the supported configuration of SpiceDB
  - Multi-tenant isolation built-in
- Developer tools such as the [Playground]
- Operations tools such as our internal health monitoring

[Dashboard]: https://app.authzed.com
[Playground]: https://play.authzed.com

## Downloading Authzed Enterprise

Authzed Enterprise is made available via the [authzed-enterprise] GitHub organization.
Source code is released under the [src] repository and is used to build container images stored in the [organization's registry].

[authzed-enterprise]: https://github.com/authzed-enterprise
[src]: https://github.com/authzed-enterprise/src
[organization's registry]: https://github.com/orgs/authzed-enterprise/packages

### Signatures

Images are signed using [cosign], storing a signature of their digests alongside the image in the registry.
They are also published publically to the [rekor transparency log] operated by the [Linux Foundation's] security-focused foundation, the [OpenSSF].
You can read more about keyless container signing and verification in the [cosign documentation].

[cosign]: https://github.com/sigstore/cosign
[rekor transparency log]: https://rekor.sigstore.dev
[Linux Foundation's]: https://www.linuxfoundation.org
[OpenSSF]: https://openssf.org
[cosign documentation]: https://github.com/sigstore/cosign/blob/main/KEYLESS.md

## Running Authzed Enterprise

### Recommendations

- Kubernetes 1.20+
  - Project Contour Ingress 1.19+
  - Certmanager 1.6+
