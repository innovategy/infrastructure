import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import { CfnSecurityGroup, CfnSecurityGroupIngress } from '@aws-cdk/aws-elasticache';
import { SecurityGroup } from '@aws-cdk/aws-ec2';

export default class Redis {
  private scope: cdk.Construct;

  private type: string;

  private applicationSecurityGroup: string;

  private REDIS_PORT = 6379;

  private vpc: ec2.Vpc;

  public build(): elasticache.CfnCacheCluster {
    return new elasticache.CfnCacheCluster(this.scope, 'RedisCacheCluster', {
      engine: 'redis',
      cacheNodeType: this.type,
      numCacheNodes: 1,
      clusterName: 'redis-cache',
      port: this.REDIS_PORT,
      vpcSecurityGroupIds: [this.getSecurityGroup().securityGroupId],
    });
  }

  private getSecurityGroup(): ec2.SecurityGroup {
    // TODO: remove after cdk supports security group by name
    const applicationSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this.scope, 'CacheIngress', this.applicationSecurityGroup);

    const securityGroup = new SecurityGroup(this.scope, 'ApplicationRedisCacheSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: false,
      description:
        'Disallow outbound traffic, and allow inbounds from application security group. to allow outbound traffic egress rules need to be defined explicitly.',
    });

    securityGroup.addIngressRule(applicationSecurityGroup, ec2.Port.tcp(this.REDIS_PORT), 'Accept traffic from application subnet');

    return securityGroup;
  }

  public nodeType(type: string): Redis {
    this.type = type;
    return this;
  }

  public acceptRequestFrom(securityGroupId: string): Redis {
    this.applicationSecurityGroup = securityGroupId;
    return this;
  }

  public inScope(scope: cdk.Construct): Redis {
    this.scope = scope;
    return this;
  }

  public inVpc(vpc: ec2.Vpc): Redis {
    this.vpc = vpc;
    return this;
  }
}
