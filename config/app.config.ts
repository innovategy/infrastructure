require('dotenv').config();

export default class Config {
  private static appEnv: string = "Production";
  private static appDebug: boolean = false;
  private static logChannel: string = "stack";
  private static appURL: string = "https://api.noutaja.io";
  private static exposeApi: boolean = true;
  private static dbConnection: string = "pgsql";
  private static cacheDriver: string = "redis";
  private static entitiesCacheDriver: string = "redis";
  private static queueConnection: string = "sqs";
  private static sessionDriver: string = "database";
  private static sessionLifeTime: number = 120;
  private static mailer: string = "smtp";
  private static mailerHost: string = "smtp.mailtrap.io";
  private static mailerPort: number = 2525;
  private static mailerEncryption: string = "smtp";
  private static awsBucket: string = "audit-blobs";
  private static awsDefaultRegion: string = "eu-central-1";

  public static getAppEnv(): string {
    if (process.env.APP_ENV == undefined) {
      return this.appEnv;
    }
    return String(process.env.APP_ENV);
  }

  public static getAppDebug(): boolean {
    if (process.env.APP_DEBUG == undefined) {
      return this.appDebug;
    }
    return Boolean(process.env.APP_DEBUG);
  }

  public static getAppURL(): string {
    if (process.env.APP_URL == undefined) {
      return this.appURL;
    }
    return String(process.env.APP_URL);
  }

  public static getLogChannel(): string {
    if (process.env.LOG_CHANNEL == undefined) {
      return this.logChannel;
    }
    return String(process.env.LOG_CHANNEL);
  }

  public static getExposeApi(): boolean {
    if (process.env.EXPOSE_API == undefined) {
      return this.exposeApi;
    }
    return Boolean(process.env.EXPOSE_API);
  }

  public static getCacheDriver(): string {
    if (process.env.CACHE_DRIVER == undefined) {
      return this.cacheDriver;
    }
    return process.env.CACHE_DRIVER;
  }

  public static getCacheDriverForEntities(): string {
    if (process.env.ENTITIES_CACHE_DRIVER == undefined) {
      return this.entitiesCacheDriver;
    }
    return process.env.ENTITIES_CACHE_DRIVER;
  }

  public static getQConnection(): string {
    if (process.env.QUEUE_CONNECTION == undefined) {
      return this.queueConnection;
    }
    return process.env.QUEUE_CONNECTION;
  }

  public static getSessionDriver(): string {
    if (process.env.SESSION_DRIVER == undefined) {
      return this.sessionDriver;
    }
    return process.env.SESSION_DRIVER;
  }

  public static getDbConnection(): string {
    if (process.env.DB_CONECTION == undefined) {
      return this.dbConnection;
    }
    return process.env.DB_CONECTION;
  }

  public static getSessionLifetime(): number {
    if (process.env.SESSION_LIFETIME == undefined) {
      return this.sessionLifeTime;
    }
    return Number(process.env.SESSION_LIFETIME);
  }

  public static getMailer(): string {
    if (process.env.MAIL_MAILER == undefined) {
      return this.mailer;
    }
    return process.env.MAIL_MAILER;
  }


  public static getMailHost(): string {
    if (process.env.MAIL_HOST == undefined) {
      return this.mailerHost;
    }
    return process.env.MAIL_HOST;
  }

  public static getMailPort(): number {
    if (process.env.MAIL_PORT == undefined) {
      return this.mailerPort;
    }
    return Number(process.env.MAIL_PORT);
  }

  public static getMailEncryption(): string {
    if (process.env.MAILER_ENCRYPTION == undefined) {
      return this.mailerEncryption;
    }
    return process.env.MAILER_ENCRYPTION;
  }

  public static getAwsDefaultRegion(): string {
    if (process.env.AWS_DEFAULT_REGION == undefined) {
      return this.awsDefaultRegion;
    }
    return process.env.AWS_DEFAULT_REGION;
  }

  public static getAwsBucket(): string {
    if (process.env.AWS_BUCKET == undefined) {
      return this.awsBucket;
    }
    return process.env.AWS_BUCKET;
  }
}
