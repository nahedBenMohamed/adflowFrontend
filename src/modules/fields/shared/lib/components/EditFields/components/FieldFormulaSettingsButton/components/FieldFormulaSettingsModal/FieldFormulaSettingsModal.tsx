import { FieldFormulaCircularDependencyWarningModal } from '@/modules/card';
import {
  DialogModalSecondary,
  FieldType,
  Hint,
  throttle,
  useTransformScroll,
  type Nullable,
} from '@/shared';
import { HideScrollbarMixin } from '@/shared/lib/mixins/HideScrollbar.mixin';
import DOMPurify from 'dompurify';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldFormulaStore } from '../../../../../../../../store';
import { FieldCode, FormulaFieldClasses } from '../../../../../../models';
import type { AppendMathElementHandler } from '../../../../../../types';
import { FieldFormulaSettingsModalKeys } from '../FieldFormulaSettingsModalKeys/FieldFormulaSettingsModalKeys';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 24px;
`;

const WarningAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

const FormulaRendererWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EqualSign = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  font-family: var(--font-family-mono);
  color: var(--button-text-graphite-primary-text);
`;

const FormulaRenderer = styled.div<{ $invalid: boolean }>`
  width: 100%;
  height: 38px;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-family: var(--font-family-mono);
  color: var(--button-text-graphite-primary-text);

  padding: 8px;
  overflow-y: auto;
  white-space: nowrap;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  .${FormulaFieldClasses.OPERATOR} {
    margin: 0 4px;
  }

  .${FormulaFieldClasses.PERCENTAGE} {
    color: var(--primary-statuses-green-520);
  }

  .${FormulaFieldClasses.NUMBER} {
    color: var(--button-text-green-active);
  }

  .${FormulaFieldClasses.PARANTHESIS} {
    color: var(--button-text-blue-active);
  }

  .${FormulaFieldClasses.FIELD} {
    color: var(--button-text-red-active);

    b {
      color: var(--primary-blue);
    }

    i {
      color: var(--button-text-graphite-secondary-text);
    }
  }

  ${p => p.$invalid && `border-color: var(--primary-statuses-red-360)`};

  ${HideScrollbarMixin}
`;

interface Props {
  opened: boolean;
  fieldId: number;
  fieldName: string;
  fieldType: FieldType;
  entityTypeId: number;
  formula: Nullable<string>;
  onClose: () => void;
  updateFormula: (value: Nullable<string>) => void;
}

const FieldFormulaSettingsModal = observer((props: Props) => {
  const { opened, fieldId, fieldName, fieldType, entityTypeId, formula, onClose, updateFormula } =
    props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields',
  });

  const [rendererRef, setRendererRef] = useState<Nullable<HTMLDivElement>>(null);

  const fieldFormulaStore = useMemo(
    () =>
      new FieldFormulaStore({
        fieldId,
        formula,
        entityTypeId,
        // project budget field is translated by code, name is not used in display
        projectBudgetFieldTitle: t(`project_fields_block.${FieldCode.VALUE}`),
      }),
    [fieldId, entityTypeId, formula, t]
  );

  const {
    formulaHTML,
    formulaString,
    isCheckingFormula,
    isFormulaValid,
    fieldFormulaCircularDependencyId,
    fieldFormulaCircularDependencyWarningOpened,
    clearFormula,
    setInitialFormula,
    appendMathElement,
    checkFieldFormula,
    removeLastMathElement,
    hideFieldFormulaCircularDependencyWarning,
  } = fieldFormulaStore;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandleUpdateFormula = useCallback(
    throttle(async (): Promise<void> => {
      // if nothing was changed –> just close the modal
      if (formulaString === formula) {
        onClose();

        return;
      }

      const result = await checkFieldFormula();

      if (!result) return;

      updateFormula(formulaString);

      onClose();
    }, 300),
    [formula, formulaString, updateFormula, onClose, checkFieldFormula]
  );

  const handleScrollRendererToRightEnd = useCallback(() => {
    if (rendererRef)
      setTimeout(() => {
        rendererRef.scrollTo({
          behavior: 'smooth',
          left: rendererRef.scrollWidth,
        });
      });
  }, [rendererRef]);

  const handleAppendMathElement = useCallback<AppendMathElementHandler>(
    ({ type, value }) => {
      appendMathElement({ type, value });

      handleScrollRendererToRightEnd();
    },
    [appendMathElement, handleScrollRendererToRightEnd]
  );

  const handleRemoveLastMathElement = useCallback(() => {
    removeLastMathElement();

    handleScrollRendererToRightEnd();
  }, [removeLastMathElement, handleScrollRendererToRightEnd]);

  const handleCancelChanges = useCallback(() => {
    setInitialFormula(formula);
  }, [formula, setInitialFormula]);

  useTransformScroll(rendererRef);

  return (
    <DialogModalSecondary
      width="760px"
      maxHeight="100%"
      isOpened={opened}
      height="fit-content"
      loading={isCheckingFormula}
      approveDisabled={isCheckingFormula}
      Header={t('components.field_formula_settings_button.customize', { fieldName })}
      onClose={onClose}
      onApprove={throttledHandleUpdateFormula}
    >
      {fieldFormulaCircularDependencyWarningOpened && fieldFormulaCircularDependencyId && (
        <FieldFormulaCircularDependencyWarningModal
          entityTypeId={entityTypeId}
          opened={fieldFormulaCircularDependencyWarningOpened}
          fieldFormulaCircularDependencyId={fieldFormulaCircularDependencyId}
          onCancelChanges={handleCancelChanges}
          onClose={hideFieldFormulaCircularDependencyWarning}
        />
      )}
      <Root>
        {Boolean(formulaHTML || fieldType === FieldType.VALUE) && (
          <WarningAnnotation>{t('formula_warning')}</WarningAnnotation>
        )}

        <FormulaRendererWrapper>
          <EqualSign>{'='}</EqualSign>

          <FormulaRenderer
            ref={setRendererRef}
            $invalid={!isFormulaValid}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(formulaHTML ?? ''),
            }}
          />

          <Hint size="big" text={t('components.field_formula_settings_button.formula_hint')} />
        </FormulaRendererWrapper>

        <FieldFormulaSettingsModalKeys
          fieldId={fieldId}
          entityTypeId={entityTypeId}
          clearFormula={clearFormula}
          appendMathElement={handleAppendMathElement}
          removeLastMathElement={handleRemoveLastMathElement}
        />
      </Root>
    </DialogModalSecondary>
  );
});

FieldFormulaSettingsModal.displayName = 'FieldFormulaSettingsModal';
export { FieldFormulaSettingsModal };
