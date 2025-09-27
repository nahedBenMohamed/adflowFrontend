export class SiteFormFieldDataDto {
  id: number;
  value: unknown;

  constructor({ id, value }: SiteFormFieldDataDto) {
    this.id = id;
    this.value = value;
  }
}
