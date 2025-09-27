import type { Nullable } from '@/shared';
import type { ActionSendOptions } from '../ActionSettings/ActionSendOptions';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionChatSendSettings extends ActionCommonSettings {
  message: string;
  providerId: number;
  userId: Nullable<number>;
  options?: Nullable<ActionSendOptions>;
  phoneNumbers?: Nullable<string[]>;
}
