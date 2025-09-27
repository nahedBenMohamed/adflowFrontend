import { FileUtil, UrlTemplateUtil } from '@/shared';
import { MailingApiRoutes } from '../../../api';

export const downloadFileFromMessage = async ({
  fileName,
  mailboxId,
  messageId,
  payloadId,
}: {
  fileName: string;
  mailboxId: number;
  messageId: number;
  payloadId: number;
}): Promise<void> => {
  const url = UrlTemplateUtil.toPath(MailingApiRoutes.DOWNLOAD_FILE_FROM_MESSAGE, {
    mailboxId,
    messageId,
    payloadId,
  });

  await FileUtil.downloadFile({ url, fileName });
};
