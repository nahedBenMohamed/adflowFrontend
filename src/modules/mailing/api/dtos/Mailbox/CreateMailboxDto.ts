import type { MailboxProvider } from '../../../shared';

export class CreateMailboxDto {
  email: string;
  provider: MailboxProvider;

  constructor({ email, provider }: CreateMailboxDto) {
    this.email = email;
    this.provider = provider;
  }
}
