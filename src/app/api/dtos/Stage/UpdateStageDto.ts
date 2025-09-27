import { Nullable, StageCode } from '@/shared';

export class UpdateStageDto {
  id: number;
  name?: string;
  color?: string;
  code?: Nullable<StageCode>;
  isSystem?: boolean;
  sortOrder?: number;

  constructor({ id, name, color, code, isSystem, sortOrder }: UpdateStageDto) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.code = code;
    this.isSystem = isSystem;
    this.sortOrder = sortOrder;
  }
}
