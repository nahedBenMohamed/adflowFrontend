import type { MailboxSectionInfoDto } from '../../../../api';
import type { MailboxFolderType } from './MailboxFolderType';
import { MailboxShortInfo } from './MailboxShortInfo';

export class MailboxSectionInfo {
  type: MailboxFolderType;
  unread: number;
  total: number;
  mailboxes: MailboxShortInfo[];

  constructor({ type, unread, total, mailboxes }: MailboxSectionInfo) {
    this.type = type;
    this.total = total;
    this.unread = unread;
    this.mailboxes = mailboxes;
  }

  static fromDto(dto: MailboxSectionInfoDto): MailboxSectionInfo {
    return new MailboxSectionInfo({
      type: dto.type,
      unread: dto.unread,
      total: dto.total,
      mailboxes: MailboxShortInfo.fromDtos(dto.mailboxes),
    });
  }

  static fromDtos(dtos: MailboxSectionInfoDto[]): MailboxSectionInfo[] {
    return dtos.map(this.fromDto);
  }
}
