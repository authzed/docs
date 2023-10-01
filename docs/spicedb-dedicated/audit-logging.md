---
title: Audit Logging in SpiceDB Dedicated
description: Learn how to configure audit logging in SpiceDB Dedicated.
sidebar_label: Audit Logging
---

# Audit Logging in SpiceDB Dedicated

Audit Logging allows you to capture a log of all API calls made to SpiceDB, and is available in SpiceDB Enterprise, the licensable binary we use to power SpiceDB Dedicated.

When enabled and properly configured, SpiceDB Enterprise will asynchronously log every API call made to it and emit a stream to your preferred log sink. The logs contain full details related to a request, including a hash of the API token, RPC, payload, request IP, response and any possible errors.

For assistance in configuring Audit Logging please [contact us](/contact-us) or reach out to your dedicated account team.

## Supported Log Sink Types

Currently supported log sink types:

- Kafka
- Kinesis
- Firehose

If you'd like to see additional log sinks please [contact us](/contact-us).