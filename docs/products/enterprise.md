# SpiceDB Enterprise

SpiceDB Enterprise is the Authzed product for running private clusters operated by you on your own premises.

- Clusters operate in your own production environment inaccessible to anyone else.
- Your operations team takes point only escalating to experts at Authzed in case of an emergency.
- Customers are included under security embargo and are provided access to patches before public announcement.

## What is included in SpiceDB Enterprise?

SpiceDB Enterprise is a collection of entirely optional subscriptions:

- [Gold Support]: 24/7 1-hour initial response SLA
- [Silver Support]: business-hours 24-hour initial response SLA
- [SRE Tooling]: proprietary tools used by the Authzed SRE team to simplify cluster operations
- Solutions Engineering: 20-hour increments of solutions engineering to aid application integration or SpiceDB feature development

For more information, you can review the [pricing page] or [schedule an introductory call]

[Gold Support]: /support#gold-support
[Silver Support]: /support#silver-support
[SRE Tooling]: #what-is-included-in-the-sre-tooling-package
[pricing page]: https://authzed.com/pricing
[schedule an introductory call]: https://authzed.com/contact/?utm_source=docs

## What is included in the SRE Tooling package?

Container images for the following:

- SpiceDB Enterprise: enterprise builds of SpiceDB
  - LTS Support
  - Early access to security patches
  - Upcoming enterprise-only functionality
- Playground: development environment powering [play.authzed.com]
  - Privately share schemas with coworkers knowing that the contents are private to your organization
  - Supports S3-compatible storage services
- Thumper: Load generator for monitor and performance testing
  - Mimics production workloads by executing API calls sequences with weights and a target query rate
  - Powers the metrics behind [status.authzed.com]

[Dashboard]: https://app.authzed.com
[play.authzed.com]: https://play.authzed.com
[status.authzed.com]: https://status.authzed.com

### Downloading SRE Tooling

The SRE Tools are made available via the [authzed-enterprise] GitHub organization as container images stored in the [organization's registry].

[authzed-enterprise]: https://github.com/authzed-enterprise
[organization's registry]: https://github.com/orgs/authzed-enterprise/packages

Images are signed using [cosign], storing a signature of their digests alongside the image in the registry.
They are also published publically to the [rekor transparency log] operated by the [Linux Foundation's] security-focused foundation, the [OpenSSF].
You can read more about keyless container signing and verification in the [cosign documentation].

[cosign]: https://github.com/sigstore/cosign
[rekor transparency log]: https://rekor.sigstore.dev
[Linux Foundation's]: https://www.linuxfoundation.org
[OpenSSF]: https://openssf.org
[cosign documentation]: https://github.com/sigstore/cosign/blob/main/KEYLESS.md

## Recommended environment for SpiceDB Enterprise

### Single-Region

- SpiceDB
  - PostgreSQL datastore
- Environment
  - Kubernetes 1.24+
    - 3 4-vCPU Nodes
    - Project Contour Ingress 1.19+
    - Certmanager 1.6+

### Multi-Region

- SpiceDB
  - CockroachDB or Cloud Spanner datastores
- Environments
  - Kubernetes 1.24+
    - 3 4-vCPU Nodes
    - Project Contour Ingress 1.19+
    - Certmanager 1.6+

