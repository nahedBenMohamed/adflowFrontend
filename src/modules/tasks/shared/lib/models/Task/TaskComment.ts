import { FileLink, UtcDate } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { TaskCommentDto } from '../../../../api';

export class TaskComment {
  id: number;
  taskId: number;
  createdBy: number;
  text: string;
  fileLinks: FileLink[];
  likedUserIds: number[];
  createdAt: UtcDate;

  constructor({ id, taskId, createdBy, text, fileLinks, likedUserIds, createdAt }: TaskComment) {
    this.id = id;
    this.taskId = taskId;
    this.createdBy = createdBy;
    this.text = text;
    this.fileLinks = fileLinks;
    this.likedUserIds = likedUserIds;
    this.createdAt = createdAt;

    makeAutoObservable(this);
  }

  static fromDto(dto: TaskCommentDto): TaskComment {
    return new TaskComment({
      id: dto.id,
      text: dto.text,
      taskId: dto.taskId,
      createdBy: dto.createdBy,
      likedUserIds: dto.likedUserIds,
      createdAt: UtcDate.parseISO(dto.createdAt),
      fileLinks: dto.fileLinks.map(FileLink.fromDto),
    });
  }

  static fromDtos(dtos: TaskCommentDto[]): TaskComment[] {
    return dtos.map(this.fromDto);
  }
}
