require('dotenv').config();

export default class Config {
  private static maxImagesToRetain: number = 3;

  public static getMaxImagesToRetain(): number {
    if (process.env.ECR_MAX_IMAGE_TO_RETAIN == undefined) {
      return this.maxImagesToRetain;
    }
    return Number(process.env.ECR_MAX_IMAGE_TO_RETAIN);
  }

  public static getARN():string{
    if (process.env.ECR_ARN == undefined) {
      return ""
    }
    return String(process.env.ECR_ARN);
  }
}
