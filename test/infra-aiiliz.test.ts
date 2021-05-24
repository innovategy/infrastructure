import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as InfraAiiliz from '../stacks/ecs-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
});
