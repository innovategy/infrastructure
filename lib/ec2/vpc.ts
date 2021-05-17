import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

interface ISubnetAttr {
  cidrMask: number;
  name: string;
}

interface ISubnetConfig extends ISubnetAttr {
  subnetType: ec2.SubnetType;
}

export class Vpc {
  private SINGLE_NAT_FOR_ALL_ZONES = 1;

  private scope: cdk.Construct;

  private VpcName: string;

  private maxAvailableZones: number;

  private publicSubnetName: string;

  private publicSubnetCidr: number;

  private privateSubnetName: string;

  private privateSubnetCidr: number;

  private isolatedSubnetName: string;

  private isolatedSubnetCidr: number;

  public build(): ec2.Vpc {
    return new ec2.Vpc(this.scope, this.VpcName, {
      maxAzs: this.maxAvailableZones,
      subnetConfiguration: [
        this.getSingleIsolatedSubnetConfig({ name: this.isolatedSubnetName, cidrMask: this.isolatedSubnetCidr }),
        this.getSinglePrivateSubnetConfig({ name: this.privateSubnetName, cidrMask: this.privateSubnetCidr }),
        this.getSinglePublicSubnetConfig({ name: this.publicSubnetName, cidrMask: this.publicSubnetCidr }),
      ],
      natGateways: this.SINGLE_NAT_FOR_ALL_ZONES,
    });
  }

  public setIsolatedSubnetName(name: string): Vpc {
    this.isolatedSubnetName = name;
    return this;
  }

  public setIsolatedSubnetCidrMask(cidr: number): Vpc {
    this.isolatedSubnetCidr = cidr;
    return this;
  }

  public setPrivateSubnetName(name: string): Vpc {
    this.privateSubnetName = name;
    return this;
  }

  public setPrivateSubnetCidrMask(cidr: number): Vpc {
    this.privateSubnetCidr = cidr;
    return this;
  }

  public setPublicSubnetName(name: string): Vpc {
    this.publicSubnetName = name;
    return this;
  }

  public setPublicSubnetCidrMask(cidr: number): Vpc {
    this.publicSubnetCidr = cidr;
    return this;
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

  private getSinglePublicSubnetConfig(attr: ISubnetAttr): ISubnetConfig {
    return {
      cidrMask: attr.cidrMask,
      name: attr.name,
      subnetType: ec2.SubnetType.PUBLIC,
    };
  }

  private getSinglePrivateSubnetConfig(attr: ISubnetAttr): ISubnetConfig {
    return {
      cidrMask: attr.cidrMask,
      name: attr.name,
      subnetType: ec2.SubnetType.PRIVATE,
    };
  }

  private getSingleIsolatedSubnetConfig(attr: ISubnetAttr): ISubnetConfig {
    return {
      cidrMask: attr.cidrMask,
      name: attr.name,
      subnetType: ec2.SubnetType.ISOLATED,
    };
  }
}
