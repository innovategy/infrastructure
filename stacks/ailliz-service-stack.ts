import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as route53 from "@aws-cdk/aws-route53";
import LoadBalancedFargateService from "../lib/ecs/loadbalanced-fargate-service";
import Config from "../config/ecs.config";


interface ILoadBalancedServiceProps {
  hostedZone: route53.PublicHostedZone;
  cluster: ecs.Cluster;
  repo: ecr.Repository;
}

export class AillizService extends cdk.Stack {

  private readonly serviceName:string = "ailliz";

  constructor(scope: cdk.Construct, id: string, service: ILoadBalancedServiceProps, props?: cdk.StackProps) {
    super(scope, id, props);

      new LoadBalancedFargateService()
        .inCluster(service.cluster)
        .inScope(this)
        .inDomainHostZone(service.hostedZone)
        .domainNameToLoadBalancer(Config.getPublicDomainNameForService(this.serviceName))
        .setName(this.serviceName)
        .limitServiceMemory(Config.getMemoryLimitForService(this.serviceName))
        .numberOfCPU(Config.getCPUForService(this.serviceName))
        .withCount(Config.getDesiredCountForService(this.serviceName))
        .maxServiceToBeHealthyForDeployment(Config.getMaxHealthyForService(this.serviceName))
        .minServiceToBeHealthyForDeployment(Config.getMinHealthyForService(this.serviceName))
        .readTaskImageFromRepo(service.repo)
        .build();
  }
}
