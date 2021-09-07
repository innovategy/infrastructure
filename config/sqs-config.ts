require('dotenv').config();

export default class Config {
  private static normalQName: string = "normal";

  public static normalJobQueueName(): string {
    if (process.env.SQS_NORMAL_JOB_Q_NAME == undefined) {
      return this.normalQName;
    }
    return process.env.SQS_NORMAL_JOB_Q_NAME;
  }

}
