import * as cdk from '@aws-cdk/core';
import Bucket from '../lib/s3/bucket';

export class s3 extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new Bucket().inScope(scope).withName('computerVisionRunnersStorage').disallowPublicToAccess().build();
  }
}
