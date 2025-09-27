import { type FileLinkDto } from '@/app';
import { FileInfo } from '../FileInfo/FileInfo';
import { UtcDate } from '../UtcDate';

export class FileLink {
  id: number;
  fileInfo: FileInfo;

  constructor(id: number, fileInfo: FileInfo) {
    this.id = id;
    this.fileInfo = fileInfo;
  }

  static fromDto(dto: FileLinkDto): FileLink {
    return new FileLink(
      dto.id,
      new FileInfo({
        fileId: dto.fileId,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        fileType: dto.fileType,
        downloadUrl: dto.downloadUrl,
        previewUrl: dto.previewUrl,
        createdAt: UtcDate.parseISO(dto.createdAt),
        createdBy: dto.createdBy,
      })
    );
  }

  static fromDtos(dtos: FileLinkDto[]): FileLink[] {
    return dtos.map(this.fromDto);
  }
}
