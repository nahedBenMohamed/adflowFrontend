import type { ProductInfoDto } from '../../../../api';

export class ProductInfo {
  id: number;
  name: string;

  constructor({ id, name }: { id: number; name: string }) {
    this.id = id;
    this.name = name;
  }

  static fromDto(dto: ProductInfoDto): ProductInfo {
    return new ProductInfo({ id: dto.id, name: dto.name });
  }
}
