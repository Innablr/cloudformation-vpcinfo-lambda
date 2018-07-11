const cfnResponse = require('cfn-response-promise');
const AWS = require('aws-sdk');
const {IPAddress, Crunchy} = require('ipaddress');

async function fetchVpcInfo(event, context) {
    const vpcId = event.ResourceProperties.VpcId;
    const ec2 = new AWS.EC2();
    if (vpcId === undefined) {
        console.error('VpcId is undefined');
        return await cfnResponse.send(event, context, cfnResponse.FAILED, {});
    }
    console.log(`Now fetching information about VPC ${vpcId}`);
    try {
        const r = await ec2.describeVpcs({VpcIds: [vpcId]}).promise();
        const vpc = r.Vpcs[0];
        const cidr = IPAddress.parse(vpc.CidrBlock);
        const awsDnsServer = cidr.from(cidr.first().host_address.add(Crunchy.one()), cidr.prefix);
        console.log(`Got lots of info about VPC ${vpcId}, reporting success`);
        return await cfnResponse.send(event, context, cfnResponse.SUCCESS, {
            VpcCidr: cidr.to_string(),
            AmazonProvidedDNSServer: awsDnsServer.to_s()
        });
    } catch(e) {
        console.error(`Oh noes, I can't get VPC info: ${JSON.stringify(e)}`);
        return await cfnResponse.send(event, context, cfnResponse.FAILED, {});
    }
};

exports.handler = fetchVpcInfo;
