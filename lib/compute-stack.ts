import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { CfnParameter } from '@aws-cdk/core';


export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
        const memoryLimitMiB = new CfnParameter(this, "memoryLimitMiB", {
      type: "Number",
      description: "The desired count of tasks. default: 512 ",
      default: 512
    });


    const vpc = new ec2.Vpc(this, "vpc", {
      maxAzs: 2,
    });

    const cluster = new ecs.Cluster(this, "prod-cluster", {
      vpc: vpc
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "fargate-id", {
      cluster: cluster, 
      cpu: 256,
      desiredCount: 2,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 512,
      publicLoadBalancer: true,
    });
  }
}
