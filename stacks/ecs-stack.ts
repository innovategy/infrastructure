import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import EcrConfig from '../config/ecr.config';
import EcsCluster from '../lib/ecs/ecs-cluster';
import Ecr from '../lib/ecs/ecr';

export class EcsStack extends cdk.Stack {
  private readonly cluster: ecs.Cluster;

  private readonly appRepo: ecr.Repository;

  private readonly webServerRepo: ecr.Repository;

  private readonly qConsumerRepo: ecr.Repository;

  private readonly repositories: { [name: string]: ecr.Repository };

  constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);
    this.cluster = new EcsCluster().inScope(this).withName('application').inVPC(vpc).activeContainerInsights().build();

    this.appRepo = new Ecr()
      .inScope(this)
      .maxImagesToRetain(EcrConfig.getMaxImagesToRetain())
      .scanImageOnPush()
      .withName('applications')
      .build();

    this.webServerRepo = new Ecr()
      .inScope(this)
      .maxImagesToRetain(EcrConfig.getMaxImagesToRetain())
      .scanImageOnPush()
      .withName('nginx')
      .build();

    this.qConsumerRepo = new Ecr()
      .inScope(this)
      .maxImagesToRetain(EcrConfig.getMaxImagesToRetain())
      .scanImageOnPush()
      .withName('qConsumer')
      .build();

    this.repositories = {
      application: this.appRepo,
      nginx: this.webServerRepo,
      queueConsumer: this.qConsumerRepo
    }

  }

  public getCluster(): ecs.Cluster {
    return this.cluster;
  }

  public getRepo(name: string): ecr.Repository {
    if (this.repositories[name] === undefined){
      throw new Error("Repo not found");
    }else{
      return this.repositories[name];
    }
  }
}
