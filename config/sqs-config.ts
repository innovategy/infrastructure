require('dotenv').config();

export default class Config {
  private static normalQName: string = "standard";

  public static normalJobQueueName(): string {
    if (process.env.SQS_NORMAL_JOB_Q_NAME == undefined) {
      return this.normalQName;
    }
    return process.env.SQS_NORMAL_JOB_Q_NAME;
  }

}
