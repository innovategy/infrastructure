import * as cdk from '@aws-cdk/core';
import { Vpc } from '../lib/ec2/vpc';
import Config from '../config/vpc.config';

export class VpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Vpc().numberOfAvailabiltyZones(Config.getMaxAz()).withName(Config.getName()).inScope(scope).build();
  }
}
