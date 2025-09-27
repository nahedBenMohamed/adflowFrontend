import type { EntitySettings, Nullable } from '@/shared';
import type { ChatProviderStatus, ChatProviderTransport, ChatProviderType } from '../../../shared';

export class CreateTwilioProviderDto {
  type: ChatProviderType;
  transport: ChatProviderTransport;
  title: string;
  status: ChatProviderStatus;
  accessibleUserIds: number[];
  responsibleUserIds: number[];
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    type,
    transport,
    title,
    status,
    accessibleUserIds,
    responsibleUserIds,
    accountSid,
    authToken,
    phoneNumber,
    supervisorUserIds,
    entitySettings,
  }: CreateTwilioProviderDto) {
    this.type = type;
    this.transport = transport;
    this.title = title;
    this.status = status;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.phoneNumber = phoneNumber;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }
}
