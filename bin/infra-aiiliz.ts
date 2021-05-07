#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ComputeStack } from '../lib/compute-stack';
import { DataStack } from '../lib/data-stack';
import { BlobStorageStack } from '../lib/block-stack';

const ailliz = new cdk.App();


new ComputeStack(ailliz, 'ComputeStack', {
    env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION,
      },
});

new DataStack(ailliz, 'DatabaseStack', {
    env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION,
      },
});

new BlobStorageStack(ailliz, 'StorageStack', {
  env: { 
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION,
    },
});