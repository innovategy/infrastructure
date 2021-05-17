import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Duration } from '@aws-cdk/core';

export default class Serverless {

  private scope: cdk.Construct;

  private clusterName: string;

  private vpc: ec2.Vpc;
  
  public build(): rds.ServerlessCluster{
    return new rds.ServerlessCluster(this.scope, this.clusterName, {
        engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(this.scope, 'ParameterGroup', 'default.aurora-postgresql10'),
        subnetGroup: this.vpc.isolatedSubnets,
        scaling: {
            autoPause: Duration.minutes(10), 
            minCapacity: rds.AuroraCapacityUnit.ACU_8, 
            maxCapacity: rds.AuroraCapacityUnit.ACU_32,
          },
        vpc: this.vpc,
      });
  }
}