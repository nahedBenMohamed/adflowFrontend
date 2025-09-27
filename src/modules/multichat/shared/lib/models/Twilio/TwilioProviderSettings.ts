import type { EntitySettings, Nullable } from '@/shared';
import type { TwilioProviderSettingsDto } from '../../../../api';
import { ChatProviderStatus } from '../ChatProvider/ChatProviderStatus';
import type { ChatProviderTransport } from '../ChatProvider/ChatProviderTransport';
import type { ChatProviderType } from '../ChatProvider/ChatProviderType';

export class TwilioProviderSettings {
  id: number;
  type: ChatProviderType;
  transport: ChatProviderTransport;
  title: string;
  messagePerDay: number;
  status: ChatProviderStatus;
  accessibleUserIds: number[];
  responsibleUserIds: number[];
  accountSid: string;
  phoneNumber: string;
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
    accountSid,
    phoneNumber,
    messagePerDay,
    supervisorUserIds,
    entitySettings,
  }: {
    id: number;
    type: ChatProviderType;
    transport: ChatProviderTransport;
    title: string;
    status: ChatProviderStatus;
    accessibleUserIds: number[];
    responsibleUserIds: number[];
    accountSid: string;
    phoneNumber: string;
    messagePerDay: number;
    supervisorUserIds?: Nullable<number[]>;
    entitySettings?: Nullable<EntitySettings>;
  }) {
    this.id = id;
    this.type = type;
    this.transport = transport;
    this.title = title;
    this.status = status;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.accountSid = accountSid;
    this.phoneNumber = phoneNumber;
    this.messagePerDay = messagePerDay;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }

  static fromDto(dto: TwilioProviderSettingsDto): TwilioProviderSettings {
    return new TwilioProviderSettings({
      id: dto.id,
      type: dto.type,
      transport: dto.transport,
      title: dto.title,
      status: dto.status,
      accessibleUserIds: dto.accessibleUserIds,
      responsibleUserIds: dto.responsibleUserIds,
      accountSid: dto.accountSid,
      phoneNumber: dto.phoneNumber,
      messagePerDay: dto.messagePerDay,
      supervisorUserIds: dto.supervisorUserIds,
      entitySettings: dto.entitySettings,
    });
  }

  static fromDtos(dtos: TwilioProviderSettingsDto[]): TwilioProviderSettings[] {
    return dtos.map(this.fromDto);
  }

  isActive = (): boolean => {
    return this.status === ChatProviderStatus.ACTIVE;
  };
}
