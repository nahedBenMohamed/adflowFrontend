import type { FileInfoResultDto } from '@/app';
import type { Nullable } from '../../types';
import { UtcDate } from '../UtcDate';

export class FileInfo {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
  previewUrl: Nullable<string>;
  createdAt: UtcDate;
  createdBy: number;

  constructor({
    fileId,
    fileName,
    fileSize,
    fileType,
    downloadUrl,
    previewUrl,
    createdAt,
    createdBy,
  }: FileInfo) {
    this.fileId = fileId;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.fileType = fileType;
    this.downloadUrl = downloadUrl;
    this.previewUrl = previewUrl;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }

  static fromResultDto(dto: FileInfoResultDto): FileInfo {
    return new FileInfo({
      fileId: dto.id,
      fileName: dto.fileName,
      fileSize: dto.fileSize,
      fileType: dto.mimeType,
      downloadUrl: dto.downloadUrl ?? '',
      previewUrl: dto.previewUrl,
      createdAt: UtcDate.parseISO(dto.createdAt),
      createdBy: -1,
    });
  }
}
