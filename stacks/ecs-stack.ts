import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as route53 from '@aws-cdk/aws-route53';
import LoadBalancedFargateService from '../lib/ecs/loadbalanced-fargate-service';
import Config from '../config/ecs.config';
import EcrConfig from '../config/ecr.config';
import EcsCluster from '../lib/ecs/ecs-cluster';
import Ecr from '../lib/ecs/ecr';

interface ILoadBalancedServiceProps {
  hostedZone: route53.PublicHostedZone;
  serviceName: string;
}

export class EcsStack extends cdk.Stack {
  private readonly cluster: ecs.Cluster;

  private readonly ecrRepository: ecr.Repository;

  constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);
    this.cluster = new EcsCluster().inScope(this).withName('application').inVPC(vpc).activeContainerInsights().build();
    this.ecrRepository = new Ecr()
      .inScope(this)
      .maxImagesToRetain(EcrConfig.getMaxImagesToRetain())
      .scanImageOnPush()
      .withName('applications')
      .build();
  }

  public newLoadBalancedFargateService(props: ILoadBalancedServiceProps) {
    new LoadBalancedFargateService()
      .inCluster(this.cluster)
      .inScope(this)
      .inDomainHostZone(props.hostedZone)
      .domainNameToLoadBalancer(Config.getPublicDomainNameForService(props.serviceName))
      .setName(props.serviceName)
      .limitServiceMemory(Config.getMemoryLimitForService(props.serviceName))
      .numberOfCPU(Config.getCPUForService(props.serviceName))
      .withCount(Config.getDesiredCountForService(props.serviceName))
      .maxServiceToBeHealthyForDeployment(Config.getMaxHealthyForService(props.serviceName))
      .minServiceToBeHealthyForDeployment(Config.getMinHealthyForService(props.serviceName))
      .readTaskImageFromRepo(this.ecrRepository)
      .build();
  }

  public getCluster():ecs.Cluster{
    return this.cluster;
  }

  public getRepo():ecr.Repository{
    return this.ecrRepository;
  }
}
