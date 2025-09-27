import { FileUtil, UrlTemplateUtil } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { entitiesImportApi } from '../api';
import { SectionApiRoutes } from '../api/SectionApiRoutes';

class EntitiesImportStore {
  isImporting = false;

  constructor() {
    makeAutoObservable(this);
  }

  importEntities = async ({
    entityTypeId,
    file,
  }: {
    entityTypeId: number;
    file: File;
  }): Promise<void> => {
    try {
      this.isImporting = true;

      await entitiesImportApi.importEntities({ entityTypeId, file });
    } catch (e) {
      throw new Error(`Error while importing entities from file ${file.name}: ${e}`);
    } finally {
      this.isImporting = false;
    }
  };

  getImportTemplate = async ({
    entityTypeId,
    entityTypeName,
  }: {
    entityTypeId: number;
    entityTypeName: string;
  }): Promise<void> => {
    await FileUtil.downloadFile({
      url: UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITIES_IMPORT_TEMPLATE, { entityTypeId }),
      fileName: `import-template-${entityTypeName}.xlsx`,
    });
  };
}

export const entitiesImportStore = new EntitiesImportStore();
