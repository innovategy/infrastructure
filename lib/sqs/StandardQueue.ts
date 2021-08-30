import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

export default class StandardQueue {
  private scope: cdk.Construct;

  private name: string;

  public build(){
    return new sqs.Queue(this.scope, this.name, {
      encryption: sqs.QueueEncryption.KMS_MANAGED
    });
  }

  public inScope(scope: cdk.Construct):StandardQueue{
    this.scope = scope;
    return this;
  }

  public queueName(name: string):StandardQueue{
    this.name = name;
    return this;
  }
}
