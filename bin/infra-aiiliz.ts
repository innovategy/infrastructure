#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import {AwsLogDriver, AwsLogDriverMode} from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import {EcsStack} from '../stacks/ecs-stack';
import {DataStack} from '../stacks/database-stack';
import {VpcStack} from '../stacks/vpc-stack';
import {DnsStack} from '../stacks/dns-stack';
import MxRecords from '../assets/dns/mx-records';
import DnsConfig from '../config/routet53.config';
import EcsConfig from '../config/ecs.config';
import EcrConfig from '../config/ecr.config';
import {IamStack} from '../stacks/iam-stack';
import EcrPushPullPolicy from '../assets/iam/ecr-push-pull-policy';
import GetAuthorizedTokenPolicy from '../assets/iam/get-authorized-token-policy';
import EcsDeployPolicy from '../assets/iam/ecs-deploy-policy';
import {WebServiceStack} from '../stacks/web-service-stack';
import CnameRecords from '../assets/dns/cname-records';
import {ElasticCacheRedisStack} from '../stacks/elasticache-stack';
import {s3} from '../stacks/s3-stack';
import App from "../assets/application/app-env";

export default class Infra {
  private readonly app: cdk.App;

  private dnsStack: DnsStack;

  private vpcStack: VpcStack;

  private ecsStack: EcsStack;

  private iamStack: IamStack;

  private coreCache: ElasticCacheRedisStack;

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
    this.setupAillizService();
    this.setupDatabaseStack();
    this.setupIamStack();
    this.setupRedisCache();
    this.setupPrivateS3Bucket();
  }

  private setupPrivateS3Bucket() {
    new s3(this.app, 'PrivateBlobStorage', { env: this.env });
  }

  private setupDnsStack() {
    this.dnsStack = new DnsStack(this.app, 'DnsStack', { env: this.env });
    this.dnsStack
      .getNewPublicHostedZone(DnsConfig.getDomainName(), 'PublicHostedZone')
      .addMxRecords(new MxRecords().get())
      .addCnameRecords(new CnameRecords().get());
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
  }

  private setupAillizService() {
    const nginxContainer = {
      image: ecs.ContainerImage.fromEcrRepository(this.ecsStack.getRepositoryByName('nginx')),
      containerName: "nginx"
    };
    const applicationContainer = {
      image: ecs.ContainerImage.fromEcrRepository(this.ecsStack.getRepositoryByName('application')),
      environment: App.readEnvs(),
      secrets: App.readSecrets(this.ecsStack),
      containerName: "application",
      portMapping: {
        "ContainerPort" : 9000,
        "HostPort" : 9000,
      },
      logging: new AwsLogDriver({
        streamPrefix: "ecs/laravel-application",
        mode: AwsLogDriverMode.NON_BLOCKING
      })
    };
    const queueConsumerContainer = {
      image: ecs.ContainerImage.fromEcrRepository(this.ecsStack.getRepositoryByName('queueConsumer')),
      containerName: "queueConsumer",
      logging: new AwsLogDriver({
        streamPrefix: "ecs/queue-consumer",
        mode: AwsLogDriverMode.NON_BLOCKING
      })
    };

    new WebServiceStack(
      this.app,
      'AillizService',
      {
        hostedZone: this.dnsStack.getPublicZone(),
        cluster: this.ecsStack.getCluster(),
        mainContainer: nginxContainer,
        extraContainers: [applicationContainer, queueConsumerContainer]
      },
      { env: this.env }
    );
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

  private setupRedisCache() {
    this.coreCache = new ElasticCacheRedisStack(
      this.app,
      'CacheClusterStack',
      EcsConfig.getSecurityGroupIdForService(this.serviceName),
      this.vpcStack.getVpc(),
      {
        env: this.env,
      }
    );
  }
}

new Infra();
