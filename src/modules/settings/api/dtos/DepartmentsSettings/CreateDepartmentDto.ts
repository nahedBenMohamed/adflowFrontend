import type { Nullable } from '@/shared';

export class CreateDepartmentDto {
  name: string;
  parentId: Nullable<number>;

  constructor({ name, parentId }: CreateDepartmentDto) {
    this.name = name;
    this.parentId = parentId;
  }
}
