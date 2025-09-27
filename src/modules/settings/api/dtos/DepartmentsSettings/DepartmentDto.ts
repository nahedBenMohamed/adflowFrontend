import type { Nullable } from '@/shared';
import type { DepartmentSettingsDto } from './DepartmentSettingsDto';

export class DepartmentDto {
  id: number;
  name: string;
  parentId: Nullable<number>;
  settings: DepartmentSettingsDto;
  subordinates: DepartmentDto[];

  constructor({ id, name, parentId, settings, subordinates }: DepartmentDto) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.settings = settings;
    this.subordinates = subordinates;
  }
}
