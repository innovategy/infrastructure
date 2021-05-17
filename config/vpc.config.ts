import { config } from 'dotenv';

export default class Config {
  private static maxAz: number = 2;

  private static vpcName: string = 'prod';

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
}
