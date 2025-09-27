import type { UserRights } from '@/shared';
import type { WarehouseDto } from '../../../../api';

export class Warehouse {
  id: number;
  name: string;
  isDeleted: boolean;
  userRights: UserRights;

  constructor({ id, name, isDeleted, userRights }: Warehouse) {
    this.id = id;
    this.name = name;
    this.isDeleted = isDeleted;
    this.userRights = userRights;
  }

  static fromDto(dto: WarehouseDto): Warehouse {
    return new Warehouse({
      id: dto.id,
      name: dto.name,
      isDeleted: dto.isDeleted,
      userRights: dto.userRights,
    });
  }

  static fromDtos(dtos: WarehouseDto[]): Warehouse[] {
    return dtos.map(this.fromDto);
  }
}
