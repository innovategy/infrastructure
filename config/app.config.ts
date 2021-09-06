require('dotenv').config();

export default class Config {
  private static appEnv: string = "production";
  private static appDebug: boolean = false;
  private static logChannel: string = "stderr";
  private static appURL: string = "https://dashboard.noutaja.io";
  private static linkedinCallbackUri: string = "https://dashbard.noutaja.io/linkedin/callback";
  private static githubCallbackUri: string = "https://dashbard.noutaja.io/github/callback";
  private static elasticCacheEndpoint: string = "localhost";
  private static exposeApi: boolean = true;
  private static dbConnection: string = "pgsql";
  private static cacheDriver: string = "redis";
  private static entitiesCacheDriver: string = "redis";
  private static queueConnection: string = "sqs";
  private static queueName: string = "normal";
  private static queuePrefix: string = "";
  private static sessionDriver: string = "database";
  private static sessionLifeTime: number = 120;
  private static mailer: string = "smtp";
  private static mailerHost: string = "smtp.mailtrap.io";
  private static mailerPort: number = 2525;
  private static mailerEncryption: string = "smtp";
  private static awsBucket: string = "audit-blobs";
  private static awsDefaultRegion: string = "eu-central-1";
  private static dbSchema: string = "rbac";
  private static defaultCurrency: string = "eur";

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

  public static getQName(): string {
    if (process.env.QUEUE_NAME == undefined) {
      return this.queueName;
    }
    return process.env.QUEUE_NAME;
  }

  public static getQPrefix(): string {
    if (process.env.QUEUE_NAME == undefined) {
      return this.queuePrefix;
    }
    return process.env.QUEUE_NAME;
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

  public static getDefaultCurrecny(): string {
    if (process.env.DEFAULT_CURRENCY == undefined) {
      return this.defaultCurrency;
    }
    return process.env.DEFAULT_CURRENCY;
  }

  public static getDbSchema(): string {
    if (process.env.DB_SCHEMA == undefined) {
      return this.dbSchema;
    }
    return process.env.DB_SCHEMA;
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

  public static getRedisCacheEndpoint(): string {
    if (process.env.CACHE_HOST == undefined) {
      return this.elasticCacheEndpoint;
    }
    return process.env.CACHE_HOST;
  }

  public static getLinkedinAccountID(): string {
    if (process.env.LINKEDIN_CLIENT_ID == undefined) {
      throw new Error("Linkedin account id not found")
    }
    return process.env.LINKEDIN_CLIENT_ID;
  }

  public static getLinkedinCallbackUri(): string {
    if (process.env.LINKEDIN_CALLBACK_URI == undefined) {
      throw this.linkedinCallbackUri;
    }
    return process.env.LINKEDIN_CALLBACK_URI;
  }

  public static getGithubCallbackUri(): string {
    if (process.env.GITHUB_CALLBACK_URI == undefined) {
      throw this.githubCallbackUri;
    }
    return process.env.GITHUB_CALLBACK_URI;
  }

  public static getGithubAccountId(): string {
    if (process.env.GITHUB_CLIENT_ID == undefined) {
      throw new Error("Github account id not found")
    }
    return process.env.GITHUB_CLIENT_ID;
  }
}
