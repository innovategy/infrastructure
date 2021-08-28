import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import StandardQueue from "../lib/sqs/StandardQueue";
import Config from "../config/sqs-config";

export class SqsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new StandardQueue().queueName(Config.normalJobQueueName()).inScope(scope);
  }
}
