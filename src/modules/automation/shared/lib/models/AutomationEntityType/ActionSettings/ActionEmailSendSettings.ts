import type { Nullable } from '@/shared';
import type { ActionCommonSettings } from './ActionCommonSettings';
import type { ActionSendOptions } from './ActionSendOptions';

export interface ActionEmailSendSettings extends ActionCommonSettings {
  userId: number;
  subject: string;
  content: string;
  mailboxId: number;
  sendAsHtml: boolean;
  signature?: Nullable<string>;
  options?: Nullable<ActionSendOptions>;
}
