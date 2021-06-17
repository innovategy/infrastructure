export default class GetAuthorizedTokenPolicy {
  public get(): object {
    return {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'GetAuthorizationToken',
          Effect: 'Allow',
          Action: ['ecr:GetAuthorizationToken'],
          Resource: '*',
        },
      ],
    };
  }
}
