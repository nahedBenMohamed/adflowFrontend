import type { EntitySettings, Nullable } from '@/shared';

export class UpdateTwilioProviderDto {
  title: string;
  status: string;
  accessibleUserIds: number[];
  responsibleUserIds: number[];
  accountSid: string;
  authToken: Nullable<string>;
  phoneNumber: string;
  messagePerDay?: number;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    title,
    status,
    accessibleUserIds,
    responsibleUserIds,
    accountSid,
    authToken,
    phoneNumber,
    messagePerDay,
    supervisorUserIds,
    entitySettings,
  }: UpdateTwilioProviderDto) {
    this.title = title;
    this.status = status;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.phoneNumber = phoneNumber;
    this.messagePerDay = messagePerDay;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }
}
