import { type SectionView } from '../models';
import { type Nullable } from '../types';
import { storageService } from './StorageService';

interface SectionParams {
  entityTypeId: number;
  boardId: Nullable<number>;
  view: SectionView;
}

const KEY = 'LastSections';

class LastSectionService {
  getLastSectionParams(entityTypeId: number): Nullable<SectionParams> {
    const sections = storageService.get<SectionParams[]>(KEY);

    if (!sections) return null;

    const section = sections.find(s => s.entityTypeId === entityTypeId);

    return section ?? null;
  }

  setLastSectionParams({
    entityTypeId,
    tab,
    boardId,
  }: {
    entityTypeId: number;
    tab: SectionView;
    boardId: Nullable<number>;
  }): void {
    const sections = storageService.get<SectionParams[]>(KEY) ?? [];

    const section: SectionParams = {
      boardId,
      view: tab,
      entityTypeId,
    };

    const idx = sections.findIndex(s => s.entityTypeId === entityTypeId);

    if (idx !== -1) {
      sections.splice(idx, 1, section);
    } else {
      sections.push(section);
    }

    storageService.set(KEY, sections);
  }
}

export const lastSectionService = new LastSectionService();
