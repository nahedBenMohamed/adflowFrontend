import { envUtil, SiteFormResult } from '@/shared';
import axios from 'axios';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import type { SendContactUsFormDto, SiteFormDataDto, SiteFormResultDto } from '../dtos';

class FormApi {
  sendContactUsForm = async (dto: SendContactUsFormDto): Promise<void> => {
    await baseApi.post(ApiRoutes.SEND_CONTACT_US_FORM, dto);
  };

  sendRequestSetupHeadlessForm = async (dto: SiteFormDataDto): Promise<SiteFormResultDto> => {
    const response = await axios.post<SiteFormResultDto>(envUtil.requestSetupHeadlessFormUrl, dto);

    return SiteFormResult.fromDto(response.data);
  };

  sendBpmnRequestForm = async (dto: SiteFormDataDto): Promise<SiteFormResultDto> => {
    const response = await axios.post<SiteFormResultDto>(
      envUtil.submitRequestBpmnWorkspaceFormUrl,
      dto
    );

    return SiteFormResult.fromDto(response.data);
  };

  sendAdditionalStorageRequestForm = async (dto: SiteFormDataDto): Promise<SiteFormResultDto> => {
    const response = await axios.post<SiteFormResultDto>(
      envUtil.submitRequestAdditionalStorageWorkspaceFormUrl,
      dto
    );

    return SiteFormResult.fromDto(response.data);
  };

  // This is is a new headless mywork form that is used to generate invoice
  sendMyworkInvoiceForm = async (dto: SiteFormDataDto): Promise<SiteFormResultDto> => {
    const response = await axios.post<SiteFormResultDto>(
      envUtil.submitRequestMyworkInvoiceWorkspaceFormUrl,
      dto
    );

    return SiteFormResult.fromDto(response.data);
  };
}

export const formApi = new FormApi();
