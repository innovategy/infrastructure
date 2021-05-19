import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

export default class PublicHostedZone{
  private scope: cdk.Construct;

  private name: string;

  public build():route53.PublicHostedZone{
    return new route53.PublicHostedZone(this.scope, this.name, {
      zoneName: this.name,
    });
  }

  public inScope(scope:cdk.Construct):PublicHostedZone{
    this.scope=scope;
    return this;
  }

  public zoneName(name:string):PublicHostedZone{
    this.name = name;
    return this;
  }
}
