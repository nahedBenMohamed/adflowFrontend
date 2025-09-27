import { TaskSettingsIdentifier, type TaskSettingsDto } from '../../../../api';
import type { TaskFieldCode } from './TaskFieldCode';

export class TaskSettings {
  id: number;
  activeFields: TaskFieldCode[];
  identifier: TaskSettingsIdentifier;

  constructor({
    id,
    activeFields,
    identifier,
  }: {
    id: number;
    activeFields: TaskFieldCode[];
    identifier: TaskSettingsIdentifier;
  }) {
    this.id = id;
    this.activeFields = activeFields;
    this.identifier = identifier;
  }

  static fromDto(dto: TaskSettingsDto): TaskSettings {
    const identifier = new TaskSettingsIdentifier({ type: dto.type, recordId: dto.recordId });

    return new TaskSettings({ id: dto.id, activeFields: dto.activeFields, identifier });
  }

  static fromDtos(dtos: TaskSettingsDto[]): TaskSettings[] {
    return dtos.map(this.fromDto);
  }
}
