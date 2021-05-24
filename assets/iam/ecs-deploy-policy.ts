export default class EcsDeployPolicy{
  private taskExecutionRoleArn:string;

  private taskDefRoleArn:string;

  private clusterArn:string;

  public get():object{
    return {
      "Version":"2012-10-17",
      "Statement":[
        {
          "Sid":"RegisterTaskDefinition",
          "Effect":"Allow",
          "Action":[
            "ecs:RegisterTaskDefinition",
            "ecs:DescribeTaskDefinition"
          ],
          "Resource":"*"
        },
        {
          "Sid":"PassRolesInTaskDefinition",
          "Effect":"Allow",
          "Action":[
            "iam:PassRole"
          ],
          "Resource":[
            this.taskExecutionRoleArn,
            this.taskDefRoleArn
          ]
        },
        {
          "Sid":"DeployService",
          "Effect":"Allow",
          "Action":[
            "ecs:UpdateService",
            "ecs:DescribeServices",
          ],
          "Resource":[
            this.clusterArn
          ]
        }
      ]
    }
  }

  public passRoleToTaskExecution(arn:string):EcsDeployPolicy{
    this.taskExecutionRoleArn = arn;
    return this;
  }

  public passRoleToTaskDef(arn:string):EcsDeployPolicy{
    this.taskDefRoleArn = arn;
    return this;
  }

  public allowServiceUpdateForCluster(arn:string):EcsDeployPolicy{
    this.clusterArn = arn;
    return this;
  }
}
