import * as cdk from '@aws-cdk/core';
import * as elasticache from '@aws-cdk/aws-elasticache';
import * as ec2 from '@aws-cdk/aws-ec2';
import Redis from '../lib/elasticache/redis';
import AvailabilityZones from "../assets/aws/availability-zones";

export class ElasticCacheRedisStack extends cdk.Stack {
  private readonly stack: elasticache.CfnCacheCluster;

  constructor(scope: cdk.Construct, id: string, securityGroupId: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);

    this.stack = new Redis()
      .inVpc(vpc)
      .inScope(this)
      .addSubnet(AvailabilityZones.euCentral1().a, "10.0.5.0/24", "RedisCachePrivateSubnetZA")
      .addSubnet(AvailabilityZones.euCentral1().b, "10.0.6.0/24", "RedisCachePrivateSubnetZB")
      .acceptRequestFrom(securityGroupId)
      .nodeType('cache.t2.micro')
      .build();
  }

  public getCache(): elasticache.CfnCacheCluster {
    return this.stack;
  }
}
