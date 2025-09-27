import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import {
  MailThreadInfo,
  MailboxSignature,
  MailboxesInfo,
  type MailboxFolderType,
  type MailboxesInfo as MailboxesInfoDto,
} from '../../shared';
import { MailingApiRoutes } from '../MailingApiRoutes';
import type { MailThreadInfoDto } from '../dtos';

export interface MailThreadMeta {
  total: number;
}

interface MailThreadResult {
  meta: MailThreadMeta;
  threads: MailThreadInfoDto[];
}

const THREAD_LIMIT = 20;
class MailboxApi {
  getMailboxesInfo = async (): Promise<MailboxesInfoDto> => {
    const response = await baseApi.get(MailingApiRoutes.GET_MAILBOX_INFO);

    return MailboxesInfo.fromDto(response.data);
  };

  getMailboxSignatures = async (mailboxId: number): Promise<MailboxSignature[]> => {
    const response = await baseApi.get(MailingApiRoutes.GET_SIGNATURES, { params: { mailboxId } });

    return MailboxSignature.fromDtos(response.data);
  };

  getSectionMailThreadInfos = async ({
    type,
    mailboxId,
    offset = null,
    search = null,
  }: {
    type: MailboxFolderType;
    mailboxId: Nullable<number>;
    offset?: Nullable<number>;
    search?: Nullable<string>;
  }): Promise<{ meta: MailThreadMeta; threads: MailThreadInfo[] }> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MailingApiRoutes.GET_SECTION_MAIL_THREAD_INFO, { type }),
      {
        params: {
          mailboxId,
          limit: THREAD_LIMIT,
          offset,
          search,
        },
      }
    );

    const { meta, threads } = response.data as MailThreadResult;

    return { meta, threads: MailThreadInfo.fromDtos(threads) };
  };

  getMailboxMailThreadInfos = async ({
    mailboxId,
    folderId,
    offset = null,
    search = null,
  }: {
    mailboxId: number;
    folderId: Nullable<number>;
    offset?: Nullable<number>;
    search?: Nullable<string>;
  }): Promise<{ meta: MailThreadMeta; threads: MailThreadInfo[] }> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MailingApiRoutes.GET_MAILBOX_MAIL_THREAD_INFO, { mailboxId }),
      {
        params: {
          folderId,
          limit: THREAD_LIMIT,
          offset,
          search,
        },
      }
    );

    const { meta, threads } = response.data as MailThreadResult;

    return { meta, threads: MailThreadInfo.fromDtos(threads) };
  };

  spamThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<boolean> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.SPAM_THREAD, { mailboxId, messageId })
    );

    return response.data;
  };

  unspamThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<boolean> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.UNSPAM_THREAD, { mailboxId, messageId })
    );

    return response.data;
  };

  trashThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<boolean> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.TRASH_THREAD, { mailboxId, messageId })
    );

    return response.data;
  };

  untrashThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<boolean> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.UNTRASH_THREAD, { mailboxId, messageId })
    );

    return response.data;
  };

  seenThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<void> => {
    await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.SEEN_THREAD, { mailboxId, messageId })
    );
  };

  unseenThread = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<void> => {
    await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.UNSEEN_THREAD, { mailboxId, messageId })
    );
  };
}

export const mailboxApi = new MailboxApi();
