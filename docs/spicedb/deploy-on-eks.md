# Deploy SpiceDB on EKS

This guide will show you how to deploy a highly available and secure SpiceDB cluster on EKS. If you’d rather quickly try out SpiceDB, check out our [getting started guide](../guides/first-app.mdx).

## Prerequisites

- Running EKS cluster
- Route 53 External Hosted Zone

## Configure external TLS with Acme + Cert-Manager

This guide utilizes the Let’s Encrypt DNS-01 challenge via CertManager to generate a TLS certificate for the external SpiceDB endpoints.

### Create an IAM policy and attach it to the role for your EKS pods

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "route53:GetChange",
      "Resource": "arn:aws:route53:::change/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets"
      ],
      "Resource": "arn:aws:route53:::hostedzone/*" 
    {
      "Effect": "Allow",
      "Action": "route53:ListHostedZonesByName",
      "Resource": "*"
    }
  ]
}
```

### Install Cert-Manager on the cluster

- Install cert manager with: `kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml`

### Create an issuer and a certificate

```yaml
cat << EOF > spicedb-issuer.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: spicedb
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: spicedb-tls-issuer
  namespace: spicedb
spec:
  acme:
    email: example@email.com                                # Change this
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-production
    solvers:
    - selector:
        dnsZones:
          - "example.com"                                  # Change this
      dns01:
        route53:
          region: us-east-1                                # Change this
          hostedZoneID: ABC123ABC123                       # Change this
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: spicedb-le-certificate
  namespace: spicedb
spec:
  secretName: spicedb-le-tls
  issuerRef:
    name: spicedb-tls-issuer
    kind: ClusterIssuer
  commonName: demo.example.com                            # Change this
  dnsNames:
  - demo.example.com                                      # Change this
EOF
```

- Apply the above configuration with: `kubectl apply -f spicedb-issuer.yaml`
- After about one minute, run the command `kubectl get secrets -n spicedb`. If the `spicedb-le-tls` secret is **not** present, follow this [troubleshooting guide](https://cert-manager.io/docs/troubleshooting/acme/).

## Configure Internal TLS for dispatch with CertManager

[Dispatching](configuring-dispatch#what-is-dispatching) is a feature of SpiceDB where requests to SpiceDB are, in turn, forwarded onto ("dispatched") to other SpiceDB nodes within the cluster, to allow for reuse of cache.

Dispatch requires pod to pod horizontal communication and thus requires encryption for this communication.

```yaml
cat << EOF > internal-dispatch.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: dispatch-selfsigned-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: dispatch-ca
  namespace: spicedb
spec:
  isCA: true
  commonName: dev.spicedb   #Change optional: in this example, "dev" is the name of the SpiceDBCluster object (defined at the "Configure SpiceDB settings" step below). If you don't wan't use "dev", change "dev" to what you will use.
  dnsNames:
  - dev.spicedb             #Change optional: (see above)
  secretName: dispatch-root-secret
  privateKey:
    algorithm: ECDSA
    size: 256
  issuerRef:
    name: dispatch-selfsigned-issuer
    kind: ClusterIssuer
    group: cert-manager.io
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: my-ca-issuer
  namespace: cert-manager
spec:
  ca:
    secretName: dispatch-root-secret
EOF
```

- Apply the above configuration with: `kubectl apply -f internal-dispatch.yaml`

## Deploy a Datastore

Deploy a Postgres RDS datastore that is network reachable from SpiceDB’s EKS cluster. SpiceDB will connect to your Postgres DB with a connection string.

## Configure and Deploy SpiceDB

### Initialize the Operator

- Install a release of the operator with: `kubectl apply --server-side -f https://github.com/authzed/spicedb-operator/releases/latest/download/bundle.yaml`

### Configure SpiceDB settings

```yaml
cat << EOF > spicedb-config.yaml
apiVersion: authzed.com/v1alpha1
kind: SpiceDBCluster
metadata:
  name: dev                                #Change optional: you can change this name, but be mindful of your dispatch TLS certificate URL and service selector
spec:
  config:
    datastoreEngine: postgres                          
    replicas:  2                           #Change optional: at least two replicas are required for HA           
    tlsSecretName: spicedb-le-tls
    dispatchUpstreamCASecretName: dispatch-root-secret
    dispatchClusterTLSCertPath: "/etc/dispatch/tls.crt"
    dispatchClusterTLSKeyPath: "/etc/dispatch/tls.key"
  secretName: dev-spicedb-config
  patches:                                
  - kind: Deployment
     patch:  
       spec:
         template:
           spec:
             containers:
             - name: spicedb
               volumeMounts:
               - name: custom-dispatch-tls
                 readOnly: true
                 mountPath: "/etc/dispatch"
             volumes:
             - name: custom-dispatch-tls
               secret:
                 secretName: dispatch-root-secret
---
apiVersion: v1
kind: Secret
metadata:
  name: dev-spicedb-config
stringData:
  preshared_key: "averysecretpresharedkey" #Change: this is your API token definition and should be kept secure. 
  datastore_uri: "postgresql://user:password@postgres.com:5432" #Change: this is a Postgres connection string
EOF
```

- Apply the above configuration with: `kubectl apply -f spicedb-config.yaml -n spicedb`

## Deploy Cloud Load Balancer Service

This step will deploy a service of type load balancer, which will deploy an external AWS load balancer to route traffic to our SpiceDB pods.

```yaml
cat << EOF > spicedb-lb.yaml
apiVersion: v1
kind: Service
metadata:
  name: spicedb-external-lb
  namespace: spicedb
spec:
  ports:
  - name: grpc
    port: 50051
    protocol: TCP
    targetPort: 50051
  - name: gateway
    port: 8443
    protocol: TCP
    targetPort: 8443
  - name: metrics
    port: 9090
    protocol: TCP
    targetPort: 9090
  selector:
    app.kubernetes.io/instance: dev-spicedb    #Change optional: in this example, "dev" is the name of the SpiceDBCluster object. If you didn't use "dev", change "dev" to what you used. 
  sessionAffinity: None
  type: LoadBalancer
EOF
```

- Apply the above configuration with: `kubectl apply -f spicedb-lb.yaml`
- Run the following command to get the External-IP of the load balancer: `kubectl get services spicedb-external-lb -o json | jq '.status.loadBalancer.ingress[0].hostname'`
- Take the output of the command and add it as a C-Name record in your route 53 hosted zone

## Test

You can use the Zed CLI tool to make sure everything works as expected:

`zed context set eks-guide demo.example.com averysecretpresharedkey`

Write a schema

```yaml
zed schema write <(cat << EOF
definition user {}

definition doc {
  relation owner: user
  permission view = owner
}
EOF
)
```

Write a relationship:

```yaml
zed relationship create doc:1 writer user:emilia
```

Check a permission:

```yaml
zed permission check doc:1 view user:emilia
```
