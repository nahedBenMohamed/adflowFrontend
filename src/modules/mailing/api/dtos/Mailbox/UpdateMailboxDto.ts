import type { EntitySettings, Nullable } from '@/shared';

export class UpdateMailboxDto {
  email: string;
  ownerId: Nullable<number>;
  accessibleUserIds: number[];
  syncDays: Nullable<number>;
  emailsPerDay?: number;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    email,
    ownerId,
    accessibleUserIds,
    syncDays,
    emailsPerDay,
    entitySettings,
  }: UpdateMailboxDto) {
    this.email = email;
    this.ownerId = ownerId;
    this.accessibleUserIds = accessibleUserIds;
    this.syncDays = syncDays;
    this.emailsPerDay = emailsPerDay;
    this.entitySettings = entitySettings;
  }
}
