import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import User from "../lib/iam/user";
import Group from "../lib/iam/group";

export class IamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }

  public newUser(name:string):iam.User{
    return new User()
      .inScope(this)
      .withUsername(name)
      .build();
  }

  public newGroup(name:string):iam.Group{
    return new Group()
      .withGroupName(name)
      .inScope(this)
      .build()
  }

}
