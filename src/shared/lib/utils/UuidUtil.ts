import { v4 as uuid } from 'uuid';

export class UuidUtil {
  static generate(): string {
    return uuid();
  }

  // generate a random 6 digit number
  static generate6number(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  static generate8number(): number {
    return Math.floor(100000000 + Math.random() * 900000000);
  }

  // generate a random 6 digit number string
  static generate6(): string {
    return this.generate6number().toString();
  }
}
