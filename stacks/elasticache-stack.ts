import * as cdk from "@aws-cdk/core";
import * as elasticache from '@aws-cdk/aws-elasticache';
import Redis from "../lib/elasticache/redis";

export class ElasticCacheRedisStack extends cdk.Stack {
  private readonly stack : elasticache.CfnCacheCluster;

  constructor(scope: cdk.Construct, id: string, securityGroups: string[], props?: cdk.StackProps) {
    super(scope, id, props);

   this.stack = new Redis().inScope(this).addSecurityGroups(securityGroups).build();
  }

  public getCache():elasticache.CfnCacheCluster{
    return this.stack;
  }
}
