import { baseApi, type CreateContactAndLeadDto } from '@/app';
import { UrlTemplateUtil, type EntityInfo } from '@/shared';
import { MailMessage } from '../../shared';
import { MailingApiRoutes } from '../MailingApiRoutes';
import type { SendMailMessageDto } from '../dtos';

class MailMessageApi {
  getMailMessage = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<MailMessage> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MailingApiRoutes.GET_MAIL_MESSAGE, { mailboxId, messageId })
    );

    return MailMessage.fromDto(response.data);
  };

  getMailMessages = async ({
    mailboxId,
    messageId,
  }: {
    mailboxId: number;
    messageId: number;
  }): Promise<MailMessage[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MailingApiRoutes.GET_MAIL_MESSAGES, { mailboxId, messageId })
    );

    return MailMessage.fromDtos(response.data);
  };

  sendMailMessage = async ({
    mailboxId,
    dto,
    files,
  }: {
    mailboxId: number;
    dto: SendMailMessageDto;
    files: File[];
  }): Promise<boolean> => {
    const formData = new FormData();

    formData.append('message', JSON.stringify(dto));

    files.forEach(f => {
      formData.append('attachment', f, encodeURIComponent(f.name));
    });

    const response = await baseApi.post(
      UrlTemplateUtil.toPath(MailingApiRoutes.SEND_MESSAGE, { mailboxId }),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
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
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(MailingApiRoutes.MAIL_CREATE_CONTACT, { mailboxId, messageId }),
      dto
    );

    return response.data;
  };
}

export const mailMessageApi = new MailMessageApi();
