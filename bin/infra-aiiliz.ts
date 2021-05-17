#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ComputeStack } from '../stacks/compute-stack';
import { DataStack } from '../stacks/database-stack';

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