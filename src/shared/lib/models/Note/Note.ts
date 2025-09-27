import type { NoteDto } from '@/modules/card';
import { makeAutoObservable } from 'mobx';
import { FileLink } from '../FileLink/FileLink';
import { UtcDate } from '../UtcDate';

export class Note {
  id: number;
  text: string;
  entityId: number;
  createdBy: number;
  createdAt: UtcDate;
  fileLinks: FileLink[];

  constructor({
    id,
    entityId,
    createdAt,
    createdBy,
    text,
    fileLinks,
  }: {
    id: number;
    entityId: number;
    createdAt: UtcDate;
    createdBy: number;
    text: string;
    fileLinks: FileLink[];
  }) {
    this.id = id;
    this.text = text;
    this.entityId = entityId;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.fileLinks = fileLinks;

    makeAutoObservable(this);
  }

  static fromDto(dto: NoteDto): Note {
    return new Note({
      id: dto.id,
      text: dto.text,
      entityId: dto.entityId,
      createdBy: dto.createdBy,
      createdAt: UtcDate.parseISO(dto.createdAt),
      fileLinks: FileLink.fromDtos(dto.fileLinks),
    });
  }
}
