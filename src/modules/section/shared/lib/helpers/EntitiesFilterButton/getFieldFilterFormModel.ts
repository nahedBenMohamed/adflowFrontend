import type { Field } from '@/modules/fields';
import {
  BooleanFilterFormData,
  DateFilterFormData,
  ExistsFilterFormData,
  FieldType,
  NumberFilterFormData,
  SelectFilterFormData,
  StringFilterFormData,
  type BooleanFilter,
  type DateFilter,
  type ExistsFilter,
  type NumberFilter,
  type Optional,
  type SelectFilter,
  type StringFilter,
} from '@/shared';
import type { FieldFilterFormModel } from '../../components';
import type { EntityCardsFilterSettings, EntityFieldFilter } from '../../models';

export const getFieldFilterFormModel = (
  field: Field,
  savedFilterSettings?: EntityCardsFilterSettings
): FieldFilterFormModel => {
  const getSavedFieldFilterFormModel = (id: number): Optional<EntityFieldFilter> => {
    if (!savedFilterSettings?.filter.fields) return;

    return savedFilterSettings.filter.fields.find(f => f.fieldId === id);
  };

  switch (field.type) {
    case FieldType.VALUE:
    case FieldType.NUMBER:
    case FieldType.FORMULA: {
      const savedForm = getSavedFieldFilterFormModel(field.id);
      const savedFormValue = savedForm ? (savedForm.filter as NumberFilter) : undefined;

      return {
        field,
        state: 'unchanged',
        filterFormType: 'number',
        filterForm: savedFormValue
          ? NumberFilterFormData.fromModel(savedFormValue)
          : NumberFilterFormData.empty(),
      };
    }

    case FieldType.DATE: {
      const savedForm = getSavedFieldFilterFormModel(field.id);
      const savedFormValue = savedForm ? (savedForm.filter as DateFilter) : undefined;

      return {
        field,
        state: 'unchanged',
        filterFormType: 'date',
        filterForm: savedFormValue
          ? DateFilterFormData.fromModel(savedFormValue)
          : DateFilterFormData.empty(),
      };
    }

    case FieldType.SWITCH: {
      const savedForm = getSavedFieldFilterFormModel(field.id);
      const savedFormValue = savedForm ? (savedForm.filter as BooleanFilter) : undefined;

      return {
        field,
        state: 'unchanged',
        filterFormType: 'boolean',
        filterForm: savedFormValue
          ? BooleanFilterFormData.fromModel(savedFormValue)
          : BooleanFilterFormData.empty(),
      };
    }

    case FieldType.SELECT:
    case FieldType.MULTISELECT:
    case FieldType.COLORED_SELECT:
    case FieldType.COLORED_MULTISELECT:
    case FieldType.CHECKED_MULTISELECT:
    case FieldType.PARTICIPANT:
    case FieldType.PARTICIPANTS: {
      const savedForm = getSavedFieldFilterFormModel(field.id);
      const savedFormValue = savedForm ? (savedForm.filter as SelectFilter) : undefined;

      return {
        field,
        filterFormType: 'select',
        state: 'unchanged',
        filterForm: savedFormValue
          ? SelectFilterFormData.fromModel(savedFormValue)
          : SelectFilterFormData.empty(),
      };
    }

    case FieldType.TEXT:
    case FieldType.LINK:
    case FieldType.PHONE:
    case FieldType.EMAIL:
    case FieldType.RICHTEXT:
    case FieldType.CHECKLIST:
    case FieldType.MULTITEXT: {
      const savedForm = getSavedFieldFilterFormModel(field.id);
      const savedFormValue = savedForm ? (savedForm.filter as StringFilter) : undefined;

      return {
        field,
        filterFormType: 'string',
        state: 'unchanged',
        filterForm: savedFormValue
          ? StringFilterFormData.fromModel(savedFormValue)
          : StringFilterFormData.empty(),
      };
    }

    case FieldType.FILE: {
      const savedForm = getSavedFieldFilterFormModel(field.id);
      const savedFormValue = savedForm ? (savedForm.filter as ExistsFilter) : undefined;

      return {
        field,
        filterFormType: 'exists',
        state: 'unchanged',
        filterForm: savedFormValue
          ? ExistsFilterFormData.fromModel(savedFormValue)
          : ExistsFilterFormData.empty(),
      };
    }
  }
};
