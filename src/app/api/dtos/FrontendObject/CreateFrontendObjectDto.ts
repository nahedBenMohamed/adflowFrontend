export class CreateFrontendObjectDto<T extends unknown = unknown> {
  key: string;
  value: T;

  constructor({ key, value }: CreateFrontendObjectDto<T>) {
    this.key = key;
    this.value = value;
  }
}
