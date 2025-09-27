import type { Nullable } from '@/shared';

export class CreateTaskCommentDto {
  text: string;
  fileIds: Nullable<string[]>;

  constructor({ text, fileIds }: CreateTaskCommentDto) {
    this.text = text;
    this.fileIds = fileIds;
  }
}
