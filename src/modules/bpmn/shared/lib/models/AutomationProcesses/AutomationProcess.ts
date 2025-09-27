import { type Nullable, UtcDate } from '@/shared';
import type { AutomationProcessDto } from '../../../../api';
import type { AutomationProcessType } from './AutomationProcessType';

export class AutomationProcess {
  id: number;
  name: string;
  createdAt: UtcDate;
  createdBy: number;
  isActive: boolean;
  isReadonly: boolean;
  type: AutomationProcessType;
  objectId?: Nullable<number>;
  bpmnFile?: Nullable<string>;

  constructor({
    id,
    name,
    createdAt,
    createdBy,
    isActive,
    isReadonly,
    type,
    objectId,
    bpmnFile,
  }: AutomationProcess) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.isActive = isActive;
    this.isReadonly = isReadonly;
    this.type = type;
    this.objectId = objectId;
    this.bpmnFile = bpmnFile;
  }

  static fromDto(dto: AutomationProcessDto): AutomationProcess {
    return new AutomationProcess({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      isActive: dto.isActive,
      objectId: dto.objectId,
      bpmnFile: dto.bpmnFile,
      createdBy: dto.createdBy,
      isReadonly: dto.isReadonly,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: AutomationProcessDto[]): AutomationProcess[] {
    return dtos.map(this.fromDto);
  }
}
