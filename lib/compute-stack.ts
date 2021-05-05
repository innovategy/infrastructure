import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { CfnParameter } from '@aws-cdk/core';
import { EcrImage } from '@aws-cdk/aws-ecs';
import {computeConfig} from "../config/compute.config";

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
    const vpc = new ec2.Vpc(this, computeConfig.VpcName, {
      maxAzs: computeConfig.VpcMaxAzs,
    });

    const cluster = new ecs.Cluster(this, computeConfig.Name, {
      vpc: vpc
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, computeConfig.FargateId, {
      cluster: cluster, 
      cpu: computeConfig.CPUS,
      desiredCount: computeConfig.DesiredCount,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: computeConfig.MemoryLimitMib,
      publicLoadBalancer: true,
    });
    
  }
}
