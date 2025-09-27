import type { EntitySettings, Nullable } from '@/shared';
import type { ChatProviderStatus, ChatProviderTransport, ChatProviderType } from '../../../shared';

export class TwilioProviderSettingsDto {
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
  }: TwilioProviderSettingsDto) {
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
}
