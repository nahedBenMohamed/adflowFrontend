import type { EntitySettings, Nullable } from '@/shared';
import type {
  ChatProviderStatus,
  ChatProviderTransport,
  ChatProviderType,
  WazzupTransport,
} from '../../../shared';

export class CreateWazzupProviderDto {
  apiKey: string;
  plainId: string;
  channelId: string;
  type: ChatProviderType;
  messagePerDay: number;
  title: Nullable<string>;
  status: ChatProviderStatus;
  transport: ChatProviderTransport;
  channelTransport: WazzupTransport;
  accessibleUserIds?: Nullable<number[]>;
  responsibleUserIds?: Nullable<number[]>;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    apiKey,
    plainId,
    channelId,
    type,
    title,
    status,
    transport,
    messagePerDay,
    channelTransport,
    accessibleUserIds,
    responsibleUserIds,
    supervisorUserIds,
    entitySettings,
  }: CreateWazzupProviderDto) {
    this.apiKey = apiKey;
    this.plainId = plainId;
    this.channelId = channelId;
    this.type = type;
    this.title = title;
    this.status = status;
    this.transport = transport;
    this.messagePerDay = messagePerDay;
    this.channelTransport = channelTransport;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }
}
