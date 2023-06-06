# SpiceDB Self-Hosted

SpiceDB Self-Hosted is a collection of subscriptions:

- SpiceDB Enterprise: A licensable version of SpiceDB that comes with additional functionality expected in a production environment.
- Gold Support: 24/7 1-hour initial response-time SLA for Priority 1 (P1) issues.
- Silver Support: 9/5 24-hour initial response-time SLA for Priority 1 (P1) issues

Each of the subscriptions above includes access to our security embargo: you will be the first to know about and receive patches to critical software vulnerabilities.

Although not required, we recommend a Support Tier if purchasing a license for SpiceDB Enterprise.

For more information, please [book a call].

## Recommended Environment for SpiceDB Enterprise

The below is a minimum recommendation for an HA deployment of SpiceDB Enterprise.

  - Kubernetes 1.24+
    - At least 3 x 2 vCPU, 4 GiB Memory nodes.
    - Project Contour Ingress 1.19+

For single-region deployments, an HA deployment of PostgreSQL using RDS or similar is suffecient.

For additional resiliency and multi-region support we recommend [CockroachLabs'](https://www.cockroachlabs.com) CockroachDB Self-Hosted or Cloud. If deploying within GCP, we recommend [Google's Cloud Spanner](https://cloud.google.com/spanner).

For help right-sizing your deployment, please [book a call].

[book a call]: https://authzed.com/call