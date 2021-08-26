import * as cdk from '@aws-cdk/core';
import PrivateBucket from '../lib/s3/PrivateBucket';

export class s3 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new PrivateBucket()
      .inScope(this)
      .withName('audit-blobs')
      .addTransitions("USUALLY_ACCESS", 30)
      .addTransitions("RARELY_ACCESS", 90)
      .build();
  }
}
