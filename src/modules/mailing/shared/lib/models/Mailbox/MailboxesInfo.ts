import { MailboxFullInfo } from './MailboxFullInfo';
import { MailboxSectionInfo } from './MailboxSectionInfo';

export class MailboxesInfo {
  sections: MailboxSectionInfo[];
  mailboxes: MailboxFullInfo[];

  constructor({ sections, mailboxes }: MailboxesInfo) {
    this.sections = sections;
    this.mailboxes = mailboxes;
  }

  static fromDto(dto: MailboxesInfo): MailboxesInfo {
    return new MailboxesInfo({
      sections: MailboxSectionInfo.fromDtos(dto.sections),
      mailboxes: MailboxFullInfo.fromDtos(dto.mailboxes),
    });
  }
}
