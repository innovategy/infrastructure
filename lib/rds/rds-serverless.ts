import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import {Duration, RemovalPolicy} from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import {SecurityGroup, SubnetType} from '@aws-cdk/aws-ec2';

export default class Serverless {
  private isolateSubnetGroupName: string;

  private scope: cdk.Construct;

  private vpc: ec2.Vpc;

  private backupRetention: number;

  private autoPauseAfter: number;

  private databaseName: string;

  private applicationSecurityGroup: string;

  public build(): rds.ServerlessCluster {
    return new rds.ServerlessCluster(this.scope, this.databaseName + "Cluster", {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this.scope, 'ParameterGroup', 'default.aurora-postgresql10'),
      backupRetention: Duration.days(this.backupRetention),
      scaling: {
        autoPause: Duration.minutes(this.autoPauseAfter),
        minCapacity: rds.AuroraCapacityUnit.ACU_4,
        maxCapacity: rds.AuroraCapacityUnit.ACU_32,
      },
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: SubnetType.ISOLATED,
      },
      defaultDatabaseName: this.databaseName,
      removalPolicy: RemovalPolicy.RETAIN,
      securityGroups: [this.getSecurityGroup()],
    });
  }

  public inScope(scope: cdk.Construct): Serverless {
    this.scope = scope;
    return this;
  }

  public backupDurationInDays(days: number): Serverless {
    this.backupRetention = days;
    return this;
  }

  public autoPauseClusterAfter(mins: number): Serverless {
    this.autoPauseAfter = mins;
    return this;
  }

  public inIsolateSubnetGroup(name: string): Serverless {
    this.isolateSubnetGroupName = name;
    return this;
  }

  public withDatabaseName(name: string): Serverless {
    this.databaseName = name;
    return this;
  }

  public acceptTrafficFrom(securityGroupId:string):Serverless{
    this.applicationSecurityGroup = securityGroupId;
    return this;
  }

  public inVpc(vpc:ec2.Vpc): Serverless{
    this.vpc=vpc;
    return this;
  }

  private getSecurityGroup():ec2.SecurityGroup{
    const POSTGRES_PORT:number = 5432;
    // TODO: remove after cdk supports security group by name
    const applicationSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this.scope, "SG", this.applicationSecurityGroup)

    const securityGroup = new SecurityGroup(this.scope, "RdsSG", {
      vpc: this.vpc,
      allowAllOutbound: false,
      description: "Disallow outbound traffic, and allow inbounds from application security group. to allow outbound traffic egress rules need to be defined explicitly."
    });

    securityGroup.addIngressRule(applicationSecurityGroup, ec2.Port.tcp(POSTGRES_PORT), "Accept traffic from application subnet");

    return  securityGroup;
  }
}
