import type { EntitySettings, Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { MailboxDto } from '../../../../api';
import { MailboxProvider } from './MailboxProvider';
import { MailboxState } from './MailboxState';

export class Mailbox {
  id: number;
  email: string;
  provider: MailboxProvider;
  ownerId: Nullable<number>;
  accessibleUserIds: Nullable<number[]>;
  state: MailboxState;
  syncDays: Nullable<number>;
  errorMessage: Nullable<string>;
  emailsPerDay: Nullable<number>;
  entitySettings?: Nullable<EntitySettings>;

  constructor({
    id,
    email,
    state,
    ownerId,
    provider,
    syncDays,
    errorMessage,
    emailsPerDay,
    accessibleUserIds,
    entitySettings,
  }: {
    id: number;
    email: string;
    state: MailboxState;
    provider: MailboxProvider;
    ownerId: Nullable<number>;
    syncDays: Nullable<number>;
    accessibleUserIds: number[];
    errorMessage: Nullable<string>;
    emailsPerDay: Nullable<number>;
    entitySettings?: Nullable<EntitySettings>;
  }) {
    this.id = id;
    this.email = email;
    this.state = state;
    this.ownerId = ownerId;
    this.provider = provider;
    this.syncDays = syncDays;
    this.errorMessage = errorMessage;
    this.emailsPerDay = emailsPerDay;
    this.entitySettings = entitySettings;
    this.accessibleUserIds = accessibleUserIds;

    makeAutoObservable(this);
  }

  static fromDto(dto: MailboxDto): Mailbox {
    return new Mailbox({
      id: dto.id,
      email: dto.email,
      state: dto.state,
      ownerId: dto.ownerId,
      provider: dto.provider,
      syncDays: dto.syncDays,
      errorMessage: dto.errorMessage,
      emailsPerDay: dto.emailsPerDay,
      entitySettings: dto.entitySettings,
      accessibleUserIds: dto.accessibleUserIds,
    });
  }

  static fromDtos(dtos: MailboxDto[]): Mailbox[] {
    return dtos.map(this.fromDto);
  }

  isManual = (): boolean => {
    return this.provider === MailboxProvider.MANUAL;
  };

  isGmail = (): boolean => {
    return this.provider === MailboxProvider.GMAIL;
  };

  isInDraftState = (): boolean => {
    return this.state === MailboxState.DRAFT;
  };

  hasUserAccess = (userId: number): boolean => {
    return (
      this.ownerId === userId ||
      (this.accessibleUserIds ? this.accessibleUserIds.includes(userId) : false)
    );
  };
}
