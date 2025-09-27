import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { Mailbox, MailboxSettingsManual } from '../../shared';
import { MailingApiRoutes } from '../MailingApiRoutes';
import type { CreateMailboxDto, UpdateMailboxDto, UpdateMailboxSettingsManualDto } from '../dtos';
export interface UpdateMailboxSettingsResult {
  result: boolean;
  state: MailboxSettingsManual | string;
}

class MailboxSettingsApi {
  getMailboxes = async (): Promise<Mailbox[]> => {
    const response = await baseApi.get(MailingApiRoutes.GET_MAILBOXES_SETTINGS);

    return Mailbox.fromDtos(response.data);
  };

  addMailbox = async (dto: CreateMailboxDto): Promise<Mailbox> => {
    const response = await baseApi.post(MailingApiRoutes.ADD_MAILBOX_SETTINGS, dto);

    return Mailbox.fromDto(response.data);
  };

  connectGmailMailbox = async (id: number): Promise<string> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MailingApiRoutes.GMAIL_CONNECT_SETTINGS, { id })
    );

    return response.data;
  };

  deleteMailbox = async ({ id, save }: { id: number; save: boolean }): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(MailingApiRoutes.DELETE_MAILBOX_SETTINGS, { id }), {
      params: {
        save,
      },
    });
  };

  getMailboxSettingsManual = async (id: number): Promise<MailboxSettingsManual> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(MailingApiRoutes.GET_MAILBOX_MANUAL_SETTINGS, { id })
    );

    return MailboxSettingsManual.fromDto(response.data);
  };

  updateMailboxSettingsManual = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSettingsManualDto;
  }): Promise<UpdateMailboxSettingsResult> => {
    const { data } = await baseApi.post(
      UrlTemplateUtil.toPath(MailingApiRoutes.UPDATE_MAILBOX_MANUAL_SETTINGS, { id }),
      dto
    );

    if (data.result) {
      const mailbox: UpdateMailboxSettingsManualDto = data.state;

      return {
        result: data.result,
        state: new MailboxSettingsManual({
          imapServer: mailbox.imapServer,
          imapPort: mailbox.imapPort,
          imapSecure: mailbox.imapSecure,
          smtpServer: mailbox.smtpServer,
          smtpPort: mailbox.smtpPort,
          smtpSecure: mailbox.smtpSecure,
        }),
      };
    } else {
      return { result: data.result, state: data.state };
    }
  };

  updateMailbox = async ({ id, dto }: { id: number; dto: UpdateMailboxDto }): Promise<Mailbox> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.UPDATE_MAILBOX_SETTINGS, { id }),
      dto
    );

    return Mailbox.fromDto(response.data);
  };
}

export const mailboxSettingsApi = new MailboxSettingsApi();
