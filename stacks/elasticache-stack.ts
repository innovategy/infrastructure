import * as cdk from "@aws-cdk/core";
import Redis from "../lib/elasticache/redis";



export class ElasticCacheRedis extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, securityGroups: string[], props?: cdk.StackProps) {
    super(scope, id, props);

    new Redis().inScope(this).addSecurityGroups(securityGroups).build();
  }
}
