import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { CfnParameter } from '@aws-cdk/core';

export interface clusterConfig {
  cpu: number;
  desiredCount: number;
  memoryLimitMiB: number;
}

export class ComputeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, this.getVpcName(), this.getVpcProps());

    const cluster = new ecs.Cluster(this, this.getEcsClusterName(), {
      vpc: vpc
    });

    const clusterConfig = this.getEcsClusterConfig();

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, this.getFargateServiceId(), {
      cluster: cluster, 
      cpu: clusterConfig.cpu, 
      desiredCount: clusterConfig.desiredCount, 
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") }, // TODO: add image
      memoryLimitMiB: clusterConfig.memoryLimitMiB,
      publicLoadBalancer: true, 
    });
  }

  private getEcsClusterConfig() :clusterConfig {
    const cpu = new CfnParameter(this, "cpu", {
      type: "StriNumberng",
      description: "The name of the cluster that the ecs will create. default: 256",
      default: 256
    });

    const desiredCount = new CfnParameter(this, "desiredCount", {
      type: "Number",
      description: "The desired count of tasks. default: 1 ",
      default: 1
    });

    const memoryLimitMiB = new CfnParameter(this, "memoryLimitMiB", {
      type: "Number",
      description: "The desired count of tasks. default: 512 ",
      default: 512
    });

    return {
      cpu: cpu.valueAsNumber,
      desiredCount: desiredCount.valueAsNumber,
      memoryLimitMiB: memoryLimitMiB.valueAsNumber,
    }

  }

  private getEcsClusterName() :string {
    const clusterName = new CfnParameter(this, "clusterName", {
      type: "String",
      description: "The name of the cluster that the ecs will create. default: MyCluster",
      default: "MyCluster"
    });

   return clusterName.valueAsString; 
  }

  private getFargateServiceId() :string{
    const vpcName = new CfnParameter(this, "fargateServiceId", {
      type: "String",
      description: "The name of the fargate service. default: MyFargateService",
      default: "MyFargateService"
    });

   return vpcName.valueAsString;
  }

  private getVpcName() :string {
    const vpcName = new CfnParameter(this, "vpcName", {
      type: "String",
      description: "The name of the vpcName where it was created by CDK or will be create one. default: MyVpc",
      default: "MyVpc"
    });

   return vpcName.valueAsString;
  }

  private getVpcProps() :object {
      const maxAzs = new CfnParameter(this, "maxAzs", {
      type: "Number",
      description: "The maximum number of availability-zones that the vpc should create. default: 1",
      default: 1
    });
  
      return {
        maxAzs: maxAzs.valueAsNumber
      };
  }
}
