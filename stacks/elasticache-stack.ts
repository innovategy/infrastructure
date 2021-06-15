import * as cdk from '@aws-cdk/core';
import * as elasticache from '@aws-cdk/aws-elasticache';
import * as ec2 from '@aws-cdk/aws-ec2';
import Redis from '../lib/elasticache/redis';

export class ElasticCacheRedisStack extends cdk.Stack {
  private readonly stack: elasticache.CfnCacheCluster;

  constructor(scope: cdk.Construct, id: string, securityGroupId: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);

    this.stack = new Redis().inVpc(vpc).acceptRequestFrom(securityGroupId).nodeType('cache.t2.micro').inScope(this).build();
  }

  public getCache(): elasticache.CfnCacheCluster {
    return this.stack;
  }
}
