import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export default class EcsCluster {
  private scope: cdk.Construct;

  private vpc: ec2.Vpc;

  private name: string;

  private containerInsights: boolean = false;

  public build(): ecs.Cluster {
    return new ecs.Cluster(this.scope, this.name, {
      containerInsights: this.containerInsights,
      clusterName: this.name,
      vpc: this.vpc,
    });
  }

  public inVPC(vpc: ec2.Vpc): EcsCluster {
    this.vpc = vpc;
    return this;
  }

  public withName(name: string): EcsCluster {
    this.name = name;
    return this;
  }

  public activeContainerInsights(): EcsCluster {
    this.containerInsights = true;
    return this;
  }
}
