import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { SectionApiRoutes } from '../SectionApiRoutes';

class EntitiesImportApi {
  importEntities = async ({
    entityTypeId,
    file,
  }: {
    entityTypeId: number;
    file: File;
  }): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file, encodeURIComponent(file.name));

    await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.ADD_IMPORT_ENTITIES, {
        entityTypeId,
      }),
      formData
    );
  };
}

export const entitiesImportApi = new EntitiesImportApi();
