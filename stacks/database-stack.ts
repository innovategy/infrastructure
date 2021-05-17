import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import { computeConfig } from '../../config/compute-cluster.config';
import { databaseConfig } from '../../config/database-cluster.config';

export class DataStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      isDefault: false,
      vpcName: 'ComputeStack/' + computeConfig.VpcName,
    });

    const cluster = new rds.ServerlessCluster(this, databaseConfig.Identifier, {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      defaultDatabaseName: databaseConfig.Name,
      deletionProtection: databaseConfig.Deleteable,
      vpc,
    });
  }
}
