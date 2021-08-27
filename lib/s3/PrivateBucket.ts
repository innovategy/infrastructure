import * as cdk from '@aws-cdk/core';
import {Duration, RemovalPolicy} from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketAccessControl, BlockPublicAccess, StorageClass } from '@aws-cdk/aws-s3';
import { BucketEncryption } from '@aws-cdk/aws-s3/lib/bucket';

export interface transition {
  storageClass: s3.StorageClass;
  transitionAfter: cdk.Duration;
}

export default class PrivateBucket {
  private scope: cdk.Construct;

  private transitions: s3.Transition[] = [];

  private name: string;

  private blockPublicAccess: boolean;

  private versioning: boolean = false;

  build(): s3.Bucket {
    return new s3.Bucket(this.scope, this.name, {
      bucketName: this.name,
      encryption: BucketEncryption.KMS_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: this.versioning,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [
        {
          transitions: this.transitions,
        },
      ],
    });
  }

  versioningEnabled(): PrivateBucket {
    this.versioning = true;
    return this;
  }

  withName(name: string): PrivateBucket {
    this.name = name;
    return this;
  }

  addTransitions(storageClass: string, transitAfter: number): PrivateBucket {
    const accessFrequency: { [key: string]: StorageClass } = {
      "USUALLY_ACCESS": StorageClass.INFREQUENT_ACCESS,
      "RARELY_ACCESS": StorageClass.GLACIER,
      "ARCHIVED": StorageClass.DEEP_ARCHIVE
    }

    this.transitions.push({
      storageClass: accessFrequency[storageClass],
      transitionAfter: Duration.days(transitAfter)
    });

    return this;
  }

  inScope(scope: cdk.Construct): PrivateBucket {
    this.scope = scope;
    return this;
  }
}
