import { userStore } from '@/app';
import {
  DialogModalSecondary,
  FieldFormat,
  FieldType,
  InputModel,
  MyIndicator,
  MyRadio,
  MySelect,
  MyTooltip,
  SelectModel,
  SpanWithEllipsis,
  StagesSelect,
  UsersMultiselect,
  type Nullable,
  type Option,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useCardFieldHelperContext } from '../../../../../../context';
import type { FieldSettingsForm } from '../../../../../../store';
import { TuneFieldIcon } from '../../../../../assets';
import type { Field } from '../../../../models';
import { FieldSettingsGroup, FieldSettingsSubGroup } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 20px 32px;
`;

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.button<{ $active?: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:not(:disabled):hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:not(:disabled):active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  &:disabled {
    opacity: 0.5;
  }

  ${p =>
    p.$active &&
    css`
      & {
        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

interface Props {
  field: Field;
  entityTypeId: Nullable<number>;
  fieldSettingsForm?: FieldSettingsForm;
  updateFieldSettings?: () => Promise<void>;
  clearFieldSettingsForm: () => void;
}

enum FieldStrictness {
  ORDINARY = 'ordinary',
  IMPORTANT = 'important',
  MANDATORY = 'mandatory',
}

const FieldSettingsModal = observer((props: Props) => {
  const { field, entityTypeId, fieldSettingsForm, updateFieldSettings, clearFieldSettingsForm } =
    props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.field_settings_modal',
  });

  const helperContext = useCardFieldHelperContext();
  const isListView = helperContext?.isListView ?? false;

  const { activeUsers } = userStore;

  const getFieldStrictness = useCallback((): FieldStrictness => {
    if (isListView || !fieldSettingsForm) return FieldStrictness.ORDINARY;

    if (fieldSettingsForm.importantStageIds.values.length > 0) return FieldStrictness.IMPORTANT;

    if (fieldSettingsForm.requiredStageIds.values.length > 0) return FieldStrictness.MANDATORY;

    return FieldStrictness.ORDINARY;
  }, [isListView, fieldSettingsForm]);

  const fieldStrictnessModel = useLocalObservable(() => InputModel.create(getFieldStrictness()));

  const [saving, setSaving] = useState(false);

  const [modalOpened, { close, open }] = useDisclosure(false);

  const handleClearUnusedSettings = useCallback(
    (strictness: FieldStrictness) => {
      if (!fieldSettingsForm)
        throw new Error('Field settings form is not defined, failed to handleClearUnusedSettings');

      const clearImportantOptions = () => {
        fieldSettingsForm.importantStageIds.clear();
      };

      const clearMandatoryOptions = () => {
        fieldSettingsForm.requiredStageIds.clear();
        fieldSettingsForm.excludeUserIds.clear();
      };

      switch (strictness) {
        case FieldStrictness.IMPORTANT: {
          clearMandatoryOptions();

          break;
        }

        case FieldStrictness.MANDATORY: {
          clearImportantOptions();

          break;
        }

        case FieldStrictness.ORDINARY: {
          clearImportantOptions();
          clearMandatoryOptions();
        }
      }
    },
    [fieldSettingsForm]
  );

  const handleCloseAndClearForm = useCallback(() => {
    close();

    clearFieldSettingsForm();
    fieldStrictnessModel.setValue(getFieldStrictness());
  }, [fieldStrictnessModel, close, clearFieldSettingsForm, getFieldStrictness]);

  const handleStrictnessRadioChange = useCallback(
    (value: string) => handleClearUnusedSettings(value as FieldStrictness),
    [handleClearUnusedSettings]
  );

  const handleStrictnessControlledChange = useCallback(
    (strictness: FieldStrictness) => {
      fieldStrictnessModel.setValue(strictness);

      handleClearUnusedSettings(strictness);
    },
    [fieldStrictnessModel, handleClearUnusedSettings]
  );

  const handleSave = useCallback(async (): Promise<void> => {
    if (!fieldSettingsForm || !updateFieldSettings)
      throw new Error('Field settings form is not defined, failed to handleSave');

    try {
      setSaving(true);

      handleClearUnusedSettings(fieldStrictnessModel.value as FieldStrictness);
      await updateFieldSettings();

      close();
    } catch (e) {
      throw new Error(`Failed to save field settings for field ${fieldSettingsForm.fieldId}: ${e}`);
    } finally {
      setSaving(false);
    }
  }, [
    fieldSettingsForm,
    fieldStrictnessModel.value,
    close,
    updateFieldSettings,
    handleClearUnusedSettings,
  ]);

  const isFormula = field.type === FieldType.FORMULA;

  const hasFormatSettings = useMemo<boolean>(
    () => [FieldType.NUMBER, FieldType.VALUE, FieldType.FORMULA].includes(field.type),
    [field.type]
  );

  const handleGetDefaultFormat = useCallback((): Optional<FieldFormat> => {
    const format = field.format;

    if (format) return format;

    if (field.type === FieldType.VALUE) return FieldFormat.CURRENCY;

    if (field.type === FieldType.NUMBER || field.type === FieldType.FORMULA)
      return FieldFormat.NUMBER;

    return;
  }, [field.type, field.format]);

  const fieldFormatModel = useLocalObservable<SelectModel>(() =>
    SelectModel.create(handleGetDefaultFormat())
  );

  const fieldFormatOptions = useMemo<Option<FieldFormat>[]>(
    () => [
      {
        label: t(FieldFormat.NUMBER),
        value: FieldFormat.NUMBER,
      },
      {
        label: t(FieldFormat.CURRENCY),
        value: FieldFormat.CURRENCY,
      },
    ],
    [t]
  );

  if (!fieldSettingsForm || !entityTypeId || !updateFieldSettings)
    return (
      <MyTooltip withinPortal label={t('save_first')}>
        <IconWrapper disabled onClick={open}>
          <TuneFieldIcon />
        </IconWrapper>
      </MyTooltip>
    );

  return (
    <>
      <MyIndicator
        size={10}
        withBorder
        offset={2}
        disabled={!fieldSettingsForm.someSettingsApplied()}
      >
        <IconWrapper $active={modalOpened} onClick={open}>
          <TuneFieldIcon />
        </IconWrapper>
      </MyIndicator>

      {modalOpened && (
        <DialogModalSecondary
          width="536px"
          loading={saving}
          isOpened={modalOpened}
          approveDisabled={saving}
          Header={t('customize', { fieldName: field.name })}
          maxHeight={isListView || isFormula ? '440px' : '720px'}
          onApprove={handleSave}
          onClose={handleCloseAndClearForm}
          onCancel={handleCloseAndClearForm}
        >
          <Root>
            {hasFormatSettings && (
              <FieldSettingsGroup label={t('format_title')}>
                <MySelect
                  withinPortal
                  model={fieldFormatModel}
                  options={fieldFormatOptions}
                  variant="outlined-without-active-shadow"
                  handleChange={field.changeFormat}
                />
              </FieldSettingsGroup>
            )}

            {!isFormula && (
              <FieldSettingsGroup
                dull={fieldStrictnessModel.value !== FieldStrictness.ORDINARY}
                label={
                  <RadioWrapper>
                    <MyRadio
                      model={fieldStrictnessModel}
                      value={FieldStrictness.ORDINARY}
                      handleChange={handleStrictnessRadioChange}
                    />

                    <SpanWithEllipsis text={t('ordinary_field')} />
                  </RadioWrapper>
                }
              />
            )}

            {!isListView && !isFormula && (
              <>
                <FieldSettingsGroup
                  labelHint={t('important_field_hint')}
                  dull={fieldStrictnessModel.value !== FieldStrictness.IMPORTANT}
                  label={
                    <RadioWrapper>
                      <MyRadio
                        model={fieldStrictnessModel}
                        value={FieldStrictness.IMPORTANT}
                        handleChange={handleStrictnessRadioChange}
                      />

                      <SpanWithEllipsis text={t('important_field')} />
                    </RadioWrapper>
                  }
                >
                  <FieldSettingsSubGroup label={t('select_pipeline_and_statuses')}>
                    <StagesSelect
                      withinPortal
                      stageCascade
                      excludeLostFromCascade
                      entityTypeId={entityTypeId}
                      variant="outlined-without-active-shadow"
                      model={fieldSettingsForm.importantStageIds}
                      handleChange={() =>
                        handleStrictnessControlledChange(FieldStrictness.IMPORTANT)
                      }
                    />
                  </FieldSettingsSubGroup>
                </FieldSettingsGroup>

                <FieldSettingsGroup
                  labelHint={t('mandatory_field_hint')}
                  dull={fieldStrictnessModel.value !== FieldStrictness.MANDATORY}
                  label={
                    <RadioWrapper>
                      <MyRadio
                        model={fieldStrictnessModel}
                        value={FieldStrictness.MANDATORY}
                        handleChange={handleStrictnessRadioChange}
                      />

                      <SpanWithEllipsis text={t('mandatory_field')} />
                    </RadioWrapper>
                  }
                >
                  <FieldSettingsSubGroup label={t('select_pipeline_and_statuses')}>
                    <StagesSelect
                      withinPortal
                      stageCascade
                      excludeLostFromCascade
                      entityTypeId={entityTypeId}
                      variant="outlined-without-active-shadow"
                      model={fieldSettingsForm.requiredStageIds}
                      handleChange={() =>
                        handleStrictnessControlledChange(FieldStrictness.MANDATORY)
                      }
                    />
                  </FieldSettingsSubGroup>

                  <FieldSettingsSubGroup
                    label={t('user_exclusion')}
                    labelHint={t('user_exclusion_hint')}
                  >
                    <UsersMultiselect
                      withinPortal
                      users={activeUsers}
                      variant="outlined-without-active-shadow"
                      model={fieldSettingsForm.excludeUserIds}
                      handleChange={() =>
                        handleStrictnessControlledChange(FieldStrictness.MANDATORY)
                      }
                    />
                  </FieldSettingsSubGroup>
                </FieldSettingsGroup>
              </>
            )}

            {!isFormula && (
              <FieldSettingsGroup
                label={t('editing_restriction')}
                labelHint={t('editing_restriction_hint')}
              >
                <FieldSettingsSubGroup label={t('select_users')}>
                  <UsersMultiselect
                    withinPortal
                    users={activeUsers}
                    variant="outlined-without-active-shadow"
                    model={fieldSettingsForm.readonlyUserIds}
                  />
                </FieldSettingsSubGroup>
              </FieldSettingsGroup>
            )}

            <FieldSettingsGroup label={t('hide_field')} labelHint={t('hide_field_hint')}>
              <FieldSettingsSubGroup label={t('select_users')}>
                <UsersMultiselect
                  withinPortal
                  users={activeUsers}
                  model={fieldSettingsForm.hideUserIds}
                  variant="outlined-without-active-shadow"
                />
              </FieldSettingsSubGroup>
            </FieldSettingsGroup>

            {!isListView && (
              <FieldSettingsGroup
                label={t('field_visibility_in_pipeline')}
                labelHint={t('field_visibility_in_pipeline_hint')}
              >
                <FieldSettingsSubGroup label={t('select_pipeline_and_statuses')}>
                  <StagesSelect
                    withinPortal
                    entityTypeId={entityTypeId}
                    model={fieldSettingsForm.hideStageIds}
                    variant="outlined-without-active-shadow"
                  />
                </FieldSettingsSubGroup>
              </FieldSettingsGroup>
            )}
          </Root>
        </DialogModalSecondary>
      )}
    </>
  );
});

FieldSettingsModal.displayName = 'FieldSettingsModal';
export { FieldSettingsModal };
