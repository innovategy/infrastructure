import * as cdk from '@aws-cdk/core';
import { RemovalPolicy } from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketAccessControl } from '@aws-cdk/aws-s3';
import { BucketEncryption } from '@aws-cdk/aws-s3/lib/bucket';

export interface transition {
  storageClass: s3.StorageClass;
  transitionAfter: cdk.Duration;
}

export default class Bucket {
  private scope: cdk.Construct;

  private transitions: transition[];

  private name: string;

  private blockPublicAccess: boolean;

  private versioning: boolean = false;

  build(): s3.Bucket {
    return new s3.Bucket(this.scope, this.name, {
      bucketName: this.name,
      encryption: BucketEncryption.KMS_MANAGED,
      publicReadAccess: !this.blockPublicAccess,
      enforceSSL: true,
      accessControl: this.blockPublicAccess ? BucketAccessControl.PRIVATE : BucketAccessControl.PUBLIC_READ,
      removalPolicy: RemovalPolicy.RETAIN,
      versioned: this.versioning,
      blockPublicAccess: {
        blockPublicAcls: this.blockPublicAccess,
        blockPublicPolicy: this.blockPublicAccess,
        restrictPublicBuckets: this.blockPublicAccess,
        ignorePublicAcls: this.blockPublicAccess,
      },
      lifecycleRules: [
        {
          transitions: this.transitions,
        },
      ],
    });
  }

  versioningEnabled(): Bucket {
    this.versioning = true;
    return this;
  }

  withName(name: string): Bucket {
    this.name = name;
    return this;
  }

  allowPublicToRead(): Bucket {
    this.blockPublicAccess = false;
    return this;
  }

  disallowPublicToAccess(): Bucket {
    this.blockPublicAccess = true;
    return this;
  }

  addTransitions(transition: transition): Bucket {
    this.transitions.push(transition);
    return this;
  }

  inScope(scope: cdk.Construct): Bucket {
    this.scope = scope;
    return this;
  }
}
