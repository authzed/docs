# GCP Private Service Connect

Most users of SpiceDB Dedicated on GCP privately connect to SpiceDB with GCP [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect). Private Service Connect enables a private connection from your GCP Project and VPC to SpiceDB. Users of SpiceDB Dedicated also have the option to configure SpiceDB to be accessed from the open internet.

## Connect to SpiceDB Dedicated with Private Service Connect

![/img/gcp_dedicated_diagram.png](/img/gcp_dedicated_diagram.png)

### Prerequisites

Before you can start using SpiceDB Dedicated, you'll need to [get in touch](https://authzed.com/call) with the Authzed team.

### Step 1: Configure the VPC Endpoint

1. Navigate to “Private Service Connect” and make sure you are on the “Connected Endpoints” tab.
2. Click “Connect Endpoint”

| Option                 | Selection |
| ---------------------  | ------------------- |
| Target                 | “Published service” |
| Target service         | This will be provided to you by Authzed |
| Endpoint name          | Name this whatever you want |
| Network and subnetwork | Select the networks you need connectivity from |
| IP address             | Choose whatever IP you'd like |

### Step 2: Enable DNS

1. Navigate to Cloud DNS and create a zone

   | Option | Selection |
   | ---------------------  | ------------------- |
   | Zone type | private |
   | DNS Name | This will be provided to you by Authzed |
   | Networks | Select the network where the Private Service Connect endpoint is deployed |

2. Add record set

   | Option | Selection |
   | ---------------------  | ------------------- |
   | DNS name | This will be provided to you by Authzed |
   | IP address | Enter your Private Service Connect endpoint IP |

### Step 3: Add Permission System

1. Login to your SpiceDB management console
2. On the homepage, select "Add Permission System"
3. Configure your permission system to your liking and create it
4. If you enabled [Fine Grained Access Management (FGAM)](/spicedb-dedicated/fgam), configure it and provision a token. Otherwise, provision a token without FGAM

### Step 4: Verify Connectivity

Verify connectivity from client machine with the [Zed CLI tool](https://github.com/authzed/zed)

``` zed
zed context set permission_system_name example.com:443 sdbst_h256_123
```

``` zed
zed schema write example.yaml
```

``` zed
zed schema read
```

The last Zed command should display the schema to your terminal. If you encounter an error with any of the Zed commands, reach out to us via [support@authzed.com](support@authzed.com) or via your shared Slack channel.
