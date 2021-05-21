#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { EcsStack } from '../stacks/ecs-stack';
import { DataStack } from '../stacks/database-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { DnsStack } from '../stacks/dns-stack';
import MxRecords from '../assets/dns/mx-records';
import DnsConfig from '../config/routet53.config';
import EcsConfig from '../config/ecs.config';
import EcrConfig from '../config/ecr.config';
import { IamStack } from '../stacks/iam-stack';
import EcrPushPullPolicy from '../assets/iam/ecr-push-pull-policy';
import GetAuthorizedTokenPolicy from '../assets/iam/get-authorized-token-policy';
import EcsDeployPolicy from '../assets/iam/ecs-deploy-policy';

export default class Infra {
  private readonly app: cdk.App;

  private dnsStack: DnsStack;

  private vpcStack: VpcStack;

  private ecsStack: EcsStack;

  private iamStack: IamStack;

  private serviceName: string = 'ailliz';

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
    this.setupIamStack();
  }

  private setupDnsStack() {
    this.dnsStack = new DnsStack(this.app, 'DnsStack', { env: this.env });
    this.dnsStack.getNewPublicHostedZone(DnsConfig.getDomainName(), 'PublicHostedZone').addMxRecords(new MxRecords().get());
  }

  private setupVpcStack() {
    this.vpcStack = new VpcStack(this.app, 'VpcStack', { env: this.env });
  }

  private setupDatabaseStack() {
    // TODO: remove 'this.serviceName' after cdk supports security group by name
    new DataStack(this.app, 'DatabaseStack', this.vpcStack.getVpc(), this.serviceName, { env: this.env });
  }

  private setupEcsStack() {
    this.ecsStack = new EcsStack(this.app, 'EcsStack', this.vpcStack.getVpc(), { env: this.env });

    this.ecsStack.newLoadBalancedFargateService({
      hostedZone: this.dnsStack.getPublicZone(),
      serviceName: this.serviceName,
    });
  }

  private setupIamStack() {
    this.iamStack = new IamStack(this.app, 'IamStack', { env: this.env });
    const deployerGroup: iam.Group = this.iamStack.newGroup('deployers');
    this.iamStack.newUser('github-action-deployer').addToGroup(deployerGroup);

    new iam.Policy(this.iamStack, 'getAuthorizedTokenPolicy', {
      document: iam.PolicyDocument.fromJson(new GetAuthorizedTokenPolicy().get()),
    }).attachToGroup(deployerGroup);

    new iam.Policy(this.iamStack, 'ecrPushPullPolicy', {
      document: iam.PolicyDocument.fromJson(new EcrPushPullPolicy().ecrARN(EcrConfig.getARN()).get()),
    }).attachToGroup(deployerGroup);

    new iam.Policy(this.iamStack, 'ecsDeployerPolicy', {
      document: iam.PolicyDocument.fromJson(
        new EcsDeployPolicy()
          .allowServiceUpdateForCluster(EcsConfig.getArnForCluster('application'))
          .passRoleToTaskDef(EcsConfig.getTaskDefRoleForCluster('application'))
          .passRoleToTaskExecution(EcsConfig.getTaskExecutionRoleForCluster('application'))
          .get()
      ),
    }).attachToGroup(deployerGroup);
  }
}

new Infra();
