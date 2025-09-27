import type { EntitySettings, Nullable } from '@/shared';
import type { ChatProviderStatus } from '../../../shared';

export class UpdateWazzupProviderDto {
  title?: Nullable<string>;
  status?: ChatProviderStatus;
  messagePerDay: number;
  accessibleUserIds?: Nullable<number[]>;
  responsibleUserIds?: Nullable<number[]>;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    title,
    status,
    messagePerDay,
    accessibleUserIds,
    responsibleUserIds,
    supervisorUserIds,
    entitySettings,
  }: UpdateWazzupProviderDto) {
    this.title = title;
    this.status = status;
    this.messagePerDay = messagePerDay;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }
}
