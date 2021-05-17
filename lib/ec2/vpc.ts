import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export interface ISubnetConfig {
  cidrMask: number;
  name: string;
  subnetType: ec2.SubnetType;
}

export class Vpc {
  private SINGLE_NAT_FOR_ALL_ZONES = 1;

  private scope: cdk.Construct;

  private VpcName: string;

  private maxAvailableZones: number;

  public build(): ec2.Vpc {
    return new ec2.Vpc(this.scope, this.VpcName, {
      maxAzs: this.maxAvailableZones,
      subnetConfiguration: [this.getSingleIsolatedSubnetConfig(), this.getSinglePrivateSubnetConfig(), this.getSinglePublicSubnetConfig()],
      natGateways: this.SINGLE_NAT_FOR_ALL_ZONES,
    });
  }

  public numberOfAvailabiltyZones(numberOfZones: number): Vpc {
    this.maxAvailableZones = numberOfZones;
    return this;
  }

  public withName(name: string): Vpc {
    this.VpcName = name;
    return this;
  }

  public inScope(scope: cdk.Construct) {
    this.scope = scope;
    return this;
  }

  private getSinglePublicSubnetConfig(ciderMask: number = 24, name: string = 'ingress'): ISubnetConfig {
    return {
      cidrMask: ciderMask,
      name: name,
      subnetType: ec2.SubnetType.PUBLIC,
    };
  }

  private getSinglePrivateSubnetConfig(ciderMask: number = 24, name: string = 'application'): ISubnetConfig {
    return {
      cidrMask: ciderMask,
      name: name,
      subnetType: ec2.SubnetType.PRIVATE,
    };
  }

  private getSingleIsolatedSubnetConfig(ciderMask: number = 28, name: string = 'rds'): ISubnetConfig {
    return {
      cidrMask: ciderMask,
      name: name,
      subnetType: ec2.SubnetType.ISOLATED,
    };
  }
}
