#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsStack } from '../stacks/ecs-stack';
import { DataStack } from '../stacks/database-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { DnsStack } from '../stacks/dns-stack';
import { mxRecords } from '../assets/dns/mx-records';
import DnsConfig from '../config/routet53.config';
import EcsConfig from '../config/ecs.config';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const mainService = "ailliz";

const vpcStack: VpcStack = new VpcStack(app, 'VpcStack', { env: env });
new DnsStack(app, 'DnsStack', DnsConfig.getDomainName(), { env: env }).addMxRecords(mxRecords);

const aillizDashboardHostedZone: DnsStack =  new DnsStack(app, 'DnsStack', EcsConfig.getPublicDomainNameForService(mainService), { env: env });

const ecs = new EcsStack(app, 'EcsStack', vpcStack.getVpc(), { env: env });

ecs.newLoadBalancedFargateService({
  hostedZone: aillizDashboardHostedZone.getPublicZone(),
  serviceName: mainService,
});

new DataStack(app, 'DatabaseStack', vpcStack.getVpc(), { env: env });
