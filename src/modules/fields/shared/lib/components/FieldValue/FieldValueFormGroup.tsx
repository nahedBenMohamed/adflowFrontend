import { authStore } from '@/modules/auth';
import {
  MediaBreakpoints,
  TruncateMixin,
  type DadataBankRequisitesSuggestion,
  type DadataOrgRequisitesSuggestion,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useCardFieldHelperContext } from '../../../../context';
import type { FieldSettingsStore } from '../../../../store';
import type { Field } from '../../models';
import type { PossibleFieldValue } from '../../types';
import { FieldValueSwitch } from './FieldValueSwitch';

export const FieldValueFormGroupRoot = styled.div<{ $mobileColumn?: boolean }>`
  min-height: var(--field-component-height);

  display: flex;
  gap: 16px;

  ${p =>
    p.$mobileColumn &&
    css`
      @media ${MediaBreakpoints.SM} {
        flex-direction: column;
        gap: 6px;
      }
    `}
`;

export const FieldLabel = styled.div`
  width: 160px;
  min-height: var(--field-component-height);

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  word-break: break-word;
  overflow: hidden;
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  // to prevent typescript-styled-plugin due to its inability to understand text-wrap property
  ${`text-wrap: balance;`}

  // to align with field component
  padding-top: 6px;

  span {
    color: var(--button-text-graphite-secondary-text);
  }
`;

export const FieldCompWrapper = styled.div<{ $padding?: CSSProperties['padding'] }>`
  position: relative;

  min-height: var(--field-component-height);

  flex: 1;

  ${p => p.$padding && `padding: ${p.$padding}`};

  ${TruncateMixin}
`;

interface Props {
  field: Field;
  fieldValue: PossibleFieldValue;
  disabled?: boolean;
  mobileColumn?: boolean;
  hideEmailAction?: boolean;
  fieldSettingsStore?: FieldSettingsStore;
  onSelectBankRequisitesSuggestion?: (suggestion: DadataBankRequisitesSuggestion) => void;
  onSelectOrgRequisitesSuggestion?: (suggestion: DadataOrgRequisitesSuggestion) => void;
}

const FieldValueFormGroup = observer((props: Props) => {
  const {
    field,
    fieldValue,
    fieldSettingsStore,
    disabled,
    mobileColumn,
    hideEmailAction,
    onSelectBankRequisitesSuggestion,
    onSelectOrgRequisitesSuggestion,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields',
  });

  const helperContext = useCardFieldHelperContext();

  const isFieldHidden = useCallback(
    (fieldId: number): boolean => {
      const { user: currentUser } = authStore;

      if (!currentUser)
        throw new Error(
          'User is not defined, failed to calculate isFieldHidden in FieldValueFormGroup'
        );

      const fieldSettings = fieldSettingsStore?.findFieldSettingsById(fieldId);

      if (!fieldSettings) return false;

      return Boolean(
        fieldSettings?.hideField(currentUser.id) ||
          (helperContext?.stageId && fieldSettings?.hideFieldOnStage(helperContext.stageId))
      );
    },
    [helperContext?.stageId, fieldSettingsStore]
  );

  return isFieldHidden(field.id) ? null : (
    <FieldValueFormGroupRoot
      title={disabled ? t('field_value.readonly') : undefined}
      $mobileColumn={mobileColumn}
    >
      {/* Some fields, like project fields, are translated by code */}
      <FieldLabel title={field.name}>
        {field.code && field.isProjectField ? t(`project_fields_block.${field.code}`) : field.name}

        {field.isAnalyticsField && field.name !== field.code && <span>{` (${field.code})`}</span>}
      </FieldLabel>

      <FieldCompWrapper>
        <FieldValueSwitch
          field={field}
          readonly={disabled}
          fieldValue={fieldValue}
          hideEmailAction={hideEmailAction}
          rightIndicatorOnMobile={mobileColumn}
          fieldSettingsStore={fieldSettingsStore}
          onSelectBankRequisitesSuggestion={onSelectBankRequisitesSuggestion}
          onSelectOrgRequisitesSuggestion={onSelectOrgRequisitesSuggestion}
        />
      </FieldCompWrapper>
    </FieldValueFormGroupRoot>
  );
});

FieldValueFormGroup.displayName = 'FieldValueFormGroup';
export { FieldValueFormGroup };
