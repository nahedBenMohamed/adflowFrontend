import type { EntitySettings, Nullable } from '@/shared';
import type { ChatProviderStatus, ChatProviderTransport, ChatProviderType } from '../../../shared';

export interface WazzupProviderDto {
  id: number;
  plainId: string;
  chatType: string;
  channelId: string;
  messagePerDay: number;
  type: ChatProviderType;
  title: Nullable<string>;
  status: ChatProviderStatus;
  transport: ChatProviderTransport;
  accessibleUserIds?: Nullable<number[]>;
  responsibleUserIds?: Nullable<number[]>;
  unseenCount?: Nullable<number>;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;
}
