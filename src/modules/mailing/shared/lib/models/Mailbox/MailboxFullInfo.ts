import type { MailboxFullInfoDto } from '../../../../api';
import { MailboxFolderInfo } from './MailboxFolderInfo';
import type { MailboxState } from './MailboxState';

export class MailboxFullInfo {
  id: number;
  name: string;
  unread: number;
  total: number;
  state: MailboxState;
  folders: MailboxFolderInfo[];
  ownerId: number;

  constructor({ id, name, unread, total, state, folders, ownerId }: MailboxFullInfo) {
    this.id = id;
    this.name = name;
    this.unread = unread;
    this.total = total;
    this.state = state;
    this.folders = folders;
    this.ownerId = ownerId;
  }

  static fromDto(dto: MailboxFullInfoDto): MailboxFullInfo {
    return new MailboxFullInfo({
      id: dto.id,
      name: dto.name,
      unread: dto.unread,
      total: dto.total,
      state: dto.state,
      folders: MailboxFolderInfo.fromDtos(dto.folders),
      ownerId: dto.ownerId,
    });
  }

  static fromDtos(dtos: MailboxFullInfoDto[]): MailboxFullInfo[] {
    return dtos.map(this.fromDto);
  }
}
