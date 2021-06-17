import * as cdk from '@aws-cdk/core';
import PublicHostedZone from '../lib/route53/hosted-zone';
import * as route53 from '@aws-cdk/aws-route53';

interface cnameArg {
  name: string;
  domain: string;
}

export class DnsStack extends cdk.Stack {
  private publicHostedZone: route53.PublicHostedZone;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  public getNewPublicHostedZone(zoneName: string, nameSpace: string): DnsStack {
    this.publicHostedZone = this.publicHostedZone = new PublicHostedZone()
      .zoneName(zoneName)
      .withNameSpace(nameSpace)
      .inScope(this)
      .build();

    return this;
  }

  public getPublicZone(): route53.PublicHostedZone {
    return this.publicHostedZone;
  }

  public addMxRecords(values: route53.MxRecordValue[]): DnsStack {
    new route53.MxRecord(this, 'MxRecord', {
      zone: this.publicHostedZone,
      values: values,
    });
    return this;
  }

  public addCnameRecords(values: cnameArg[]): DnsStack {
    values.forEach(record => {
      if (record.name != null) {
        new route53.CnameRecord(this, record.name, {
          zone: this.publicHostedZone,
          recordName: record.name,
          domainName: record.domain,
        });
      }
    });
    return this;
  }
}
