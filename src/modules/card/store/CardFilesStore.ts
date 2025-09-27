import { entityApi } from '@/modules/section';
import { FileUtil, type Entity, type FileLink, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';

export class CardFilesStore {
  entity: Nullable<Entity> = null;
  fileLinks: FileLink[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadFiles = async (entity: Entity): Promise<void> => {
    this.entity = entity;

    this.fileLinks = await entityApi.getEntityFiles(entity.id);
  };

  addFiles = async (fileIds: string[]): Promise<void> => {
    if (!this.entity) throw new Error('Failed to add files, entity is not initialized');

    const newFileLinks = await entityApi.addEntityFiles({ entityId: this.entity.id, fileIds });

    this.fileLinks = [...this.fileLinks, ...newFileLinks];
  };

  deleteFileLink = async (id: number): Promise<void> => {
    const fileIdx = this.fileLinks.findIndex(f => f.id === id);

    if (fileIdx === -1) return;

    this.fileLinks.splice(fileIdx, 1);

    await FileUtil.deleteFileLink(id);
  };
}
