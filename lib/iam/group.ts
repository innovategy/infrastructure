import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export default class Group {
  private groupName: string;

  private scope: cdk.Construct;

  public build(): iam.Group {
    return new iam.Group(this.scope, this.groupName);
  }

  public withGroupName(name: string): Group {
    this.groupName = name;
    return this;
  }

  public inScope(scope: cdk.Construct): Group {
    this.scope = scope;
    return this;
  }
}
