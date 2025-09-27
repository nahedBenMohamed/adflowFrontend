import type { EntitySettings, Nullable } from '@/shared';
import type { MessengerProviderSettingsDto } from '../../../../api';
import type { ChatProviderStatus } from '../ChatProvider/ChatProviderStatus';
import type { ChatProviderTransport } from '../ChatProvider/ChatProviderTransport';
import type { ChatProviderType } from '../ChatProvider/ChatProviderType';

export class MessengerProviderSettings {
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
  }: MessengerProviderSettings) {
    this.id = id;
    this.type = type;
    this.transport = transport;
    this.title = title;
    this.status = status;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.pageId = pageId;
    this.pageAccessToken = pageAccessToken;
    this.messagePerDay = messagePerDay;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }

  static fromDto(dto: MessengerProviderSettingsDto): MessengerProviderSettings {
    return new MessengerProviderSettings({
      id: dto.id,
      type: dto.type,
      transport: dto.transport,
      title: dto.title,
      status: dto.status,
      accessibleUserIds: dto.accessibleUserIds,
      responsibleUserIds: dto.responsibleUserIds,
      pageId: dto.pageId,
      pageAccessToken: dto.pageAccessToken,
      messagePerDay: dto.messagePerDay,
      supervisorUserIds: dto.supervisorUserIds,
      entitySettings: dto.entitySettings,
    });
  }

  static fromDtos(dtos: MessengerProviderSettingsDto[]): MessengerProviderSettings[] {
    return dtos.map(this.fromDto);
  }
}
