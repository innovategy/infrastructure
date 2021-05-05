import * as dotenv from 'dotenv';
dotenv.config();

interface config {
  VpcName: string;
  VpcMaxAzs: number;
  Name: string;
  CPUS: number;
  MemoryLimitMib: number;
  FargateId: string;
  DesiredCount: number;
}

export const computeConfig: config = {
  VpcName: process.env.VPC_NAME ?? 'MyLovelyVPC',
  VpcMaxAzs: process.env.VPC_Max_Azs == undefined ? 1 : Number(process.env.VPC_Max_Azs),
  Name: process.env.ECS_CLUSTER_NAME ?? 'MyLovelyCluster',
  CPUS: process.env.ECS_FARGATE_CPUS == undefined ? 256 : Number(process.env.ECS_FARGATE_CPUS),
  MemoryLimitMib: process.env.ECS_FARGATE_MEMORY_LIMIT_MIB == undefined ? 512 : Number(process.env.ECS_FARGATE_MEMORY_LIMIT_MIB),
  FargateId: process.env.ECS_FARGATE_ID ?? 'MyLovelyFaragetService',
  DesiredCount: process.env.ECS_FARGATE_DESIRED_COUNT == undefined ? 1 : Number(process.env.ECS_FARGATE_DESIRED_COUNT),
};
