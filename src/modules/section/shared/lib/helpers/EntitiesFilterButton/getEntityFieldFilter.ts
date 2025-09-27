import {
  FieldType,
  getProperFromAndToDatesForFilter,
  SimpleFilterType,
  type BooleanFilter,
  type BooleanFilterFormData,
  type DateFilter,
  type DateFilterFormData,
  type ExistsFilter,
  type ExistsFilterFormData,
  type NumberFilter,
  type NumberFilterFormData,
  type SelectFilter,
  type SelectFilterFormData,
  type StringFilter,
  type StringFilterFormData,
} from '@/shared';
import type { FieldFilterFormModel } from '../../components';
import { StringFilterType, type EntityFieldFilter } from '../../models';

export const getEntityFieldFilter = (
  fieldFilterFormModel: FieldFilterFormModel
): EntityFieldFilter => {
  switch (fieldFilterFormModel.filterFormType) {
    case 'boolean': {
      const filterForm = fieldFilterFormModel.filterForm as BooleanFilterFormData;

      const filter: BooleanFilter = {
        value: filterForm.value.value,
      };

      return {
        type: SimpleFilterType.BOOLEAN,
        fieldId: fieldFilterFormModel.field.id,
        filter,
      };
    }

    case 'number': {
      const filterForm = fieldFilterFormModel.filterForm as NumberFilterFormData;

      const filter: NumberFilter = {
        min: filterForm.min.value ? Number(filterForm.min.value) : undefined,
        max: filterForm.max.value ? Number(filterForm.max.value) : undefined,
      };

      return {
        type: SimpleFilterType.NUMBER,
        fieldId: fieldFilterFormModel.field.id,
        filter,
      };
    }

    case 'select': {
      const filterForm = fieldFilterFormModel.filterForm as SelectFilterFormData;

      const filter: SelectFilter = {
        optionIds: filterForm.optionIds.values,
      };

      return {
        type: SimpleFilterType.SELECT,
        fieldId: fieldFilterFormModel.field.id,
        filter,
      };
    }

    case 'string': {
      const filterForm = fieldFilterFormModel.filterForm as StringFilterFormData;

      const typeValue = filterForm.type.value;

      if (typeValue === StringFilterType.CONTAINS) {
        const field = fieldFilterFormModel.field;

        const filter: StringFilter = {
          type: typeValue,
          text:
            // remove all white spaces if field type is phone, we do this because user
            // can enter something like 7 903 789 ... using white spaces for formatting, but
            // actual phones in DB are stored not formatted
            field.type === FieldType.PHONE
              ? (filterForm.text.value ?? '').replace(/\s+/g, '')
              : (filterForm.text.value ?? ''),
        };

        return {
          type: SimpleFilterType.STRING,
          fieldId: field.id,
          filter,
        };
      }

      const filter: StringFilter = {
        type: typeValue ? (typeValue as StringFilterType) : StringFilterType.EMPTY,
      };

      return {
        type: SimpleFilterType.STRING,
        fieldId: fieldFilterFormModel.field.id,
        filter,
      };
    }

    case 'date': {
      const filterForm = fieldFilterFormModel.filterForm as DateFilterFormData;

      const { from, to } = getProperFromAndToDatesForFilter({
        from: filterForm.from,
        to: filterForm.to,
      });

      const filter: DateFilter = {
        // we consider that we do not need to apply local timezone offset to simple date fields
        from: from ? from.formatISOWithoutUnix() : undefined,
        to: to ? to.formatISOWithoutUnix() : undefined,
      };

      return {
        type: SimpleFilterType.DATE,
        fieldId: fieldFilterFormModel.field.id,
        filter,
      };
    }

    case 'exists': {
      const filterForm = fieldFilterFormModel.filterForm as ExistsFilterFormData;

      const typeValue = filterForm.type.value;

      const field = fieldFilterFormModel.field;

      const filter: ExistsFilter = {
        type: typeValue,
      };

      return {
        type: SimpleFilterType.EXISTS,
        fieldId: field.id,
        filter,
      };
    }
  }
};
