import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import EcrConfig from '../config/ecr.config';
import EcsCluster from '../lib/ecs/ecs-cluster';
import Ecr from '../lib/ecs/ecr';

export class EcsStack extends cdk.Stack {
  private readonly cluster: ecs.Cluster;

  private readonly ecrRepository: ecr.Repository;

  constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);
    this.cluster = new EcsCluster().inScope(this).withName('application').inVPC(vpc).activeContainerInsights().build();
    this.ecrRepository = new Ecr()
      .inScope(this)
      .maxImagesToRetain(EcrConfig.getMaxImagesToRetain())
      .scanImageOnPush()
      .withName('applications')
      .build();
  }

  public getCluster():ecs.Cluster{
    return this.cluster;
  }

  public getRepo():ecr.Repository{
    return this.ecrRepository;
  }
}
