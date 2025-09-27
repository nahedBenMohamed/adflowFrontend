import { userStore } from '@/app';
import type { DataStore, Nullable, Optional, User } from '@/shared';
import { makeAutoObservable } from 'mobx';
import addressparser from 'nodemailer/lib/addressparser';
import {
  mailboxSettingsApi,
  type CreateMailboxDto,
  type UpdateMailboxDto,
  type UpdateMailboxSettingsManualDto,
  type UpdateMailboxSettingsResult,
} from '../api';
import {
  MailboxState,
  type Mailbox,
  type MailboxSettingsManual,
  type MessageHeaderObject,
} from '../shared';

class MailboxSettingsStore implements DataStore {
  private _mailboxes: Mailbox[] = [];

  isLoading = false;
  isAdding = false;

  constructor() {
    makeAutoObservable(this);
  }

  get notDeletedMailboxes(): Mailbox[] {
    return this._mailboxes.filter(mb => mb.state !== MailboxState.DELETED);
  }

  get activeMailboxes(): Mailbox[] {
    return this._mailboxes.filter(mb => mb.state === MailboxState.ACTIVE);
  }

  getById = (id: number): Mailbox => {
    const mailbox = this._mailboxes.find(mb => mb.id === id);

    if (!mailbox) throw new Error(`Mailbox with id ${id} was not found`);

    return mailbox;
  };

  loadData = async (): Promise<void> => {
    await this.loadMailboxes();
  };

  loadMailboxes = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this._mailboxes = await mailboxSettingsApi.getMailboxes();
    } catch (e) {
      throw new Error(`Error while loading mailboxes: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  addMailbox = async (dto: CreateMailboxDto): Promise<Mailbox> => {
    try {
      this.isAdding = true;

      const mailbox = await mailboxSettingsApi.addMailbox(dto);

      this._mailboxes = [mailbox, ...this._mailboxes];

      return mailbox;
    } catch (e) {
      throw new Error(`Error while adding mailbox ${dto.email}: ${e}`);
    } finally {
      this.isAdding = false;
    }
  };

  deleteMailbox = async ({ id, save }: { id: number; save: boolean }): Promise<void> => {
    try {
      await mailboxSettingsApi.deleteMailbox({ id, save });

      const deletedMailbox = this._mailboxes.find(mb => mb.id === id);

      if (deletedMailbox) {
        deletedMailbox.state = MailboxState.DELETED;

        this._mailboxes = this._mailboxes.map<Mailbox>(mb => (mb.id === id ? deletedMailbox : mb));
      } else {
        throw new Error(`Mailbox with id ${id} was not found`);
      }
    } catch (e) {
      throw new Error(`Error while deleting mailbox with id ${id}: ${e}`);
    }
  };

  getMailboxSettingsManual = async (id: number): Promise<MailboxSettingsManual> => {
    try {
      const settings = await mailboxSettingsApi.getMailboxSettingsManual(id);

      return settings;
    } catch (e) {
      throw new Error(`Error while getting mailbox settings manual with id ${id}: ${e}`);
    }
  };

  updateMailboxSettingsManual = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSettingsManualDto;
  }): Promise<UpdateMailboxSettingsResult> => {
    try {
      return await mailboxSettingsApi.updateMailboxSettingsManual({ id, dto });
    } catch (e) {
      throw new Error(`Error while updating mailbox settings manual with id ${id}: ${e}`);
    }
  };

  updateMailbox = async ({ id, dto }: { id: number; dto: UpdateMailboxDto }): Promise<void> => {
    try {
      const updatedMailbox = await mailboxSettingsApi.updateMailbox({ id, dto });

      this._mailboxes = this._mailboxes.map<Mailbox>(mb => (mb.id === id ? updatedMailbox : mb));
    } catch (e) {
      throw new Error(`Error while updating mailbox with id ${id}: ${e}`);
    }
  };

  getOwnerByMailboxName = (email: string): Optional<User> => {
    const mailbox = this._mailboxes.find(m => m.email === email);

    if (!mailbox || !mailbox.ownerId) return;

    return userStore.getById(mailbox.ownerId);
  };

  getParsedHeaderString = ({
    sentTo,
    sentFrom,
  }: {
    sentTo: Nullable<string>;
    sentFrom: Nullable<string>;
  }): MessageHeaderObject => {
    // try to parse name from sentFrom and sentTo email addresses
    const parsedFromName = sentFrom ? addressparser(sentFrom)?.[0]?.name : '';
    const parsedToName = sentTo ? addressparser(sentTo)?.[0]?.name : '';

    const sentToUnknownString = '...';

    if (!parsedFromName || !parsedToName)
      // if no names are parsed, return email addresses
      return {
        sentFrom: {
          email: sentFrom,
          title: sentFrom,
        },
        sentTo: {
          email: sentTo ?? sentToUnknownString,
          title: sentTo ?? sentToUnknownString,
        },
      };

    // if both names are parsed, return them
    if (parsedFromName.length && parsedToName.length)
      return {
        sentFrom: {
          email: parsedFromName,
          title: sentFrom,
        },
        sentTo: {
          email: parsedToName,
          title: sentTo ?? sentToUnknownString,
        },
      };

    // if only sentFrom is parsed, try to find another address in loaded mailboxes
    if (parsedFromName.length && !parsedToName.length) {
      const calculatedTo = sentTo ? this.getOwnerByMailboxName(sentTo) : '';
      const calculatedToName = calculatedTo ? calculatedTo.fullName : sentTo;

      return {
        sentFrom: {
          email: parsedFromName,
          title: sentFrom,
        },
        sentTo: {
          email: calculatedToName ?? sentToUnknownString,
          title: sentTo ?? sentToUnknownString,
        },
      };
    }

    // if only sentTo is parsed, try to find another address in loaded mailboxes
    if (!parsedFromName.length && parsedToName.length) {
      const calculatedFrom = sentFrom ? this.getOwnerByMailboxName(sentFrom) : undefined;
      const calculatedFromName = calculatedFrom ? calculatedFrom.fullName : sentFrom;

      return {
        sentFrom: {
          email: calculatedFromName,
          title: sentFrom,
        },
        sentTo: {
          email: parsedToName,
          title: sentTo ?? sentToUnknownString,
        },
      };
    }

    throw new Error(
      `Error while getting parsed header string, sentFrom ${sentFrom}, sentTo ${sentTo}`
    );
  };

  reset = (): void => {
    this._mailboxes = [];

    this.isLoading = false;
    this.isAdding = false;
  };
}

export const mailboxSettingsStore = new MailboxSettingsStore();
