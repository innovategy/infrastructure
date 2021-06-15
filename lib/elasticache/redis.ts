import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';

export default class Redis {
  private scope: cdk.Construct;

  private subnet: ec2.Subnet;

  private securityGroups: string[];

  public build(): elasticache.CfnCacheCluster {
    return new elasticache.CfnCacheCluster(this.scope, 'RedisCacheCluster', {
      engine: 'redis',
      cacheNodeType: 'cache.t2.small',
      numCacheNodes: 1,
      clusterName: 'redis-cache',
      port: 6379,
      vpcSecurityGroupIds: this.securityGroups,
      cacheSubnetGroupName: this.subnet.subnetId,
    });
  }

  public inScope(scope: cdk.Construct): Redis {
    this.scope = scope;
    return this;
  }

  public addSecurityGroups(securityGroups: string[]): Redis {
    this.securityGroups = securityGroups;
    return this;
  }
}
