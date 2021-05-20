import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import Serverless from '../lib/rds/rds-serverless';
import Config from '../config/rds.config';
import VPC from '../config/vpc.config';
import Ecs from '../config/ecs.config';

export class DataStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, vpc:ec2.Vpc, acceptTrafficFromService:string,props?: cdk.StackProps) {
    super(scope, id, props);

    new Serverless()
      .inScope(this)
      .inVpc(vpc)
      .autoPauseClusterAfter(Config.getAutoPauseDuration())
      .backupDurationInDays(Config.getBackupRetentionDurationPolicy())
      .inIsolateSubnetGroup(VPC.getIsolateSubnetName())
      .withDatabaseName(Config.getDatabaseName())
      // TODO: remove after cdk supports security group by name
      .acceptTrafficFrom(Ecs.getSecurityGroupIdForService(acceptTrafficFromService))
      .build();
  }
}
