export default class Config{
  private static maxImagesToRetain:number;

  public static getMaxImagesToRetain():number{
    if (process.env.ECR_MAX_IMAGE_TO_RETAIN == undefined){
      return this.maxImagesToRetain;
    }
    return Number(process.env.ECR_MAX_IMAGE_TO_RETAIN);
  }
}
