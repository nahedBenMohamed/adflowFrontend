import { watchdogStore } from '@/app';
import type { DataStore, Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { mailboxApi, type MailThreadMeta } from '../api';
import {
  type MailboxFolderType,
  type MailboxFullInfo,
  type MailboxSectionInfo,
  type MailboxSignature,
  type MailThreadInfo,
} from '../shared';

export class MailboxStore implements DataStore {
  mailboxes: MailboxFullInfo[] = [];
  sections: MailboxSectionInfo[] = [];
  mailThreadInfos: MailThreadInfo[] = [];
  mailThreadInfoMeta: MailThreadMeta = {
    total: 0,
  };
  currentThreadId: Nullable<string> = null;

  isMailboxInfoLoading = false;
  isMailboxInfoLoaded = false;

  isMailThreadInfosLoading = false;
  isMailThreadInfosLoaded = false;
  isMailThreadInfosLoadingMore = false;
  isMailThreadInfosLoadedMore = false;

  isSpamThreadLoading = false;
  isTrashThreadLoading = false;

  areSignaturesLoading = false;

  search: Nullable<string> = null;

  constructor() {
    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  setCurrentThreadId = (threadId: Nullable<string>): void => {
    this.currentThreadId = threadId;
  };

  setSearch = (search: Nullable<string>): void => {
    // to prevent flickering of no results message, when we're setting new search it explicitly means that we're loading new data
    this.isMailThreadInfosLoadedMore = false;
    this.search = search;
  };

  loadData = async (): Promise<void> => {
    await this.loadMailboxInfo();
  };

  loadMailboxInfo = async (): Promise<void> => {
    try {
      this.isMailboxInfoLoading = true;
      this.isMailboxInfoLoaded = false;

      const { sections, mailboxes } = await mailboxApi.getMailboxesInfo();

      this.sections = sections;
      this.mailboxes = mailboxes;
    } catch (e) {
      throw new Error(`Error while loading mailbox info: ${e}`);
    } finally {
      this.isMailboxInfoLoading = false;
      this.isMailboxInfoLoaded = true;
    }
  };

  loadMailboxSignatures = async (mailboxId: number): Promise<MailboxSignature[]> => {
    try {
      this.areSignaturesLoading = true;

      const signatures = mailboxApi.getMailboxSignatures(mailboxId);

      return signatures;
    } catch (e) {
      throw new Error(`Error while loading mailbox ${mailboxId} signatures: ${e}`);
    } finally {
      this.areSignaturesLoading = false;
    }
  };

  loadSectionMailThreadInfo = async ({
    type,
    mailboxId = null,
  }: {
    type: MailboxFolderType;
    mailboxId?: Nullable<number>;
  }): Promise<void> => {
    try {
      this.isMailThreadInfosLoaded = false;
      this.isMailThreadInfosLoading = true;

      const { meta, threads } = await mailboxApi.getSectionMailThreadInfos({
        type,
        mailboxId,
        offset: null,
        search: this.search,
      });

      this.mailThreadInfos = threads;
      this.mailThreadInfoMeta = meta;
    } catch (e) {
      throw new Error(`Error while loading ${type} section mail thread info: ${e}`);
    } finally {
      this.isMailThreadInfosLoaded = true;
      this.isMailThreadInfosLoading = false;
    }
  };

  loadMoreSectionMailThreadInfo = async ({
    type,
    mailboxId = null,
  }: {
    type: MailboxFolderType;
    mailboxId?: Nullable<number>;
  }): Promise<void> => {
    if (
      (this.mailThreadInfos.length < this.mailThreadInfoMeta.total ||
        // for search logic when we have no results
        (this.mailThreadInfos.length === 0 && this.mailThreadInfoMeta.total === 0)) &&
      this.isMailThreadInfosLoaded &&
      !this.isMailThreadInfosLoadingMore
    ) {
      try {
        this.isMailThreadInfosLoadingMore = true;
        this.isMailThreadInfosLoadedMore = false;

        const { meta, threads } = await mailboxApi.getSectionMailThreadInfos({
          type,
          mailboxId,
          offset: this.mailThreadInfos.length,
          search: this.search,
        });

        this.mailThreadInfos = [...this.mailThreadInfos, ...threads];
        this.mailThreadInfoMeta = meta;
      } catch (e) {
        throw new Error(`Error while loading more ${type} section mail thread info: ${e}`);
      } finally {
        this.isMailThreadInfosLoadingMore = false;
        this.isMailThreadInfosLoadedMore = true;
      }
    }
  };

  loadMailboxMailThreadInfo = async ({
    mailboxId,
    folderId = null,
  }: {
    mailboxId: number;
    folderId?: Nullable<number>;
  }): Promise<void> => {
    try {
      this.isMailThreadInfosLoaded = false;
      this.isMailThreadInfosLoading = true;

      const { meta, threads } = await mailboxApi.getMailboxMailThreadInfos({
        mailboxId,
        folderId,
        offset: null,
        search: this.search,
      });

      this.mailThreadInfos = threads;
      this.mailThreadInfoMeta = meta;
    } catch (e) {
      throw new Error(`Error while loading mailbox mail thread info: ${e}`);
    } finally {
      this.isMailThreadInfosLoaded = true;
      this.isMailThreadInfosLoading = false;
    }
  };

  loadMoreMailboxMailThreadInfo = async ({
    mailboxId,
    folderId = null,
  }: {
    mailboxId: number;
    folderId?: Nullable<number>;
  }): Promise<void> => {
    if (
      (this.mailThreadInfos.length < this.mailThreadInfoMeta.total ||
        // for search logic when we have no results
        (this.mailThreadInfos.length === 0 && this.mailThreadInfoMeta.total === 0)) &&
      this.isMailThreadInfosLoaded &&
      !this.isMailThreadInfosLoadingMore
    ) {
      try {
        this.isMailThreadInfosLoadingMore = true;
        this.isMailThreadInfosLoadedMore = false;

        const { meta, threads } = await mailboxApi.getMailboxMailThreadInfos({
          mailboxId,
          folderId,
          offset: this.mailThreadInfos.length,
          search: this.search,
        });

        this.mailThreadInfos = [...this.mailThreadInfos, ...threads];
        this.mailThreadInfoMeta = meta;
      } catch (e) {
        throw new Error(`Error while loading more mailbox mail thread info: ${e}`);
      } finally {
        this.isMailThreadInfosLoadingMore = false;
        this.isMailThreadInfosLoadedMore = true;
      }
    }
  };

  selectNextThread = (clearMessages: () => void): void => {
    const threadIdx = this.mailThreadInfos.findIndex(mti => mti.id === this.currentThreadId);
    this.mailThreadInfos = this.mailThreadInfos.filter(mti => mti.id !== this.currentThreadId);

    const isLastThread = threadIdx === this.mailThreadInfos.length;

    const previousThread = threadIdx !== 0 ? this.mailThreadInfos[threadIdx - 1] : null;
    const currentThread = this.mailThreadInfos[threadIdx];

    if (isLastThread && previousThread) {
      this.setCurrentThreadId(previousThread.id);
    } else if (isLastThread && threadIdx === 0) {
      this.setCurrentThreadId(null);

      clearMessages();
    } else if (currentThread) {
      this.setCurrentThreadId(currentThread.id);
    }
  };

  spamThreadHandler = async ({
    type,
    mailboxId,
    messageId,
    clearMessages,
  }: {
    type: 'spam' | 'unspam';
    mailboxId: number;
    messageId: number;
    clearMessages: () => void;
  }): Promise<void> => {
    try {
      this.isSpamThreadLoading = true;

      let result = false;

      if (type === 'spam') {
        result = await mailboxApi.spamThread({ mailboxId, messageId });
      } else {
        result = await mailboxApi.unspamThread({ mailboxId, messageId });
      }

      if (!result) return;

      this.selectNextThread(clearMessages);
    } catch (e) {
      throw new Error(
        `Failed to ${type} thread with messageId ${messageId} in mailbox ${mailboxId}: ${e}`
      );
    } finally {
      this.isSpamThreadLoading = false;
    }
  };

  trashThreadHandler = async ({
    type,
    mailboxId,
    messageId,
    clearMessages,
  }: {
    type: 'trash' | 'untrash';
    mailboxId: number;
    messageId: number;
    clearMessages: () => void;
  }): Promise<void> => {
    try {
      this.isTrashThreadLoading = true;

      let result = false;

      if (type === 'trash') {
        result = await mailboxApi.trashThread({ mailboxId, messageId });
      } else {
        result = await mailboxApi.untrashThread({ mailboxId, messageId });
      }

      if (!result) return;

      this.selectNextThread(clearMessages);
    } catch (e) {
      throw new Error(
        `Failed to ${type} thread with messageId ${messageId} in mailbox ${mailboxId}: ${e}`
      );
    } finally {
      this.isTrashThreadLoading = false;
    }
  };

  seenThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<void> => {
    try {
      await mailboxApi.seenThread({ mailboxId, messageId });
    } catch (e) {
      throw new Error(
        `Failed to mark thread with messageId ${messageId} in mailbox ${mailboxId} as seen: ${e}`
      );
    }
  };

  unseenThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<void> => {
    try {
      await mailboxApi.unseenThread({ mailboxId, messageId });
    } catch (e) {
      throw new Error(
        `Failed to mark thread with messageId ${messageId} in mailbox ${mailboxId} as unseen: ${e}`
      );
    }
  };

  clearThreads = (): void => {
    this.mailThreadInfos = [];
  };

  reset = (): void => {
    this.mailboxes = [];
    this.sections = [];
  };
}
