import type { EntitySettings, Nullable } from '@/shared';
import type { WazzupProviderDto } from '../../../../api';
import { ChatProviderStatus } from '../ChatProvider/ChatProviderStatus';
import type { ChatProviderTransport } from '../ChatProvider/ChatProviderTransport';
import type { ChatProviderType } from '../ChatProvider/ChatProviderType';

export class WazzupProvider {
  id: number;
  title: string;
  plainId: string;
  chatType: string;
  channelId: string;
  messagePerDay: number;
  type: ChatProviderType;
  status: ChatProviderStatus;
  transport: ChatProviderTransport;
  accessibleUserIds?: Nullable<number[]>;
  responsibleUserIds?: Nullable<number[]>;
  unseenCount?: Nullable<number>;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    id,
    plainId,
    chatType,
    channelId,
    type,
    title,
    status,
    transport,
    messagePerDay,
    accessibleUserIds,
    responsibleUserIds,
    unseenCount,
    supervisorUserIds,
    entitySettings,
  }: {
    id: number;
    title: string;
    plainId: string;
    chatType: string;
    channelId: string;
    messagePerDay: number;
    type: ChatProviderType;
    status: ChatProviderStatus;
    transport: ChatProviderTransport;
    accessibleUserIds?: Nullable<number[]>;
    responsibleUserIds?: Nullable<number[]>;
    unseenCount?: Nullable<number>;
    supervisorUserIds?: Nullable<number[]>;
    entitySettings?: Nullable<EntitySettings>;
  }) {
    this.id = id;
    this.plainId = plainId;
    this.chatType = chatType;
    this.channelId = channelId;
    this.type = type;
    this.title = title;
    this.status = status;
    this.transport = transport;
    this.messagePerDay = messagePerDay;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.unseenCount = unseenCount;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }

  static fromDto(dto: WazzupProviderDto): WazzupProvider {
    return new WazzupProvider({
      id: dto.id,
      type: dto.type,
      status: dto.status,
      plainId: dto.plainId,
      chatType: dto.chatType,
      channelId: dto.channelId,
      transport: dto.transport,
      title: dto.title ?? 'Wazzup',
      messagePerDay: dto.messagePerDay,
      accessibleUserIds: dto.accessibleUserIds,
      responsibleUserIds: dto.responsibleUserIds,
      unseenCount: dto.unseenCount,
      supervisorUserIds: dto.supervisorUserIds,
      entitySettings: dto.entitySettings,
    });
  }

  static fromDtos(dtos: WazzupProviderDto[]): WazzupProvider[] {
    return dtos.map(this.fromDto);
  }

  isActive = (): boolean => {
    return this.status === ChatProviderStatus.ACTIVE;
  };
}
