import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import { Duration, RemovalPolicy } from '@aws-cdk/core';

export default class Ecr {
  private scope: cdk.Construct;

  private name: string;

  private scanImage: boolean = false;

  private maxImageCount: number;

  public build(): ecr.Repository {
    const repo = new ecr.Repository(this.scope, this.name, {
      repositoryName: this.name,
      imageScanOnPush: this.scanImage,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    repo.addLifecycleRule({
      description: `retain ${this.maxImageCount} images in the repo and delete stale images.`,
      maxImageCount: this.maxImageCount,
    });

    return repo;
  }

  public scanImageOnPush(): Ecr {
    this.scanImage = true;
    return this;
  }

  public withName(name: string): Ecr {
    this.name = name;
    return this;
  }

  public maxImagesToRetain(maxImageCount: number): Ecr {
    this.maxImageCount = maxImageCount;
    return this;
  }

  public inScope(scope: cdk.Construct): Ecr {
    this.scope = scope;
    return this;
  }
}
