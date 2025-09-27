import type { MailboxFolderInfoDto } from '../../../../api';
import type { MailboxFolderType } from './MailboxFolderType';

export class MailboxFolderInfo {
  id: number;
  name: string;
  unread: number;
  type: MailboxFolderType;
  total: number;

  constructor({ id, name, unread, type, total }: MailboxFolderInfo) {
    this.id = id;
    this.name = name;
    this.unread = unread;
    this.type = type;
    this.total = total;
  }

  static fromDto(dto: MailboxFolderInfoDto): MailboxFolderInfo {
    return new MailboxFolderInfo({
      id: dto.id,
      name: dto.name,
      unread: dto.unread,
      type: dto.type,
      total: dto.total,
    });
  }

  static fromDtos(dtos: MailboxFolderInfoDto[]): MailboxFolderInfo[] {
    return dtos.map(this.fromDto);
  }
}
