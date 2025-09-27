import type { Field, FieldSettings, PossibleFieldValue } from '@/modules/fields';
import type { Nullable } from '@/shared';
import { useMemo } from 'react';
import { generateFieldColumnId } from '../../helpers';
import type { EntityListItem, SectionTableRow } from '../../models';

export const useGetSectionTableData = ({
  fields,
  entities,
  fieldSettings,
}: {
  fields: Field[];
  entities: EntityListItem[];
  fieldSettings?: FieldSettings[];
}): SectionTableRow[] =>
  useMemo<SectionTableRow[]>(() => {
    if (!fieldSettings) return [];

    return entities.map<SectionTableRow>(e => ({
      name: e.name,
      entityId: e.id,
      stageId: e.stageId,
      focused: e.focused,
      copiedFrom: e.copiedFrom,
      copiedCount: e.copiedCount,
      readonly: !e.userRights.canEdit,
      responsibleUserId: e.responsibleUserId,
      // if field value is null – it is not visible due to field settings
      fields: fields.reduce<Record<string, Nullable<PossibleFieldValue>>>((acc, f) => {
        const stageId = e.stageId;

        if (
          stageId &&
          fieldSettings.find(fs => fs.fieldId === f.id && fs.hideFieldOnStage(stageId))
        ) {
          acc[generateFieldColumnId(f.id)] = null;
        } else {
          acc[generateFieldColumnId(f.id)] = e.getOrCreateByField(f);
        }

        return acc;
      }, {}),
    }));
  }, [fields, entities, fieldSettings]);
