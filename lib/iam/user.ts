import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export default class User {
  private username :string;

  private scope: cdk.Construct;

  public build():iam.User {
    return new iam.User(this.scope, this.username)
  }

  public withUsername(name:string):User{
    this.username = name;
    return this;
  }

  public inScope(scope:cdk.Construct):User{
    this.scope = scope;
    return this;
  }
}
