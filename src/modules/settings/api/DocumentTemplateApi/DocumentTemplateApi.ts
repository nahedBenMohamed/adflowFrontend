import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { SettingsApiRoutes } from '../SettingsApiRoutes';
import type {
  CreateDocumentTemplateDto,
  DocumentTemplateDto,
  UpdateDocumentTemplateDto,
} from '../dtos';

class DocumentTemplateApi {
  getDocumentTemplate = async (id: string): Promise<DocumentTemplateDto> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SettingsApiRoutes.GET_DOCUMENT_TEMPLATE, { id })
    );

    return response.data;
  };

  getDocumentTemplates = async (): Promise<DocumentTemplateDto[]> => {
    const response = await baseApi.get(SettingsApiRoutes.GET_DOCUMENT_TEMPLATES);

    return response.data;
  };

  addDocumentTemplate = async (dto: CreateDocumentTemplateDto): Promise<DocumentTemplateDto> => {
    const response = await baseApi.post(SettingsApiRoutes.ADD_DOCUMENT_TEMPLATE, dto);

    return response.data;
  };

  updateDocumentTemplate = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateDocumentTemplateDto;
  }): Promise<DocumentTemplateDto> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(SettingsApiRoutes.UPDATE_DOCUMENT_TEMPLATE, { id }),
      dto
    );

    return response.data;
  };

  deleteDocumentTemplate = async (id: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(SettingsApiRoutes.DELETE_DOCUMENT_TEMPLATE, { id })
    );
  };
}

export const documentTemplateApi = new DocumentTemplateApi();
