import * as cdk from '@aws-cdk/core';
import PublicHostedZone from '../lib/route53/hosted-zone';
import * as route53 from '@aws-cdk/aws-route53';

export class DnsStack extends cdk.Stack {
  private readonly publicHostedZone: route53.PublicHostedZone;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.publicHostedZone = new PublicHostedZone().zoneName('PublicHZ').inScope(this).build();
  }

  public getPublicZone(): route53.PublicHostedZone {
    return this.publicHostedZone;
  }

  public addMxRecords(recordName: string, values: route53.MxRecordValue[]): DnsStack {
    new route53.MxRecord(this, 'MXRecord', {
      zone: this.publicHostedZone,
      recordName: recordName,
      values: values,
    });
    return this;
  }
}
