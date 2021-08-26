import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import LoadBalancedFargateService from '../lib/ecs/loadbalanced-fargate-service';
import Config from '../config/ecs.config';
import {ContainerDefinitionOptions} from "@aws-cdk/aws-ecs";


interface ILoadBalancedServiceProps {
  hostedZone: route53.PublicHostedZone;
  cluster: ecs.Cluster,
  containers: ContainerDefinitionOptions[]
}

export class WebServiceStack extends cdk.Stack {
  private readonly serviceName: string = 'ailliz';

  constructor(scope: cdk.Construct, id: string, service: ILoadBalancedServiceProps, props?: cdk.StackProps) {
    super(scope, id, props);

    const loadBalancedFargateService = new LoadBalancedFargateService()
      .inCluster(service.cluster)
      .inScope(this)
      .inDomainHostZone(service.hostedZone)
      .domainNameToLoadBalancer(Config.getPublicDomainNameForService(this.serviceName))
      .setName(this.serviceName)
      .withCount(Config.getDesiredCountForService(this.serviceName))
      .limitServiceMemory(Config.getMemoryLimitForService(this.serviceName))
      .numberOfCPU(Config.getCPUForService(this.serviceName))
      .maxServiceToBeHealthyForDeployment(Config.getMaxHealthyForService(this.serviceName))
      .minServiceToBeHealthyForDeployment(Config.getMinHealthyForService(this.serviceName))
      .enableAutoScaling()
      .minCpuTargetUtilizationPercentToScaleUp(Config.getCpuTargetUtilizationPercent(this.serviceName))
      .minNumberOfRequestsToScaleUp(Config.getRequestNumber(this.serviceName));

    service.containers.forEach(container => {
      loadBalancedFargateService.addContainer(container)
    })

    loadBalancedFargateService.build();
  }
}
