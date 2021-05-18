#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsStack } from '../stacks/ecs-stack';
import { DataStack } from '../stacks/database-stack';
import { VpcStack } from '../stacks/vpc-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const vpcStack: VpcStack = new VpcStack(app, 'VpcStack', { env: env });

new EcsStack(app, 'ComputeStack', vpcStack.getVpc(), { env: env });

new DataStack(app, 'DatabaseStack', { env: env });
