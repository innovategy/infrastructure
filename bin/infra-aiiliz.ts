#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsStack } from '../stacks/ecs-stack';
import { DataStack } from '../stacks/database-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { DnsStack } from '../stacks/dns-stack';
import { mxRecords } from '../assets/dns/mx-records';
import DnsConfig from '../config/routet53.config';



export default class Infra{
  private readonly app: cdk.App;

  private dnsStack :DnsStack;

  private vpcStack: VpcStack;

  private ecsStack: EcsStack;

  private serviceName:string="ailliz";

  private env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  };

  constructor() {
    this.app = new cdk.App();

    this.setupVpcStack();
    this.setupDnsStack();
    this.setupEcsStack();
    this.setupDatabaseStack();
  }

  private setupDnsStack(){
    this.dnsStack = new DnsStack(this.app, 'DnsStack', { env: this.env });
    this.dnsStack.getNewPublicHostedZone(DnsConfig.getDomainName(), "PublicHostedZone").addMxRecords(mxRecords);
  }

  private setupVpcStack(){
    this.vpcStack = new VpcStack(this.app, 'VpcStack', { env: this.env });
  }

  private setupDatabaseStack(){
    new DataStack(this.app, 'DatabaseStack', this.vpcStack.getVpc(), { env: this.env });
  }

  private setupEcsStack(){
    this.ecsStack = new EcsStack(this.app, 'EcsStack', this.vpcStack.getVpc(), { env: this.env });

    this.ecsStack.newLoadBalancedFargateService({
      hostedZone: this.dnsStack.getPublicZone(),
      serviceName: this.serviceName,
    });
  }
}

new Infra();
