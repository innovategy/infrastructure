import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from "@aws-cdk/aws-ec2";
import { computeConfig } from '../config/compute.config';

export class DataStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = ec2.Vpc.fromLookup(this, "vpc", {
            isDefault: false,
            vpcName: "ComputeStack/" + computeConfig.VpcName
        })

        const cluster = new rds.DatabaseCluster(this, 'InstancePrimary', {
            engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_12_4}),
            credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
            instanceProps: {
              instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
              vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE,
              },
              vpc,
            },
          });
    }
}