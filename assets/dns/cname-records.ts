export default class CnameRecords{
  public get(){
    return [
      {
        name: "api.ailliz.com",
        domain: "dualstack.ecsst-ailli-q618qb3176ju-1324272500.eu-central-1.elb.amazonaws.com"
      },
      {
        name: "status.ailliz.com",
        domain: "cmsfnmqyy42q.stspg-customer.com"
      }];
  }
  // TODO: remove after updating hosted-zones
  public getNew(){
    return [{
      name: "api.noutaja.io",
      domain: "dualstack.ecsst-ailli-q618qb3176ju-1324272500.eu-central-1.elb.amazonaws.com"
    },
      {
        name: "status.noutaja.io",
        domain: "cmsfnmqyy42q.stspg-customer.com"
      }];
  }
}
