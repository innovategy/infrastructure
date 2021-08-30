import Config from "../../config/app.config";
import {Secret} from "@aws-cdk/aws-ecs";
import * as ssm from "@aws-cdk/aws-ssm";
import {Construct,} from "@aws-cdk/core";

export default class App {
  public static readEnvs(): { [key: string]: string} {
    return {
      "APP_ENV": Config.getAppEnv(),
      "APP_DEBUG": String(Config.getAppDebug()),
      "APP_URL": Config.getAppURL(),
      "LOG_CHANNEL": Config.getLogChannel(),
      "EXPOSE_API": String(Config.getExposeApi()),
      "DB_CONNECTION": Config.getDbConnection(),
      "DB_SCHEMA": Config.getDbSchema(),
      "CACHE_DRIVER": Config.getCacheDriver(),
      "REDIS_HOST": Config.getRedisCacheEndpoint(),
      "MODEL_CACHE_STORE": Config.getCacheDriverForEntities(),
      "LINKEDIN_CALLBACK_URI": Config.getLinkedinCallbackUri(),
      "LINKEDIN_CLIENT_ID": Config.getLinkedinAccountID(),
      "GITHUB_CLIENT_ID": Config.getGithubAccountId(),
      "GITHUB_CALLBACK_URI": Config.getGithubCallbackUri(),
      "QUEUE_CONNECTION": Config.getQConnection(),
      "SESSION_DRIVER": Config.getSessionDriver(),
      "SESSION_LIFETIME": String(Config.getSessionLifetime()),
      "MAIL_MAILER": Config.getMailer(),
      "MAIL_HOST": Config.getMailHost(),
      "MAIL_PORT": String(Config.getMailPort()),
      "MAIL_ENCRYPTION": Config.getMailEncryption(),
      "AWS_BUCKET":  Config.getAwsBucket(),
      "AWS_DEFAULT_REGION": Config.getAwsDefaultRegion(),
    }
  }

  public static readSecrets(scope: Construct): { [key: string]: Secret} {
    return {
      "APP_KEY": this.readFromSSM(scope, this.generateSsmKey("app/key")),
      "DB_HOST": this.readFromSSM(scope, this.generateSsmKey("rds/host")),
      "DB_DATABASE": this.readFromSSM(scope, this.generateSsmKey("rds/db")),
      "DB_USERNAME": this.readFromSSM(scope, this.generateSsmKey("rds/username")),
      "DB_PASSWORD": this.readFromSSM(scope, this.generateSsmKey("rds/password")),
      "MAIL_USERNAME": this.readFromSSM(scope, this.generateSsmKey("app/mailer/username")),
      "MAIL_PASSWORD": this.readFromSSM(scope, this.generateSsmKey("app/mailer/password")),
      "AWS_URL": this.readFromSSM(scope, this.generateSsmKey("aws/url")),
      "AWS_ACCESS_KEY_ID": this.readFromSSM(scope, this.generateSsmKey("aws/access-key-id")),
      "AWS_SECRET_ACCESS_KEY": this.readFromSSM(scope, this.generateSsmKey("aws/secret-key")),
      "LINKEDIN_CLIENT_SECRET": this.readFromSSM(scope, this.generateSsmKey("app/ouath/linkedin/client-secret")),
      "GITHUB_CLIENT_SECRET": this.readFromSSM(scope, this.generateSsmKey("app/ouath/github/client-secret")),
      "JWT_SECRET": this.readFromSSM(scope, this.generateSsmKey("app/jwt-secret")),
      "STRIPE_KEY": this.readFromSSM(scope, this.generateSsmKey("app/stripe/key")),
      "STRIPE_SECRET": this.readFromSSM(scope, this.generateSsmKey("app/stripe/secret")),
      "RECAPTCHA_SECRETKEY": this.readFromSSM(scope, this.generateSsmKey("app/recaptcha/secret")),
      "RECAPTCHA_SITEKEY": this.readFromSSM(scope, this.generateSsmKey("app/recaptcha/public")),
    }
  }

  private static generateSsmKey(path: string): string {
    const envs: {[key: string]: string} = {
      "production": "prod",
      "development": "dev",
    }

    const prefix = envs[Config.getAppEnv().toLocaleLowerCase()];

    return `/${prefix}/${path}`
  }

  private static readFromSSM(scope: Construct, name: string): Secret {
    return Secret.fromSsmParameter(ssm.StringParameter.fromSecureStringParameterAttributes(scope, name, {
      parameterName: name,
      version: 1
    }))
  }
}
