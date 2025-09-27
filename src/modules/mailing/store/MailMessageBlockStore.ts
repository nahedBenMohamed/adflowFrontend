import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { mailMessageApi } from '../api';
import { getMessageContentToDisplay, type MailMessage, type MailMessagePayload } from '../shared';

export class MailMessageBlockStore {
  message: Nullable<MailMessage> = null;

  content = '';
  attachments: MailMessagePayload[] = [];

  isLoading = false;
  isRenderingHTML = false;
  isOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadMessage = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<MailMessage> => {
    try {
      this.isLoading = true;

      const message = await mailMessageApi.getMailMessage({ mailboxId, messageId });
      this.message = message;

      return message;
    } catch (e) {
      throw new Error(`Failed to load message ${messageId} in mailbox ${mailboxId}: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  loadContentAndAttachments = async ({
    mailboxId,
    messageId,
    fallbackContent,
  }: {
    mailboxId: number;
    messageId: number;
    fallbackContent: string;
  }): Promise<void> => {
    const result = await this.loadMessage({ mailboxId, messageId });

    const { content, isRenderingHTML } = getMessageContentToDisplay(
      result.payloads,
      fallbackContent
    );

    this.content = content;
    this.isRenderingHTML = isRenderingHTML;
    this.attachments = result.payloads.filter(p => p.filename);
  };

  toggleOpened = (): void => {
    this.isOpened = !this.isOpened;
  };
}
