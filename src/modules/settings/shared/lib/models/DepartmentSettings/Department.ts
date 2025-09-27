import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { DepartmentDto } from '../../../../api';
import { DepartmentSettings } from './DepartmentSettings';

export class Department {
  id: number;
  name: string;
  parentId: Nullable<number>;
  settings?: DepartmentSettings;
  subordinates: Department[];

  constructor({ id, name, parentId, settings, subordinates }: Department) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.settings = settings;
    this.subordinates = subordinates;

    makeAutoObservable(this);
  }

  static fromDto(dto: DepartmentDto): Department {
    return new Department({
      id: dto.id,
      name: dto.name,
      parentId: dto.parentId,
      settings: dto.settings ? DepartmentSettings.fromDto(dto.settings) : undefined,
      subordinates: Department.fromDtos(dto.subordinates ?? []),
    });
  }

  static fromDtos(dtos: DepartmentDto[]): Department[] {
    return dtos ? dtos.map(this.fromDto) : [];
  }
}
