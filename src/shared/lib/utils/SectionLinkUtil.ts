import { entityTypeStore, routes } from '@/app';
import { lastSectionService } from '../services';

export class SectionLinkUtil {
  static getSectionLink(entityTypeId: number): string {
    const et = entityTypeStore.getById(entityTypeId);

    const sectionParams = lastSectionService.getLastSectionParams(entityTypeId);

    if (!sectionParams) return routes.section({ entityType: et, firstBoardId: undefined });

    if (sectionParams.boardId)
      return routes.entitiesSection({
        entityTypeId,
        boardId: sectionParams.boardId,
        tab: sectionParams.view,
      });

    return routes.section({ entityType: et, firstBoardId: undefined });
  }
}
