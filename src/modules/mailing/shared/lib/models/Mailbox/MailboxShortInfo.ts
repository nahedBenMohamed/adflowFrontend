import type { MailboxShortInfoDto } from '../../../../api';

export class MailboxShortInfo {
  id: number;
  name: string;
  unread: number;
  total: number;

  constructor({ id, name, unread, total }: MailboxShortInfo) {
    this.id = id;
    this.name = name;
    this.unread = unread;
    this.total = total;
  }

  static fromDto(dto: MailboxShortInfoDto): MailboxShortInfo {
    return new MailboxShortInfo({
      id: dto.id,
      name: dto.name,
      unread: dto.unread,
      total: dto.total,
    });
  }

  static fromDtos(dtos: MailboxShortInfoDto[]): MailboxShortInfo[] {
    return dtos.map(this.fromDto);
  }
}
