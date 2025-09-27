import { authStore } from '@/modules/auth';
import {
  DeleteButton,
  DragFieldIcon,
  MyInputWithLimitedLength,
  MySelect,
  MyTooltip,
  ObjectState,
  TruncateMixin,
  type Nullable,
} from '@/shared';
import { FieldType } from '@/shared/lib/models/Field/FieldType';
import { type DraggableProvided } from '@hello-pangea/dnd';
import { Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type KeyboardEventHandler, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getFieldTypes, type Field } from '../../../../..';
import type { FieldSettingsStore } from '../../../../../../store';
import { FieldFormulaSettingsButton } from '../FieldFormulaSettingsButton/FieldFormulaSettingsButton';
import { FieldSettingsModal } from '../FieldSettingsModal/FieldSettingsModal';
import { SelectOptions } from '../SelectOptions/SelectOptions';

const Root = styled.div`
  width: 100%;
  height: 28px;

  display: flex;
  align-items: center;
  gap: 16px;

  // we use margin instead of a gap for a better dnd behavior
  margin-bottom: 20px;

  ${TruncateMixin}
`;

const FieldNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectWrapper = styled.div<{ $hasOptions: boolean }>`
  width: 100%;

  ${TruncateMixin}
`;

const SelectOptionsWrapper = styled.div`
  width: 80px;
  flex-shrink: 0;

  ${TruncateMixin}
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FieldCode = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  color: var(--button-text-graphite-priory-text);

  padding: 4px 8px;
  border: 1px solid var(--graphite-graphite-120);
  border-radius: var(--border-radius-element);
  opacity: 0.8;

  ${TruncateMixin};
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  field: Field;
  isLast: boolean;
  entityTypeId: Nullable<number>;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  disableBudgetOption?: boolean;
  fieldSettingsStore?: FieldSettingsStore;
  onDeleteField: (field: Field) => void;
  onChangeType: ({ field, type }: { field: Field; type: FieldType }) => void;
  handleAddField: () => void;
  updateFieldValue: (value?: Nullable<string>) => void;
  updateFieldSettings?: () => Promise<void>;
}

const MAX_FIELD_NAME_LENGTH = 100;
const COLORFUL_FIELD_TYPES = [FieldType.COLORED_MULTISELECT, FieldType.COLORED_SELECT];
// field type value -> card budget
const WITH_FORMULA_FIELD_TYPES = [FieldType.FORMULA, FieldType.VALUE];

const EditFieldFormGroupComponent = observer((props: Props) => {
  const {
    ref,
    field,
    isLast,
    entityTypeId,
    dragHandleProps,
    disableBudgetOption,
    fieldSettingsStore,
    onDeleteField,
    onChangeType,
    handleAddField,
    updateFieldValue,
    updateFieldSettings,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.field_form_group',
  });

  const { name: fieldName, type: fieldType } = field.form;

  const omittedFieldTypes = useMemo<FieldType[]>(
    () => (disableBudgetOption && field.type !== FieldType.VALUE ? [FieldType.VALUE] : []),
    [disableBudgetOption, field.type]
  );

  const fieldTypes = useMemo(() => getFieldTypes({ t, omittedFieldTypes }), [t, omittedFieldTypes]);
  const currentFieldTypeLabel = useMemo<string>(() => t(fieldType.value), [fieldType, t]);

  const fieldSettingsForm = fieldSettingsStore?.findFieldSettingsFormById(field.id);

  const handleClearFieldSettingsForm = useCallback(() => {
    fieldSettingsStore?.clearFieldSettingsForm(field.id);
  }, [field.id, fieldSettingsStore]);

  const handleChangeName = useCallback((name: string) => field.changeName(name), [field]);

  const handleChangeType = useCallback(
    (type: FieldType) => onChangeType({ field, type }),
    [field, onChangeType]
  );

  const handleDeleteField = useCallback(() => onDeleteField(field), [field, onDeleteField]);

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key === 'Enter' && isLast) {
        e.preventDefault();

        handleAddField();
      }
    },
    [isLast, handleAddField]
  );

  const hasOptions = field.hasOptions();
  const isFieldCreated = field.isCreated();

  return (
    <Root ref={ref}>
      <FieldNameWrapper>
        <IconWrapper {...dragHandleProps}>
          <DragFieldIcon />
        </IconWrapper>

        <MyInputWithLimitedLength
          width="220px"
          model={fieldName}
          variant="outlined"
          hasPaddingBottom={false}
          placeholder={t('field_name')}
          maxLength={MAX_FIELD_NAME_LENGTH}
          hint={t('max_length', { length: MAX_FIELD_NAME_LENGTH })}
          autoFocus={field.state === ObjectState.CREATED}
          onKeyDown={handleKeyDown}
          handleChange={handleChangeName}
        />
      </FieldNameWrapper>

      {field.isAnalyticsField ? (
        <MyTooltip withinPortal label={t('analytics_field')}>
          <FieldCode>{field.code}</FieldCode>
        </MyTooltip>
      ) : (
        <>
          <MyTooltip withinPortal disabled={isFieldCreated} label={currentFieldTypeLabel}>
            <SelectWrapper $hasOptions={hasOptions}>
              <MySelect
                withinPortal
                titleMinWidth={0}
                model={fieldType}
                variant="outlined"
                options={fieldTypes}
                hideArrowWhenDisabled
                dropdownMinWidth="280px"
                disabled={!isFieldCreated || field.isAnalyticsField || field.isRequisitesField}
                handleChange={handleChangeType}
              />
            </SelectWrapper>
          </MyTooltip>

          {hasOptions && (
            <SelectOptionsWrapper>
              <SelectOptions
                options={field.options}
                colorful={COLORFUL_FIELD_TYPES.includes(field.type)}
                handleChange={field.changeOptions}
              />
            </SelectOptionsWrapper>
          )}
        </>
      )}

      <ControlsWrapper>
        <Tooltip.Group>
          {WITH_FORMULA_FIELD_TYPES.includes(field.type) && (
            <FieldFormulaSettingsButton
              fieldId={field.id}
              fieldType={field.type}
              fieldName={field.name}
              entityTypeId={entityTypeId}
              formula={field.value ?? null}
              updateFormula={updateFieldValue}
            />
          )}

          {authStore.isAdmin() && (
            <FieldSettingsModal
              field={field}
              entityTypeId={entityTypeId}
              fieldSettingsForm={fieldSettingsForm}
              updateFieldSettings={updateFieldSettings}
              clearFieldSettingsForm={handleClearFieldSettingsForm}
            />
          )}
        </Tooltip.Group>

        <DeleteButton onClick={handleDeleteField} />
      </ControlsWrapper>
    </Root>
  );
});

export { EditFieldFormGroupComponent };
