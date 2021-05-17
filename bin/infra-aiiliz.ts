#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ComputeStack } from '../stacks/compute-stack';
import { DataStack } from '../stacks/database-stack';
import { VpcStack } from '../stacks/vpc-stack';

const ailliz = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

new VpcStack(ailliz, 'VpcStack', { env: env });

new ComputeStack(ailliz, 'ComputeStack', { env: env });

new DataStack(ailliz, 'DatabaseStack', { env: env });
