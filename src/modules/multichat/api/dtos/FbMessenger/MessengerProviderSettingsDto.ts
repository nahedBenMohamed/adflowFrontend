import type { EntitySettings, Nullable } from '@/shared';
import type { ChatProviderStatus, ChatProviderTransport, ChatProviderType } from '../../../shared';

export class MessengerProviderSettingsDto {
  id: number;
  type: ChatProviderType;
  transport: ChatProviderTransport;
  title: string;
  status: ChatProviderStatus;
  accessibleUserIds: number[];
  responsibleUserIds: number[];
  pageId: string;
  pageAccessToken: string;
  messagePerDay: number;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    id,
    type,
    transport,
    title,
    status,
    accessibleUserIds,
    responsibleUserIds,
    pageId,
    pageAccessToken,
    messagePerDay,
    supervisorUserIds,
    entitySettings,
  }: MessengerProviderSettingsDto) {
    this.id = id;
    this.type = type;
    this.transport = transport;
    this.title = title;
    this.status = status;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.pageId = pageId;
    this.messagePerDay = messagePerDay;
    this.pageAccessToken = pageAccessToken;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }
}
