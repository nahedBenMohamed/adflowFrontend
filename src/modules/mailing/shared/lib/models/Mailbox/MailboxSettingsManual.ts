import type { MailboxSettingsManualDto } from '../../../../api';

export class MailboxSettingsManual {
  imapServer: string;
  imapPort: number;
  imapSecure: boolean;
  smtpServer: string;
  smtpPort: number;
  smtpSecure: boolean;

  constructor({
    imapServer,
    imapPort,
    imapSecure,
    smtpServer,
    smtpPort,
    smtpSecure,
  }: MailboxSettingsManual) {
    this.imapServer = imapServer;
    this.imapPort = imapPort;
    this.imapSecure = imapSecure;
    this.smtpServer = smtpServer;
    this.smtpPort = smtpPort;
    this.smtpSecure = smtpSecure;
  }

  static fromDto(dto: MailboxSettingsManualDto): MailboxSettingsManual {
    return new MailboxSettingsManual({
      imapServer: dto.imapServer,
      imapPort: dto.imapPort,
      imapSecure: dto.imapSecure,
      smtpServer: dto.smtpServer,
      smtpPort: dto.smtpPort,
      smtpSecure: dto.smtpSecure,
    });
  }
}
