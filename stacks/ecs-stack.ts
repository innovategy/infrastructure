import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import LoadBalancedFargateService from '../lib/ecs/loadbalanced-fargate-service';
import Config from "../config/ecs.config";
import EcsCluster from "../lib/ecs/ecs-cluster";

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string,vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);
    const cluster:ecs.Cluster = new EcsCluster().withName("application").inVPC(vpc).activeContainerInsights().build();


    this.newLoadBalancedFargateService(scope, cluster, "ailliz");
  }

  private newLoadBalancedFargateService(scope: cdk.Construct, cluster:ecs.Cluster, serviceName:string){
    new LoadBalancedFargateService()
      .inCluster(cluster)
      .inScope(scope)
      .inDomainHostZone()
      .domainNameToLoadBalancer()
      .setName(serviceName)
      .limitServiceMemory(Config.getMemoryLimitForService(serviceName))
      .numberOfCPU(Config.getCPUForService(serviceName))
      .withCount(Config.getDesiredCountForService(serviceName))
      .maxServiceToBeHealthyForDeployment(Config.getMaxHealthyForService(serviceName))
      .minServiceToBeHealthyForDeployment(Config.getMinHealthyForService(serviceName))
      .readTaskImageFromRepo()
      .build();
  }
}
