
# AWS Privatelink

Most users of SpiceDB Dedicated privately connect to SpiceDB with AWS [PrivateLink](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/aws-privatelink.html). PrivateLink enables private connections from your AWS accounts and VPCs to SpiceDB permission systems in your SpiceDB Dedicated environment. Users of SpiceDB Dedicated also have the option to configure SpiceDB to be accessed over the open internet.

## Connect to SpiceDB Dedicated with PrivateLink

![/img/aws_dedicated_diagram.png](/img/aws_dedicated_diagram.png)

### Prerequisites

Before you can start using SpiceDB Dedicated, you'll need to [get in touch](https://authzed.com/call) with the Authzed team.

### Step 1: Configure the VPC Endpoint

1. In your AWS management console for the account you want to connect to SpiceDB, navigate to VPC → Endpoints → Create Endpoint and input the following info:

| Option             | Selection |
| --------------------- | ------------------- |
| Name tag        | Choose whatever you want   |
| Service category | Select “Other endpoint services”   |
| Service name | Enter the "service name" provided to you by the Authzed team |
| VPC | Choose the VPC from where you will deploy your SpiceDB client. DNS resolution for your SpiceDB cluster endpoint address will only be available from this VPC. |
| Subnets | You can deploy your VPC endpoint in one subnet per AZ. We recommend choosing all AZs where SpiceDB clients will exist. |
| IP address type | IPV4 |
| Security Group | Choose a security group that allows inbound port 443 traffic from your clients |

2\. Click “Create endpoint”

### Step 2: Enable DNS

1. Navigate to the Endpoint you just created.
2. Select the "Actions" drop down and then select "Modify private DNS name" from the dropdown
3. Check “enable for this endpoint”
4. Click “save changes”

## Verifying Connectivity

### Step 3: Add Permission System

(You can skip this section if you've already created a permission system)

1. Login to your SpiceDB management console
2. On the homepage, select "Add Permission System"
3. Configure your permission system to your liking and create it

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

The last Zed command should display the schema to your terminal. If you encounter an error with any of the Zed commands, reach out to us via support@authzed.com or via your shared Slack channel.
