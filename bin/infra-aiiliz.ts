#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsStack } from '../stacks/ecs-stack';
import { DataStack } from '../stacks/database-stack';
import { VpcStack } from '../stacks/vpc-stack';
import Route53Config from '../config/routet53.config';
import { DnsStack } from '../stacks/dns-stack';
import { mxRecords } from '../assets/dns/mx-records';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const vpcStack: VpcStack = new VpcStack(app, 'VpcStack', { env: env });

const route53HostedZone: DnsStack = new DnsStack(app, 'DnsStack', { env: env });

route53HostedZone.addMxRecords('_gmail', mxRecords);

const ecs = new EcsStack(app, 'EcsStack', vpcStack.getVpc(), { env: env });

ecs.newLoadBalancedFargateService({
  domainName: Route53Config.getDomainName(),
  hostedZone: route53HostedZone.getPublicZone(),
  serviceName: 'ailliz',
});

new DataStack(app, 'DatabaseStack', vpcStack.getVpc(), { env: env });
