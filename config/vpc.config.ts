import { config } from 'dotenv';

export default class Config {
  private static maxAz: number = 2;

  private static vpcName: string = 'prod';

  private static publicSubnetName: string = 'ingress';

  private static publicSubnetCidr: number = 24;

  private static privateSubnetName: string = 'application';

  private static privateSubnetCidr: number = 24;

  private static isolatedSubnetName: string = 'rds';

  private static isolatedSubnetCidr: number = 28;

  public static getMaxAz(): number {
    if (process.env.VPC_Max_Azs != undefined) {
      return this.maxAz;
    }
    return Number(process.env.VPC_Max_Azs);
  }

  public static getName(): string {
    if (process.env.VPC_NAME != undefined) {
      return this.vpcName;
    }
    return String(process.env.VPC_NAME);
  }

  public static getPublicCidrMask(): number {
    if (process.env.VPC_PUBLIC_SUBNET_CIDR_MASK != undefined) {
      return this.publicSubnetCidr;
    }
    return Number(process.env.VPC_PUBLIC_SUBNET_CIDR_MASK);
  }

  public static getPrivateCidrMask(): number {
    if (process.env.VPC_PRIVATE_SUBNET_CIDR_MASK != undefined) {
      return this.privateSubnetCidr;
    }
    return Number(process.env.VPC_PRIVATE_SUBNET_CIDR_MASK);
  }

  public static getIsolatedCidrMask(): number {
    if (process.env.VPC_ISOLATED_SUBNET_CIDR_MASK != undefined) {
      return this.isolatedSubnetCidr;
    }
    return Number(process.env.VPC_ISOLATED_SUBNET_CIDR_MASK);
  }

  public static getPublicSubnetName(): string {
    if (process.env.VPC_PUBLIC_SUBNET_NAME != undefined) {
      return this.publicSubnetName;
    }
    return String(process.env.VPC_PUBLIC_SUBNET_NAME);
  }

  public static getPrivatevSubnetName(): string {
    if (process.env.VPC_PRIVATE_SUBNET_NAME != undefined) {
      return this.privateSubnetName;
    }
    return String(process.env.VPC_PRIVATE_SUBNET_NAME);
  }

  public static getIsolateSubnetName(): string {
    if (process.env.VPC_ISOLATED_SUBNET_NAME != undefined) {
      return this.isolatedSubnetName;
    }
    return String(process.env.VPC_ISOLATED_SUBNET_NAME);
  }
}
