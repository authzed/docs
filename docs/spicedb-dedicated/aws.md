# SpiceDB Dedicated on AWS

[SpiceDB Dedicated](/spicedb-dedicated/overview) on AWS is a fully-managed version of SpiceDB that is operated by our expert SRE team in an AWS account owned by Authzed and dedicated to your SpiceDB cluster. 

Most users of SpiceDB Dedicated privately connect to SpiceDB with AWS [PrivateLink](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/aws-privatelink.html). PrivateLink enables a private connection from your AWS account and VPC to SpiceDB. Users of SpiceDB Dedicated also have the option to configure SpiceDB to be accessed from the open internet without PrivateLink.   

## Connect to SpiceDB Dedicated with PrivateLink

![/img/aws_dedicated_diagram.png](/img/aws_dedicated_diagram.png)

### Prerequisites
Before you can start using SpiceDB Dedicated, you'll need to [get in touch](https://authzed.com/call) with the Authzed team. 

### Step 1: Configure the VPC Endpoint
- In the AWS management console for the account you want to connect to SpiceDB, navigate to VPC → Endpoints → Create Endpoint
    - Name tag: Choose whatever you want
    - Service category: Select “Other endpoint services”
    - Service name: Enter the "service name" provided to you by the Authzed team 
    - VPC 
        - Choose the VPC from where you will deploy your SpiceDB client. DNS resolution for your SpiceDB cluster endpoint address will only be available from this VPC. 
    - Subnets
        - You can deploy your VPC endpoint in one subnet per AZ. We recommend choosing all AZs where SpiceDB clients will exist. 
    - IP address type: IPV4
    - Security Group: Choose a security group that allows port 443 inbound from your clients
- Click “Create endpoint”

### Step 2: Enable DNS
- Navigate to the Endpoint you just created.
    - Select the "Actions" drop down → "Modify private DNS name"
    - Check “enable for this endpoint”
    - Click “save changes”

### Step 3: Add Permission System 
- Login to your SpiceDB management console
- On the homepage, select "Add Permission System"
- Configure your permission system to your liking and create it
- If you enabled [Fine Grained Access Management (FGAM)](/spicedb-dedicated/fgam), configure it and provision a token. Otherwise, provision a token without FGAM

### Step 4: Verify Connectivity
Verify connectivity from client machine with Zed CLI tool
``` zed
zed context set permission_system_name example.com:443 sdbst_h256_123
```
``` zed
zed schema write example.yaml
```
``` zed
zed schema read
```