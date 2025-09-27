export interface MailboxSettingsManualDto {
  imapPort: number;
  smtpPort: number;
  imapServer: string;
  smtpServer: string;
  imapSecure: boolean;
  smtpSecure: boolean;
}
