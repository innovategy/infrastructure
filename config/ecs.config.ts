require('dotenv').config();

export default class Config {
  private static cpu: number = 512;

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
}
