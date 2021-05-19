export default class Config {
  private static domainName: string;

  public static getDomainName(): string {
    if (process.env.ROUTE53_DOMAIN_NAME != undefined) {
      return String(process.env.ROUTE53_DOMAIN_NAME);
    }
    return "";
  }
}
