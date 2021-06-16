import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import {SecurityGroup} from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import {CfnReplicationGroup, CfnSubnetGroup} from '@aws-cdk/aws-elasticache';

export default class Redis {
  private scope: cdk.Construct;

  private type: string;

  private applicationSecurityGroup: string;

  private REDIS_PORT = 6379;

  private vpc: ec2.Vpc;

  private subnets: string[] = [];

  public build(): CfnReplicationGroup {
    return new elasticache.CfnReplicationGroup(this.scope, 'RedisCacheCluster', {
      engine: 'redis',
      cacheNodeType: this.type,
      replicasPerNodeGroup: 2,
      numNodeGroups: 1,
      automaticFailoverEnabled: true,
      autoMinorVersionUpgrade: true,
      snapshotRetentionLimit: 1,
      port: this.REDIS_PORT,
      atRestEncryptionEnabled: true,
      transitEncryptionEnabled: true,
      multiAzEnabled: true,
      cacheSubnetGroupName: this.getSubnetGroup().ref,
      replicationGroupDescription: "Redis cache cluster"
    });
  }

  public addSubnet(zoneId: string, cidrBlock: string, id: string): Redis{
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

  private getSubnetGroup(): CfnSubnetGroup{
    const subnetGroupName = "cacheSubnetGroup".toLowerCase();
    return new CfnSubnetGroup(
      this.scope,
      "RedisClusterPrivateSubnetGroup",
      {
        subnetIds: this.subnets,
        description: "Private cache subnet group",
        cacheSubnetGroupName: subnetGroupName
      }
    );
  }

  private getSecurityGroup(): ec2.SecurityGroup {
    // TODO: remove after cdk supports security group by name
    const applicationSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this.scope, 'CacheIngress', this.applicationSecurityGroup);

    const securityGroup = new SecurityGroup(this.scope, 'ApplicationRedisCacheSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: false,
      description:
        'allow inbounds from application security group.',
    });

    securityGroup.addIngressRule(applicationSecurityGroup, ec2.Port.tcp(this.REDIS_PORT), 'Accept traffic from application subnet');

    return securityGroup;
  }


}
