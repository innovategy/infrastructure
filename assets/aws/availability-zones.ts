export interface availabilityZone {
  [key: string]: string;
}

export default class AvailabilityZones {
  public static euCentral1(): availabilityZone {
    return {
      a: 'eu-central-1a',
      b: 'eu-central-1b',
    };
  }
}
