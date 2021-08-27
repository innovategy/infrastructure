import {ContainerDefinitionOptions, ScalableTaskCount} from "@aws-cdk/aws-ecs";
import {ApplicationLoadBalancedFargateService} from "@aws-cdk/aws-ecs-patterns";

export default class ScaleProps{
  private service: ApplicationLoadBalancedFargateService;

  private scalingProps: ScalableTaskCount;

  constructor(service: ApplicationLoadBalancedFargateService) {
    this.service = service;
  }

  public getService():ApplicationLoadBalancedFargateService{
    return this.service;
  }

  public addContainer(containerDefinition: ContainerDefinitionOptions): ScaleProps {
    if (containerDefinition.containerName != null) {
      this.service.taskDefinition.addContainer(containerDefinition.containerName, containerDefinition);
    }
    return this;
  }

  public enableAutoScaling(maxCapacity: number ): ScaleProps {
    this.scalingProps = this.service.service.autoScaleTaskCount({
      minCapacity: this.service.internalDesiredCount,
      maxCapacity: maxCapacity,
    });
    return this;
  }

  public minNumberOfRequestsToScaleUp(number: number): ScaleProps {
    this.scalingProps.scaleOnRequestCount('RequestScaling', {
      requestsPerTarget: number,
      targetGroup: this.service.targetGroup,
    });
    return this;
  }

  public minCpuTargetUtilizationPercentToScaleUp(percentage: number): ScaleProps {
    this.scalingProps.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: percentage,
    });
    return this;
  }
}
