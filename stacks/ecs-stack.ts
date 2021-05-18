import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import LoadBalancedFargateService from '../lib/ecs/loadbalanced-fargate-service';
import Config from '../config/ecs.config';
import EcrConfig from '../config/ecr.config';
import EcsCluster from '../lib/ecs/ecs-cluster';
import Ecr from "../lib/ecs/ecr";

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);
    const cluster: ecs.Cluster = new EcsCluster().withName('application').inVPC(vpc).activeContainerInsights().build();
    const repo:ecr.Repository=new Ecr().maxImagesToRetain(EcrConfig.getMaxImagesToRetain()).scanImageOnPush().withName("applications").build();

    this.newLoadBalancedFargateService(scope, cluster, repo,  'ailliz');
  }

  private newLoadBalancedFargateService(scope: cdk.Construct, cluster: ecs.Cluster, repo: ecr.Repository, serviceName: string) {
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
      .readTaskImageFromRepo(repo)
      .build();
  }
}
