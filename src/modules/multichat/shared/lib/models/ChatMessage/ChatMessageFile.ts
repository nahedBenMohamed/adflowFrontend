import { UtcDate, type Nullable } from '@/shared';
import type { ChatMessageFileDto } from '../../../../api';

export class ChatMessageFile {
  id: number;
  fileId: Nullable<string>;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: UtcDate;
  downloadUrl: string;

  constructor({
    id,
    fileId,
    fileName,
    fileType,
    fileSize,
    createdAt,
    downloadUrl,
  }: ChatMessageFile) {
    this.id = id;
    this.fileId = fileId;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = fileSize;
    this.createdAt = createdAt;
    this.downloadUrl = downloadUrl;
  }

  static fromDto(dto: ChatMessageFileDto): ChatMessageFile {
    return new ChatMessageFile({
      id: dto.id,
      fileId: dto.fileId,
      fileName: dto.fileName,
      fileType: dto.fileType,
      fileSize: dto.fileSize,
      createdAt: UtcDate.parseISO(dto.createdAt),
      downloadUrl: dto.downloadUrl,
    });
  }

  static fromDtos(dtos: ChatMessageFileDto[]): ChatMessageFile[] {
    return dtos.map(this.fromDto);
  }
}
