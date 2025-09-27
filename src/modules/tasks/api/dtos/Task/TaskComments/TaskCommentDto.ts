import type { FileLinkDto } from '@/app';

export class TaskCommentDto {
  id: number;
  taskId: number;
  createdBy: number;
  text: string;
  fileLinks: FileLinkDto[];
  likedUserIds: number[];
  createdAt: string;

  constructor({ id, taskId, createdBy, text, fileLinks, likedUserIds, createdAt }: TaskCommentDto) {
    this.id = id;
    this.taskId = taskId;
    this.createdBy = createdBy;
    this.text = text;
    this.fileLinks = fileLinks;
    this.likedUserIds = likedUserIds;
    this.createdAt = createdAt;
  }
}
