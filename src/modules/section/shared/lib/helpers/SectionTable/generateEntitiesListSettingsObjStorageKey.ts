import type { Nullable } from '@/shared';

export const generateEntitiesListSettingsObjStorageKey = ({
  entityTypeId,
  boardId = null,
}: {
  entityTypeId: number;
  boardId: Nullable<number>;
}): string => {
  const mainKey = 'EntitiesListSettings';

  if (boardId) return `${mainKey}_${entityTypeId}_${boardId}`;

  return `${mainKey}_${entityTypeId}`;
};
