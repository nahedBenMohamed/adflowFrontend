import { baseApi } from '@/app';
import {
  CheckEntityDocumentResult,
  type CheckDocumentDto,
  type CreateDocumentDto,
  type DocumentTemplateInfo,
} from '@/modules/settings';
import { FileLink, UrlTemplateUtil } from '@/shared';
import { CardApiRoutes } from '../../CardApiRoutes';

class EntityDocumentApi {
  getEntityDocuments = async (id: number): Promise<FileLink[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(CardApiRoutes.GET_ENTITY_DOCUMENTS, { id })
    );

    return FileLink.fromDtos(response.data);
  };

  checkEntityDocumentsTemplate = async (
    dto: CheckDocumentDto
  ): Promise<CheckEntityDocumentResult> => {
    const response = await baseApi.get(CardApiRoutes.CHECK_ENTITY_DOCUMENT_TEMPLATE, {
      params: dto,
    });

    return CheckEntityDocumentResult.fromDto(response.data);
  };

  createEntityDocuments = async (dto: CreateDocumentDto): Promise<FileLink[]> => {
    const response = await baseApi.post(CardApiRoutes.CREATE_ENTITY_DOCUMENT, dto);

    return FileLink.fromDtos(response.data);
  };

  getDocumentTemplatesInfos = async (entityTypeId: number): Promise<DocumentTemplateInfo[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(CardApiRoutes.GET_DOCUMENT_TEMPLATES_INFOS, { entityTypeId })
    );

    return response.data;
  };
}

export const entityDocumentApi = new EntityDocumentApi();
