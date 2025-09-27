import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getFormulaFieldKeys } from '../../../../../../helpers';
import {
  FormulaFieldMathElementType,
  FormulaFieldMathElementValue,
  type FormulaKey,
} from '../../../../../../models';
import type { AppendMathElementHandler } from '../../../../../../types';
import { FieldFormulaSettingsModalFields } from '../FieldFormulaSettingsModalFields/FieldFormulaSettingsModalFields';
import { FormulaKeysButtons } from '../FormulaKeysButtons/FormulaKeysButtons';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

interface Props {
  fieldId: number;
  entityTypeId: number;
  appendMathElement: AppendMathElementHandler;
  removeLastMathElement: () => void;
  clearFormula: () => void;
}

const FieldFormulaSettingsModalKeys = (props: Props) => {
  const { fieldId, entityTypeId, appendMathElement, removeLastMathElement, clearFormula } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.field_formula_settings_button',
  });

  const [fieldsTabActive, { toggle: toggleFieldsTab }] = useDisclosure(false);

  const formulaKeys = useMemo<FormulaKey[]>(
    () =>
      getFormulaFieldKeys({
        fieldsTabActive,
        t,
        toggleFieldsTab,
        appendMathElement,
        removeLastMathElement,
      }),
    [fieldsTabActive, appendMathElement, removeLastMathElement, toggleFieldsTab, t]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        clearFormula();

        return;
      }

      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        toggleFieldsTab();

        return;
      }

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0': {
          appendMathElement({
            value: e.key,
            type: FormulaFieldMathElementType.NUMBER,
          });

          break;
        }

        case '(':
        case ')': {
          appendMathElement({
            value: e.key,
            type: FormulaFieldMathElementType.PARENTHESIS,
          });

          break;
        }

        case '+':
        case '-':
        case '*':
        case '/': {
          appendMathElement({
            value: e.key,
            type: FormulaFieldMathElementType.OPERATOR,
          });

          break;
        }

        case '–': {
          appendMathElement({
            value: FormulaFieldMathElementValue.SUBTRACT_OPERATOR,
            type: FormulaFieldMathElementType.OPERATOR,
          });

          break;
        }

        case '[': {
          appendMathElement({
            value: FormulaFieldMathElementValue.LEFT_PARENTHESIS,
            type: FormulaFieldMathElementType.PARENTHESIS,
          });

          break;
        }

        case ']': {
          appendMathElement({
            value: FormulaFieldMathElementValue.RIGHT_PARENTHESIS,
            type: FormulaFieldMathElementType.PARENTHESIS,
          });

          break;
        }

        case ':': {
          appendMathElement({
            value: FormulaFieldMathElementValue.DIVIDE_OPERATOR,
            type: FormulaFieldMathElementType.OPERATOR,
          });

          break;
        }

        case '.':
        case ',': {
          appendMathElement({
            value: FormulaFieldMathElementValue.DECIMAL_SEPARATOR,
            type: FormulaFieldMathElementType.DECIMAL_SEPARATOR,
          });

          break;
        }

        case '%': {
          appendMathElement({
            value: e.key,
            type: FormulaFieldMathElementType.PERCENTAGE,
          });

          break;
        }

        case 'Backspace': {
          removeLastMathElement();

          break;
        }
      }
    },
    [removeLastMathElement, appendMathElement, clearFormula, toggleFieldsTab]
  );

  useWindowEvent('keydown', handleKeyDown);

  return (
    <Root>
      {fieldsTabActive ? (
        <FieldFormulaSettingsModalFields
          fieldId={fieldId}
          formulaKeys={formulaKeys}
          entityTypeId={entityTypeId}
          appendMathElement={appendMathElement}
        />
      ) : (
        <FormulaKeysButtons formulaKeys={formulaKeys} />
      )}
    </Root>
  );
};

export { FieldFormulaSettingsModalKeys };
