get-vpc-info
======

This Lambda function implements a custom Cloudformation resource that return information about a VPC such as CIDR and AWS provided DNS servers.

This function easily integrates into the Innablr CloudFormation deployment automation *cloudformation-ops-seed* (https://bitbucket.org/innablr/cloudformation-ops-seed.git).

Include it into your project
------

From your `ops` repository root execute a command:

```
$ git submodule add git@bitbucket.org:innablr/get-vpc-info-lambda.git src/getVpcInfo
```

Your `ops-seed` package will start building and uploading this lambda function automatically.

Deploy it together with your stack
------

Use `!LambdaZip` directive in the parameters file to pass the zip-file to the Cloudformation stack:

```
stacks:
  - name: proxy-squid-farm
    template: squid-farm.cf.yaml
    parameters:
      VpcInfoLambdaCode: !LambdaZip getVpcInfo.zip
```

Use it in your stack
------

You can use it as a custom Cloudformation resource that provides the information about a VPC through the Cloudformation `!GetAtt` intrinsic function:

```
  VpcInfo:
    Type: Custom::VpcInfo
    Properties:
      VpcId: !Ref VpcId
      ServiceToken: !GetAtt GetVpcInfoLambda.Arn

  ...

    CidrIp: !GetAtt VpcInfo.VpcCidr

  ...

    DnsServer: !GetAtt VpcInfo.AmazonProvidedDNSServer

```

Refer to a sample stack in the `examples` directory.

Currently it supports the following `!GetAtt` attributes:

| Attribute | Description |
| ----------- | ------------- |
| VpcCidr   | Returns the CIDR |
| AmazonProvidedDNSServer | Returns the second IP address in the VPC range that is allocated for the AWS provided DNS |