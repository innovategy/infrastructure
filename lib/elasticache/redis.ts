import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import { CfnReplicationGroup, CfnSubnetGroup } from '@aws-cdk/aws-elasticache';
import { SecurityGroup } from '@aws-cdk/aws-ec2';

export default class Redis {
  private scope: cdk.Construct;

  private type: string;

  private applicationSecurityGroup: string;

  private REDIS_PORT = 6379;

  private vpc: ec2.Vpc;

  private subnets: string[] = [];

  private securityGroups: string[] = [];

  public build(): CfnReplicationGroup {
    return new elasticache.CfnReplicationGroup(this.scope, 'RedisCacheCluster', {
      engine: 'redis',
      cacheNodeType: this.type,
      replicasPerNodeGroup: 1,
      numNodeGroups: 1,
      automaticFailoverEnabled: true,
      autoMinorVersionUpgrade: true,
      snapshotRetentionLimit: 1,
      port: this.REDIS_PORT,
      atRestEncryptionEnabled: true,
      transitEncryptionEnabled: false,
      multiAzEnabled: true,
      cacheSubnetGroupName: this.getSubnetGroup().ref,
      securityGroupIds: this.securityGroups,
      replicationGroupDescription: 'Redis cache cluster',
    });
  }

  public addSecurityGroup(name: string, acceptFrom: string): Redis {
    const applicationSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this.scope, 'RedisCluster' + name, acceptFrom);

    const securityGroup = new SecurityGroup(this.scope, name, {
      vpc: this.vpc,
      allowAllOutbound: false,
      description: 'allow inbounds from application security group',
    });

    securityGroup.addIngressRule(applicationSecurityGroup, ec2.Port.tcp(this.REDIS_PORT), 'Accept traffic from application subnet');

    this.securityGroups.push(securityGroup.securityGroupId);

    return this;
  }

  public addSubnet(zoneId: string, cidrBlock: string, id: string): Redis {
    const subnet = new ec2.PrivateSubnet(this.scope, id, {
      availabilityZone: zoneId,
      cidrBlock: cidrBlock,
      vpcId: this.vpc.vpcId,
    });
    this.subnets.push(subnet.subnetId);
    return this;
  }

  public nodeType(type: string): Redis {
    this.type = type;
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

  private getSubnetGroup(): CfnSubnetGroup {
    const subnetGroupName = 'cacheSubnetGroup'.toLowerCase();
    return new CfnSubnetGroup(this.scope, 'RedisClusterPrivateSubnetGroup', {
      subnetIds: this.subnets,
      description: 'Private cache subnet group',
      cacheSubnetGroupName: subnetGroupName,
    });
  }
}
