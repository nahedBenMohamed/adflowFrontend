export class UriCodingUtil {
  static encode(value: string): string {
    return encodeURIComponent(value);
  }

  static decode(value: string): string {
    return decodeURIComponent(value);
  }
}
