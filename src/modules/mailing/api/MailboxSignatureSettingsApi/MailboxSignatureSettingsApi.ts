import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { MailboxSignature } from '../../shared';
import { MailingApiRoutes } from '../MailingApiRoutes';
import type { CreateMailboxSignatureDto, UpdateMailboxSignatureDto } from '../dtos';

type NewType = MailboxSignature;

class MailboxSignatureSettingsApi {
  getSignatures = async (): Promise<NewType[]> => {
    const response = await baseApi.get(MailingApiRoutes.GET_SIGNATURES);

    return MailboxSignature.fromDtos(response.data);
  };

  addSignature = async (dto: CreateMailboxSignatureDto): Promise<MailboxSignature> => {
    const response = await baseApi.post(MailingApiRoutes.ADD_SIGNATURE, dto);

    return MailboxSignature.fromDto(response.data);
  };

  updateSignature = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSignatureDto;
  }): Promise<MailboxSignature> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(MailingApiRoutes.UPDATE_SIGNATURE, { id }),
      dto
    );

    return MailboxSignature.fromDto(response.data);
  };

  deleteSignature = async (id: number): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(MailingApiRoutes.DELETE_SIGNATURE, { id }));
  };
}

export const mailboxSignatureSettingsApi = new MailboxSignatureSettingsApi();
