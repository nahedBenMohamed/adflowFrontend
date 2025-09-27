import type { ManualSorting, Nullable } from '@/shared';
import type { Task } from '../../../shared';
import type { CreateSubtaskDto } from './Subtask/CreateSubtaskDto';
import type { UpdateSubtaskDto } from './Subtask/UpdateSubtaskDto';

export class UpdateTaskDto {
  text?: string;
  title?: string;
  fileIds?: string[];
  isResolved?: boolean;
  sorting?: ManualSorting;
  boardId?: Nullable<number>;
  stageId?: Nullable<number>;
  responsibleUserId?: number;
  endDate?: Nullable<string>;
  entityId?: Nullable<number>;
  startDate?: Nullable<string>;
  plannedTime?: Nullable<number>;
  subtasks?: (CreateSubtaskDto | UpdateSubtaskDto)[];

  private constructor(data: Partial<UpdateTaskDto>) {
    Object.assign(this, data);
  }

  static create(data: Partial<UpdateTaskDto>): UpdateTaskDto {
    return new UpdateTaskDto(data);
  }

  static fromTask(task: Task): UpdateTaskDto {
    const fileIds = task.fileLinks.map<string>(fl => fl.fileInfo.fileId);

    return this.create({
      text: task.text,
      title: task.title,
      boardId: task.boardId,
      stageId: task.stageId,
      isResolved: task.isResolved,
      plannedTime: task.plannedTime,
      entityId: task.entityInfo?.id ?? null,
      responsibleUserId: task.responsibleUserId,
      fileIds: fileIds.length ? fileIds : undefined,
      endDate: task.endDate ? task.endDate.formatISO() : null,
      subtasks: task.subtasks.length ? task.subtasks : undefined,
      startDate: task.startDate ? task.startDate.formatISO() : null,
    });
  }
}
