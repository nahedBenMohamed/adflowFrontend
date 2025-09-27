import { makeAutoObservable } from 'mobx';
import {
  documentTemplateApi,
  type CreateDocumentTemplateDto,
  type DocumentTemplateDto,
  type UpdateDocumentTemplateDto,
} from '../api';

export class DocumentTemplateStore {
  documentTemplates: DocumentTemplateDto[] = [];

  areLoaded = false;
  isAdding = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    try {
      this.areLoaded = false;
      this.documentTemplates = await documentTemplateApi.getDocumentTemplates();
    } catch (e) {
      throw new Error(`Error while loading document templates: ${e}`);
    } finally {
      this.areLoaded = true;
    }
  };

  addDocumentTemplate = async (dto: CreateDocumentTemplateDto): Promise<void> => {
    try {
      this.isAdding = true;
      const addedDocument = await documentTemplateApi.addDocumentTemplate(dto);

      this.documentTemplates.push(addedDocument);
    } catch (e) {
      throw new Error(`Error while adding document template ${dto.name}: ${e}`);
    } finally {
      this.isAdding = false;
    }
  };

  updateDocumentTemplate = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateDocumentTemplateDto;
  }): Promise<void> => {
    try {
      const updatedDocument = await documentTemplateApi.updateDocumentTemplate({ id, dto });

      const idx = this.documentTemplates.findIndex(x => x.id === updatedDocument.id);

      this.documentTemplates.splice(idx, 1, updatedDocument);
    } catch (e) {
      throw new Error(`Error while updating document template ${id}: ${e}`);
    }
  };

  deleteDocumentTemplate = async (id: number): Promise<void> => {
    try {
      documentTemplateApi.deleteDocumentTemplate(id);

      const deletedTemplateIdx = this.documentTemplates.findIndex(x => x.id === +id);
      this.documentTemplates.splice(deletedTemplateIdx, 1);
    } catch (e) {
      throw new Error(`Error while deleting document template ${id}: ${e}`);
    }
  };
}
