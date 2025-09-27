import type { EntitySettings, Nullable } from '@/shared';
import type { MailboxProvider, MailboxState } from '../../../shared';

export interface MailboxDto {
  id: number;
  email: string;
  state: MailboxState;
  provider: MailboxProvider;
  ownerId: Nullable<number>;
  syncDays: Nullable<number>;
  accessibleUserIds: number[];
  errorMessage: Nullable<string>;
  emailsPerDay: Nullable<number>;
  entitySettings?: Nullable<EntitySettings>;
}
