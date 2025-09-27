import type { StockDto } from '../../../../api';

export class Stock {
  warehouseId: number;
  stockQuantity: number;
  reserved: number;
  available: number;

  constructor({ warehouseId, stockQuantity, reserved, available }: Stock) {
    this.warehouseId = warehouseId;
    this.stockQuantity = stockQuantity;
    this.reserved = reserved;
    this.available = available;
  }

  static fromDto(dto: StockDto): Stock {
    return new Stock({
      reserved: dto.reserved,
      available: dto.available,
      warehouseId: dto.warehouseId,
      stockQuantity: dto.stockQuantity,
    });
  }

  static fromDtos(dtos: StockDto[]): Stock[] {
    return dtos.map(this.fromDto);
  }
}
