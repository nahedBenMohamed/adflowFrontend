import type { Nullable } from '@/shared';
import { TaskSettingsType } from '../../../shared';

export class TaskSettingsIdentifier {
  type: TaskSettingsType;
  recordId: Nullable<number>;

  constructor({ type, recordId }: { type: TaskSettingsType; recordId: Nullable<number> }) {
    this.type = type;
    this.recordId = recordId;
  }

  static forEntityType(entityTypeId: number): TaskSettingsIdentifier {
    return new TaskSettingsIdentifier({
      type: TaskSettingsType.ENTITY_TYPE,
      recordId: entityTypeId,
    });
  }

  static forTaskBoard(boardId: number): TaskSettingsIdentifier {
    return new TaskSettingsIdentifier({ type: TaskSettingsType.TASK_BOARD, recordId: boardId });
  }

  static forTimeBoard(): TaskSettingsIdentifier {
    return new TaskSettingsIdentifier({ type: TaskSettingsType.TIME_BOARD, recordId: null });
  }

  equals(another: TaskSettingsIdentifier): boolean {
    return this.type === another.type && this.recordId === another.recordId;
  }
}
