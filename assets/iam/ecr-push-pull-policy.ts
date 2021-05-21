export default class EcrPushPullPolicy {
  private ecrArn:string;

  public get():object{
    return {
      "Version":"2012-10-17",
      "Statement":[
        {
          "Sid":"AllowPush",
          "Effect":"Allow",
          "Action":[
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:PutImage",
            "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart",
            "ecr:CompleteLayerUpload",
            "ecr:InitiateLayerUpload"
          ],
          "Resource": this.ecrArn
        }
      ]
    }
  }

  public ecrARN(arn:string):EcrPushPullPolicy{
    this.ecrArn = arn;
    return this;
  }
}
