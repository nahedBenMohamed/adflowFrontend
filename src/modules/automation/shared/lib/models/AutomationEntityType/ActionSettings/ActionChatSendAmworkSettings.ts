import type { Nullable } from '@/shared';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionChatSendAmworkSettings extends ActionCommonSettings {
  message: string;
  userId: Nullable<number>;
  sendTo: Nullable<number[]>;
}
