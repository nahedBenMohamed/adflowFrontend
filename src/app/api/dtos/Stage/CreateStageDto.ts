import type { Nullable, StageCode } from '@/shared';

export class CreateStageDto {
  name: string;
  color: string;
  code: Nullable<StageCode>;
  sortOrder?: number;
  isSystem?: boolean;

  constructor({ name, color, code, sortOrder, isSystem }: CreateStageDto) {
    this.name = name;
    this.color = color;
    this.code = code;
    this.sortOrder = sortOrder;
    this.isSystem = isSystem;
  }
}
