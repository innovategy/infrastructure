import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Duration, RemovalPolicy } from '@aws-cdk/core';

export default class Serverless {
  private RDS_ISOLATE_SUBNET_ID:string = "serverlessRdsCluster"

  private isolateSubnetGroupName:string;

  private scope: cdk.Construct;

  private clusterName: string;

  private vpc: ec2.Vpc;
  
  private backupRetention:number;

  private autoPauseAfter:number;

  private databaseName:string;


  public build(): rds.ServerlessCluster{
    return new rds.ServerlessCluster(this.scope, this.clusterName, {
        engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(this.scope, 'ParameterGroup', 'default.aurora-postgresql10'),
        backupRetention: Duration.days(this.backupRetention),
        scaling: {
            autoPause: Duration.minutes(this.autoPauseAfter), 
            minCapacity: rds.AuroraCapacityUnit.ACU_8, 
            maxCapacity: rds.AuroraCapacityUnit.ACU_32,
          },
        vpc: this.vpc,
        vpcSubnets: rds.SubnetGroup.fromSubnetGroupName(this.scope, this.RDS_ISOLATE_SUBNET_ID, this.isolateSubnetGroupName),
        defaultDatabaseName: this.databaseName,
        removalPolicy: RemovalPolicy.RETAIN,
      });
  }

  public backupDurationInDays(days:number=1):Serverless{
    this.backupRetention = days;
    return this;
  }

  public autoPauseClusterAfter(mins:number):Serverless{
    this.autoPauseAfter = mins;
    return this;
  }

  public inIsolateSubnetGroup(name:string):Serverless{
    this.isolateSubnetGroupName = name;
    return this;
  }

  public withDatabaseName(name:string):Serverless{
    this.isolateSubnetGroupName = name;
    return this;
  }
}