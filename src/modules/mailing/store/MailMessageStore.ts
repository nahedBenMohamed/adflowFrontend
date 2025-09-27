import type { CreateContactAndLeadDto } from '@/app';
import type { EntityInfo } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { mailMessageApi, type SendMailMessageDto } from '../api';
import type { MailMessage } from '../shared';
export class MailMessageStore {
  messages: MailMessage[] = [];

  isLoading = false;
  isSending = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadMessages = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<void> => {
    try {
      this.isLoading = true;
      this.messages = [];

      this.messages = await mailMessageApi.getMailMessages({ mailboxId, messageId });
    } catch (e) {
      throw new Error(
        `Failed to load messages for thread with messageId ${messageId} in mailbox ${mailboxId}: ${e}`
      );
    } finally {
      this.isLoading = false;
    }
  };

  invalidateMessagesInCache = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<void> => {
    this.messages = await mailMessageApi.getMailMessages({ mailboxId, messageId });
  };

  sendMessage = async ({
    mailboxId,
    dto,
    files,
  }: {
    mailboxId: number;
    dto: SendMailMessageDto;
    files: File[];
  }): Promise<boolean> => {
    try {
      this.isSending = true;

      return await mailMessageApi.sendMailMessage({ mailboxId, dto, files });
    } catch (e) {
      console.error(`Failed to send message: ${e}`);

      return false;
    } finally {
      this.isSending = false;
    }
  };

  createContact = async ({
    mailboxId,
    messageId,
    dto,
  }: {
    mailboxId: number;
    messageId: number;
    dto: CreateContactAndLeadDto;
  }): Promise<EntityInfo> => {
    try {
      return await mailMessageApi.createContact({ mailboxId, messageId, dto });
    } catch (e) {
      throw new Error(
        `Failed to create contact ${dto.contactTypeId} from message ${messageId} in mailbox ${mailboxId}: ${e}`
      );
    }
  };

  clearMessages = (): void => {
    this.messages = [];
  };
}
