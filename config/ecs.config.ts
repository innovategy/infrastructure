require('dotenv').config();

export default class Config {
  private static cpu: number = 512;

  private static minCpuUtilizationToScaleUp = 80;

  private static minRequestNumberScaleUp = 10000;

  private static memoryLimitMb: number = 256;

  private static desiredCount: number = 1;

  private static maxHealthy: number = 100;

  private static minHealthy: number = 25;

  public static getCPUForService(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_CPU`] == undefined) {
      return this.cpu;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_CPU`]);
  }

  public static getPublicDomainNameForService(name: string): string {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_DOMAIN_NAME`] == undefined) {
      return '';
    }
    return String(process.env[`ECS_SERVICE_${name.toUpperCase()}_DOMAIN_NAME`]);
  }

  public static getMemoryLimitForService(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_MEMORY_LIMIT_MIB`] == undefined) {
      return this.memoryLimitMb;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_MEMORY_LIMIT_MIB`]);
  }

  public static getDesiredCountForService(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_DESIRED_COUNT`] == undefined) {
      return this.desiredCount;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_DESIRED_COUNT`]);
  }

  public static getCpuTargetUtilizationPercent(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_CPU_UTILIZATION_TO_SCALE_UP`] == undefined) {
      return this.minCpuUtilizationToScaleUp;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_CPU_UTILIZATION_TO_SCALE_UP`]);
  }

  public static getRequestNumber(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_REQUEST_NUMBER_TO_SCALE_UP`] == undefined) {
      return this.minRequestNumberScaleUp;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_REQUEST_NUMBER_TO_SCALE_UP`]);
  }

  public static getMaxHealthyForService(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_MAX_HEALTH`] == undefined) {
      return this.maxHealthy;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_MAX_HEALTH`]);
  }

  public static getMinHealthyForService(name: string): number {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_MIN_HEALTH`] == undefined) {
      return this.minHealthy;
    }
    return Number(process.env[`ECS_SERVICE_${name.toUpperCase()}_MIN_HEALTH`]);
  }

  // TODO: remove after cdk supports security group by name
  public static getSecurityGroupIdForService(name: string): string {
    if (process.env[`ECS_SERVICE_${name.toUpperCase()}_SECURITY_GROUP_ID`] == undefined) {
      return '';
    }
    return String(process.env[`ECS_SERVICE_${name.toUpperCase()}_SECURITY_GROUP_ID`]);
  }

  public static getTaskExecutionRoleForCluster(name: string): string {
    if (process.env[`ECS_CLUSTER_${name.toUpperCase()}_TASK_EXEC_ROLE_ARN`] == undefined) {
      return '';
    }
    return String(process.env[`ECS_CLUSTER_${name.toUpperCase()}_TASK_EXEC_ROLE_ARN`]);
  }

  public static getTaskDefRoleForCluster(name: string): string {
    if (process.env[`ECS_CLUSTER_${name.toUpperCase()}_TASK_DEF_ROLE_ARN`] == undefined) {
      return '';
    }
    return String(process.env[`ECS_CLUSTER_${name.toUpperCase()}_TASK_DEF_ROLE_ARN`]);
  }

  public static getArnForCluster(name: string): string {
    if (process.env[`ECS_CLUSTER_${name.toUpperCase()}_ARN`] == undefined) {
      return '';
    }
    return String(process.env[`ECS_CLUSTER_${name.toUpperCase()}_ARN`]);
  }
}
