import * as cdk from '@aws-cdk/core';
import {BucketEncryption, BlockPublicAccess, StorageClass, Bucket} from "@aws-cdk/aws-s3";
import {s3Config} from '../config/blob-stack.config';

export class BlobStorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Bucket(this, 'BlobStorage', {
        versioned: false,
        bucketName: s3Config.Name,
        encryption: BucketEncryption.KMS_MANAGED,
        publicReadAccess: false,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}