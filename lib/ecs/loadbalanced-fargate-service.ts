import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as route53 from '@aws-cdk/aws-route53';

export default class LoadBalancedFargateService {
  private repo: ecr.Repository;

  private service: ecs_patterns.ApplicationLoadBalancedFargateService;

  private scalingProps: ecs.ScalableTaskCount;

  private scope: cdk.Construct;

  private cluster: ecs.Cluster;

  private cpu: number;

  private memoryLimitMiB: number;

  private domainName: string;

  private domainZone: route53.IHostedZone;

  private desiredCount: number;

  private maxHealthyPercent: number;

  private minHealthyPercent: number;

  private serviceName: string;

  public build(): ecs_patterns.ApplicationLoadBalancedFargateService {
    this.service = new ecs_patterns.ApplicationLoadBalancedFargateService(this.scope, this.serviceName + 'Service', {
      cluster: this.cluster,
      assignPublicIp: false,
      publicLoadBalancer: true,
      redirectHTTP: true,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      targetProtocol: elbv2.ApplicationProtocol.HTTP,
      cpu: this.cpu,
      memoryLimitMiB: this.memoryLimitMiB,
      domainName: this.domainName,
      domainZone: this.domainZone,
      maxHealthyPercent: this.maxHealthyPercent,
      minHealthyPercent: this.minHealthyPercent,
      serviceName: this.serviceName,
    });

    return this.service;
  }

  public addContainer(containerDefinition: ecs.ContainerDefinitionProps): LoadBalancedFargateService{
    if (containerDefinition.containerName != null) {
      this.service.taskDefinition.addContainer(containerDefinition.containerName, containerDefinition);
    }
    return this;
  }

  public enableAutoScaling(maxCapacity: number = this.desiredCount * 3): LoadBalancedFargateService{
    this.scalingProps = this.service.service.autoScaleTaskCount({
      minCapacity: this.desiredCount,
      maxCapacity: maxCapacity,
    });
    return this;
  }

  public minNumberOfRequestsToScaleUp(number: number): LoadBalancedFargateService{
    this.scalingProps.scaleOnRequestCount('RequestScaling', {
      requestsPerTarget: 10000,
      targetGroup: this.service.targetGroup
    })
    return this;
  }

  public minCpuTargetUtilizationPercentToScaleUp(percentage: number): LoadBalancedFargateService {
    this.scalingProps.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: percentage
    });
    return this;
  }

  public limitServiceMemory(threshold: number): LoadBalancedFargateService {
    this.memoryLimitMiB = threshold;
    return this;
  }

  public setName(name: string): LoadBalancedFargateService {
    this.serviceName = name;
    return this;
  }

  public withCount(desiredCount: number): LoadBalancedFargateService {
    this.desiredCount = desiredCount;
    return this;
  }

  public domainNameToLoadBalancer(name: string): LoadBalancedFargateService {
    this.domainName = name;
    return this;
  }

  public inDomainHostZone(hostedZone: route53.IHostedZone): LoadBalancedFargateService {
    this.domainZone = hostedZone;
    return this;
  }

  public maxServiceToBeHealthyForDeployment(maxHealthyPercent: number): LoadBalancedFargateService {
    this.maxHealthyPercent = maxHealthyPercent;
    return this;
  }

  public minServiceToBeHealthyForDeployment(minHealthyPercent: number): LoadBalancedFargateService {
    this.minHealthyPercent = minHealthyPercent;
    return this;
  }

  public readTaskImageFromRepo(repo: ecr.Repository): LoadBalancedFargateService {
    this.repo = repo;
    return this;
  }

  public inCluster(cluster: ecs.Cluster): LoadBalancedFargateService {
    this.cluster = cluster;
    return this;
  }

  public inScope(scope: cdk.Construct): LoadBalancedFargateService {
    this.scope = scope;
    return this;
  }

  public numberOfCPU(cpuForService: number): LoadBalancedFargateService {
     this.cpu = cpuForService;
     return this;
  }
}
