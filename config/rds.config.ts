require('dotenv').config();

export default class Config {
  private static autoPause: number = 10;

  private static backupRetentionDurationPolicy: number = 1;

  private static databaseName: string = 'default';

  public static getAutoPauseDuration(): number {
    if (process.env.RDS_SERVERLESS_AUTO_PAUSE_DURATION == undefined) {
      return this.autoPause;
    }
    return Number(process.env.RDS_SERVERLESS_AUTO_PAUSE_DURATION);
  }

  public static getBackupRetentionDurationPolicy(): number {
    if (process.env.RDS_SERVERLESS_BACKUP_RETENTION_PERIOD == undefined) {
      return this.backupRetentionDurationPolicy;
    }
    return Number(process.env.RDS_SERVERLESS_BACKUP_RETENTION_PERIOD);
  }

  public static getDatabaseName(): string {
    if (process.env.RDS_SERVERLESS_DB_NAME == undefined) {
      return this.databaseName;
    }
    return String(process.env.RDS_SERVERLESS_DB_NAME);
  }
}
