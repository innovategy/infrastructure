#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ComputeStack } from '../lib/compute-stack';
import { DataStack } from '../lib/data-stack';

const ailliz = new cdk.App();


new ComputeStack(ailliz, 'ComputeStack');
new DataStack(ailliz, 'DatabaseStack');