#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ComputeStack } from '../lib/compute-stack;
import { CfnParameter } from '@aws-cdk/core';

const ailliz = new cdk.App();

new ComputeStack(ailliz, 'ComputeStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

});
