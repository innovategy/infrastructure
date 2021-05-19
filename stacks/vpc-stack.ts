import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Vpc } from '../lib/ec2/vpc';
import Config from '../config/vpc.config';

export class VpcStack extends cdk.Stack {
  private instance: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.instance = new Vpc()
      .setIsolatedSubnetCidrMask(Config.getIsolatedCidrMask())
      .setIsolatedSubnetName(Config.getIsolateSubnetName())
      .setPrivateSubnetCidrMask(Config.getPrivateCidrMask())
      .setPrivateSubnetName(Config.getPrivateSubnetName())
      .setPublicSubnetCidrMask(Config.getPublicCidrMask())
      .setPublicSubnetName(Config.getPublicSubnetName())
      .numberOfAvailabiltyZones(Config.getMaxAz())
      .withName(Config.getName())
      .inScope(this)
      .build();
  }

  public getVpc(): ec2.Vpc {
    return this.instance;
  }
}
