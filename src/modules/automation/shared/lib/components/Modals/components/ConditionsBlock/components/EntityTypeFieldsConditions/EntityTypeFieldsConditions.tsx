import type { Option } from '@/shared';
import {
  BooleanFilterFormData,
  DateFilterFormData,
  DeleteButton,
  FieldType,
  MySelect,
  NumberFilterFormData,
  SelectFilterFormData,
  SimpleFilterType,
  SpanWithEllipsis,
  StringFilterFormData,
  type EntityType,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { EntityTypeFieldConditionFormData } from '../../../../../../models';
import { EntityTypeFieldsConditionsSwitch } from '../EntityTypeFieldsConditionsSwitch/EntityTypeFieldsConditionsSwitch';

const FieldBlock = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;

  padding: 16px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);
`;

const FieldName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IndexTag = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
  color: var(--primary-statuses-white-0);

  border-radius: 50%;
  background-color: var(--primary-statuses-green-520);
`;

interface Props {
  entityType: EntityType;
  fieldsFormData: EntityTypeFieldConditionFormData[];
  deleteFieldsFormData: (formDataId: number) => void;
}

const EntityTypeFieldsConditions = observer((props: Props) => {
  const { entityType, fieldsFormData, deleteFieldsFormData } = props;

  const { t: t1 } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });
  const { t: t2 } = useTranslation('module.fields', {
    keyPrefix: 'fields',
  });

  const fieldsOptions = useMemo<Option<number>[]>(
    () =>
      entityType.fields.map<Option<number>>(f => ({
        value: f.id,
        // Some fields, like project fields, are translated by code
        label: f.code && f.isProjectField ? t2(`project_fields_block.${f.code}`) : f.name,
      })),
    [entityType.fields, t2]
  );

  const handleChangeField = useCallback(
    (fieldId: number) => {
      const fieldFormData = fieldsFormData.find(f => f.fieldId.value === fieldId);

      if (!fieldFormData)
        throw new Error(`Failed to find field form data for field with id ${fieldId}`);

      const field = entityType.getFieldById(fieldId);

      switch (field.type) {
        case FieldType.VALUE:
        case FieldType.NUMBER:
        case FieldType.FORMULA: {
          fieldFormData.type = SimpleFilterType.NUMBER;
          fieldFormData.filterFormData = NumberFilterFormData.empty();

          break;
        }

        case FieldType.TEXT:
        case FieldType.LINK:
        case FieldType.PHONE:
        case FieldType.EMAIL:
        case FieldType.RICHTEXT:
        case FieldType.CHECKLIST:
        case FieldType.MULTITEXT: {
          fieldFormData.type = SimpleFilterType.STRING;
          fieldFormData.filterFormData = StringFilterFormData.empty();

          break;
        }

        case FieldType.SWITCH: {
          fieldFormData.type = SimpleFilterType.BOOLEAN;
          fieldFormData.filterFormData = BooleanFilterFormData.empty();

          break;
        }

        case FieldType.SELECT:
        case FieldType.MULTISELECT:
        case FieldType.COLORED_SELECT:
        case FieldType.PARTICIPANT:
        case FieldType.PARTICIPANTS:
        case FieldType.CHECKED_MULTISELECT:
        case FieldType.COLORED_MULTISELECT: {
          fieldFormData.type = SimpleFilterType.SELECT;
          fieldFormData.filterFormData = SelectFilterFormData.empty();

          break;
        }

        case FieldType.DATE: {
          fieldFormData.type = SimpleFilterType.DATE;
          fieldFormData.filterFormData = DateFilterFormData.empty();

          break;
        }

        default:
          throw new Error(`Failed to handle field type ${field.type}`);
      }
    },
    [fieldsFormData, entityType]
  );

  const getDeleteFieldsFormDataHandler = useCallback(
    (formDataId: number) => () => deleteFieldsFormData(formDataId),
    [deleteFieldsFormData]
  );

  return fieldsFormData.map((f, idx) => {
    return (
      <FieldBlock key={f.formDataId}>
        <IndexTag>{idx + 1}</IndexTag>

        <FieldName>
          <SpanWithEllipsis text={t1('field')} />

          <SelectWrapper>
            <MySelect
              withinPortal
              width="240px"
              model={f.fieldId}
              variant="outlined"
              options={fieldsOptions}
              handleChange={handleChangeField}
            />

            <DeleteButton onClick={getDeleteFieldsFormDataHandler(f.formDataId)} />
          </SelectWrapper>
        </FieldName>

        {f.fieldId.value > 0 && (
          <EntityTypeFieldsConditionsSwitch entityType={entityType} fieldsFormData={f} />
        )}
      </FieldBlock>
    );
  });
});

EntityTypeFieldsConditions.displayName = 'EntityTypeFieldsConditions';
export { EntityTypeFieldsConditions };
