import type { Field } from '@/modules/fields';
import {
  type BooleanFilterFormData,
  type DateFilterFormData,
  type ExistsFilterFormData,
  FieldType,
  type NumberFilterFormData,
  type PossibleFilterFormData,
  type SelectFilterFormData,
  type StringFilterFormData,
} from '@/shared';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldFilterFormType, FieldFilterModelState } from '../../../../types';
import { FieldFilterBoolean } from '../FieldFilterItems/FieldFilterBoolean';
import { FieldFilterDate } from '../FieldFilterItems/FieldFilterDate';
import { FieldFilterExists } from '../FieldFilterItems/FieldFilterExists';
import { FieldFilterNumber } from '../FieldFilterItems/FieldFilterNumber';
import { FieldFilterParticipants } from '../FieldFilterItems/FieldFilterParticipants';
import { FieldFilterSelect } from '../FieldFilterItems/FieldFilterSelect';
import { FieldFilterString } from '../FieldFilterItems/FieldFilterString';

export interface FieldFilterFormModel {
  field: Field;
  state: FieldFilterModelState;
  filterFormType: FieldFilterFormType;
  filterForm: PossibleFilterFormData;
}

interface Props {
  fieldFilterFormModel: FieldFilterFormModel;
  handleApply: () => void;
}

const FieldsFilterItemSwitch = (props: Props) => {
  const { fieldFilterFormModel, handleApply } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.project_fields_block',
  });

  const changeState = useCallback(
    (state: FieldFilterModelState) => (fieldFilterFormModel.state = state),
    [fieldFilterFormModel]
  );

  switch (fieldFilterFormModel.field.type) {
    case FieldType.VALUE:
    case FieldType.NUMBER:
    case FieldType.FORMULA: {
      const { min, max } = fieldFilterFormModel.filterForm as NumberFilterFormData;
      const name = fieldFilterFormModel.field.code
        ? t(fieldFilterFormModel.field.code)
        : fieldFilterFormModel.field.name;

      return (
        <FieldFilterNumber
          max={max}
          min={min}
          name={name}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.TEXT:
    case FieldType.LINK:
    case FieldType.PHONE:
    case FieldType.EMAIL:
    case FieldType.RICHTEXT:
    case FieldType.CHECKLIST:
    case FieldType.MULTITEXT: {
      const { text, type } = fieldFilterFormModel.filterForm as StringFilterFormData;

      return (
        <FieldFilterString
          text={text}
          type={type}
          name={fieldFilterFormModel.field.name}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.PARTICIPANT:
    case FieldType.PARTICIPANTS: {
      const { optionIds } = fieldFilterFormModel.filterForm as SelectFilterFormData;
      const name = fieldFilterFormModel.field.code
        ? t(fieldFilterFormModel.field.code)
        : fieldFilterFormModel.field.name;

      return (
        <FieldFilterParticipants
          name={name}
          optionIds={optionIds}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.SWITCH: {
      const { value } = fieldFilterFormModel.filterForm as BooleanFilterFormData;

      return (
        <FieldFilterBoolean
          name={fieldFilterFormModel.field.name}
          value={value}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.SELECT:
    case FieldType.MULTISELECT:
    case FieldType.CHECKED_MULTISELECT: {
      const { optionIds } = fieldFilterFormModel.filterForm as SelectFilterFormData;

      return (
        <FieldFilterSelect
          name={fieldFilterFormModel.field.name}
          fieldOptions={fieldFilterFormModel.field.options}
          optionIds={optionIds}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.COLORED_SELECT:
    case FieldType.COLORED_MULTISELECT: {
      const { optionIds } = fieldFilterFormModel.filterForm as SelectFilterFormData;

      return (
        <FieldFilterSelect
          colored
          optionIds={optionIds}
          name={fieldFilterFormModel.field.name}
          fieldOptions={fieldFilterFormModel.field.options}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.DATE: {
      const fieldFilterDateForm = fieldFilterFormModel.filterForm as DateFilterFormData;
      const name = fieldFilterFormModel.field.code
        ? t(fieldFilterFormModel.field.code)
        : fieldFilterFormModel.field.name;

      return (
        <FieldFilterDate
          name={name}
          fieldFilterDateForm={fieldFilterDateForm}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    case FieldType.FILE: {
      const fieldFilterForm = fieldFilterFormModel.filterForm as ExistsFilterFormData;
      const name = fieldFilterFormModel.field.code
        ? t(fieldFilterFormModel.field.code)
        : fieldFilterFormModel.field.name;

      return (
        <FieldFilterExists
          name={name}
          fieldFilterForm={fieldFilterForm}
          changeState={changeState}
          handleApply={handleApply}
        />
      );
    }

    default:
      return null;
  }
};

export { FieldsFilterItemSwitch };
