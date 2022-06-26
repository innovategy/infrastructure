export interface availabilityZone {
  [key: string]: string;
}

export default class AvailabilityZones {
  public static euNorth1(): availabilityZone {
    return {
      a: 'eu-north-1a',
      b: 'eu-north-1b',
      c: 'eu-north-1c',
    };
  }
}
