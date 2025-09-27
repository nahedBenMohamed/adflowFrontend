export class UpdateMailboxSettingsManualDto {
  email: string;
  password: string;
  imapServer: string;
  imapPort: number;
  imapSecure: boolean;
  smtpServer: string;
  smtpPort: number;
  smtpSecure: boolean;

  constructor({
    email,
    password,
    imapServer,
    imapPort,
    imapSecure,
    smtpServer,
    smtpPort,
    smtpSecure,
  }: UpdateMailboxSettingsManualDto) {
    this.email = email;
    this.password = password;
    this.imapServer = imapServer;
    this.imapPort = imapPort;
    this.imapSecure = imapSecure;
    this.smtpServer = smtpServer;
    this.smtpPort = smtpPort;
    this.smtpSecure = smtpSecure;
  }
}
