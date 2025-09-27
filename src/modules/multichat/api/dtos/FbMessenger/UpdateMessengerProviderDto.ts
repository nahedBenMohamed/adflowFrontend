import type { EntitySettings, Nullable } from '@/shared';
import type { ChatProviderStatus } from '../../../shared';

export class UpdateMessengerProviderDto {
  title: string;
  status: ChatProviderStatus;
  accessibleUserIds: number[];
  responsibleUserIds: number[];
  messagePerDay: number;
  supervisorUserIds?: Nullable<number[]>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    title,
    status,
    accessibleUserIds,
    responsibleUserIds,
    messagePerDay,
    supervisorUserIds,
    entitySettings,
  }: UpdateMessengerProviderDto) {
    this.title = title;
    this.status = status;
    this.messagePerDay = messagePerDay;
    this.accessibleUserIds = accessibleUserIds;
    this.responsibleUserIds = responsibleUserIds;
    this.supervisorUserIds = supervisorUserIds;
    this.entitySettings = entitySettings;
  }
}
