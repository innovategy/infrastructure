import * as sqs from '@aws-cdk/aws-sqs';
import {Construct} from "@aws-cdk/core";

export default class StandardQueue {
  private scope: Construct;

  private name: string;

  constructor() {
    new sqs.Queue(this.scope, this.name, {
      encryption: sqs.QueueEncryption.KMS_MANAGED
    });
  }

  public inScope(scope: Construct):StandardQueue{
    this.scope = scope;
    return this;
  }

  public queueName(name: string):StandardQueue{
    this.name = name;
    return this;
  }
}
