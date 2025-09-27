import {
  DocumentType,
  type CheckDocumentDto,
  type CheckEntityDocumentResult,
  type CreateDocumentDto,
  type DocumentTemplateInfo,
} from '@/modules/settings';
import { ErrorCode, FileUtil, type FileLink, type Optional, type ServiceError } from '@/shared';
import type { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { entityDocumentApi } from '../api';
import { DocumentTemplateError } from '../shared';

enum SyntheticDelay {
  SHORT = 2000,
  MEDIUM = 4000,
  LONG = 6000,
}

export class CreateDocumentStore {
  documentTemplatesInfos: DocumentTemplateInfo[] = [];
  entityDocuments: FileLink[] = [];

  isCreating = false;
  isTemplateChecking = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadInfos = async (entityTypeId: number): Promise<void> => {
    try {
      this.documentTemplatesInfos = await entityDocumentApi.getDocumentTemplatesInfos(entityTypeId);
    } catch (e) {
      throw new Error(`Error while loading document templates infos: ${e}`);
    }
  };

  loadDocuments = async (entityId: number): Promise<void> => {
    try {
      this.entityDocuments = await entityDocumentApi.getEntityDocuments(entityId);
    } catch (e) {
      throw new Error(`Error while loading entity ${entityId} documents: ${e}`);
    }
  };

  getCreationSyntheticDelay = (types: DocumentType[]): number => {
    if (types.length === 1 && types[0] === DocumentType.DOCX) return SyntheticDelay.SHORT;

    if (types.length === 1 && types[0] === DocumentType.PDF) return SyntheticDelay.MEDIUM;

    if (types.length === 2) return SyntheticDelay.LONG;

    return SyntheticDelay.SHORT;
  };

  checkEntityDocumentsTemplate = async (
    dto: CheckDocumentDto
  ): Promise<CheckEntityDocumentResult> => {
    try {
      this.isTemplateChecking = true;

      return await entityDocumentApi.checkEntityDocumentsTemplate(dto);
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.INVALID_DOCUMENT_TEMPLATE) {
        throw new DocumentTemplateError();
      } else {
        throw new Error(`Error while checking entity ${dto.entityId} document template: ${e}`);
      }
    } finally {
      this.isTemplateChecking = false;
    }
  };

  createEntityDocuments = async ({
    dto,
    reloadFeed,
  }: {
    dto: CreateDocumentDto;
    reloadFeed: () => void;
  }): Promise<void> => {
    const syntheticDelay = this.getCreationSyntheticDelay(dto.types);

    try {
      this.isCreating = true;

      const createdDocuments = await entityDocumentApi.createEntityDocuments(dto);

      setTimeout(() => {
        this.entityDocuments.unshift(...createdDocuments);
      }, syntheticDelay);
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.INVALID_DOCUMENT_TEMPLATE) {
        throw new DocumentTemplateError();
      } else {
        throw new Error(`Error while creating entity ${dto.entityId} document: ${e}`);
      }
    } finally {
      setTimeout(() => {
        this.isCreating = false;

        reloadFeed();
      }, syntheticDelay);
    }
  };

  deleteEntityDocument = async (documentId: number): Promise<void> => {
    const idx = this.entityDocuments.findIndex(d => d.id === documentId);

    if (idx === -1) throw new Error(`Document with id ${documentId} was not found`);

    await FileUtil.deleteFileLink(documentId);

    this.entityDocuments = this.entityDocuments.filter(d => d.id !== documentId);
  };
}
