export class ProductInfoDto {
  id: number;
  name: string;

  constructor({ id, name }: ProductInfoDto) {
    this.id = id;
    this.name = name;
  }
}
