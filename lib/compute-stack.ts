import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import {computeConfig} from "../config/compute.config";
import { ApplicationProtocol} from '@aws-cdk/aws-elasticloadbalancingv2';

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, computeConfig.VpcName, {
      maxAzs: computeConfig.VpcMaxAzs,
    });

    const repo = new ecr.Repository(this, computeConfig.ECRRepositoryName, {
      imageScanOnPush: computeConfig.ECRScanOnPush
    });

    const cluster = new ecs.Cluster(this, computeConfig.Name, {
      vpc: vpc
    });

    const zone = new PublicHostedZone(this, 'PHZ', {
      zoneName: computeConfig.DomainName,
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, computeConfig.FargateId, {
      cluster: cluster, 
      cpu: computeConfig.CPUS,
      desiredCount: computeConfig.DesiredCount,
      memoryLimitMiB: computeConfig.MemoryLimitMib,
      publicLoadBalancer: true,
      domainName: computeConfig.DomainName,
      protocol: computeConfig.Https ?ApplicationProtocol.HTTPS: ApplicationProtocol.HTTP,
      targetProtocol: ApplicationProtocol.HTTP,
      redirectHTTP: computeConfig.Https,
      domainZone: zone,
      taskImageOptions: { 
        image: ecs.ContainerImage.fromEcrRepository(repo, "latest") 
      },
    });
    
  }
}
