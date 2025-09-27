import type { TFunction } from 'i18next';
import { ClearEntryIcon } from '../../../assets';
import { FormulaFieldMathElementType, type FormulaKey } from '../../models';
import type { AppendMathElementHandler } from '../../types';

export const getFormulaFieldKeys = ({
  fieldsTabActive,
  t,
  toggleFieldsTab,
  appendMathElement,
  removeLastMathElement,
}: {
  fieldsTabActive: boolean;
  t: TFunction;
  toggleFieldsTab: () => void;
  removeLastMathElement: () => void;
  appendMathElement: AppendMathElementHandler;
}): FormulaKey[] => {
  const getKeyPressHandler =
    ({ type, value }: { type: FormulaFieldMathElementType; value: string }) =>
    () => {
      appendMathElement({ type, value });
    };

  const percentKey: FormulaKey = {
    label: '%',
    handler: getKeyPressHandler({ type: FormulaFieldMathElementType.PERCENTAGE, value: '%' }),
  };

  const clearEntryKey: FormulaKey = {
    danger: true,
    label: <ClearEntryIcon />,
    handler: removeLastMathElement,
  };

  const plusOperatorKey: FormulaKey = {
    label: '+',
    handler: getKeyPressHandler({ type: FormulaFieldMathElementType.OPERATOR, value: '+' }),
  };

  if (fieldsTabActive)
    return [
      clearEntryKey,
      percentKey,
      plusOperatorKey,
      {
        outlined: true,
        smallText: true,
        label: t('close'),
        handler: toggleFieldsTab,
      },
    ];

  return [
    // Row 1
    {
      label: '7',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '7' }),
    },
    {
      label: '8',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '8' }),
    },
    {
      label: '9',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '9' }),
    },
    {
      label: '÷',
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.OPERATOR, value: '/' }),
    },
    clearEntryKey,

    // Row 2
    {
      label: '4',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '4' }),
    },
    {
      label: '5',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '5' }),
    },
    {
      label: '6',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '6' }),
    },
    {
      label: '×',
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.OPERATOR, value: '*' }),
    },
    percentKey,

    // Row 3
    {
      label: '1',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '1' }),
    },
    {
      label: '2',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '2' }),
    },
    {
      label: '3',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '3' }),
    },
    {
      label: '-',
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.OPERATOR, value: '-' }),
    },
    {
      label: '.',
      handler: getKeyPressHandler({
        type: FormulaFieldMathElementType.DECIMAL_SEPARATOR,
        value: '.',
      }),
    },

    // Row 4
    {
      label: '(',
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.PARENTHESIS, value: '(' }),
    },
    {
      label: '0',
      secondary: true,
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.NUMBER, value: '0' }),
    },
    {
      label: ')',
      handler: getKeyPressHandler({ type: FormulaFieldMathElementType.PARENTHESIS, value: ')' }),
    },
    plusOperatorKey,
    {
      outlined: true,
      smallText: true,
      label: t('field'),
      handler: toggleFieldsTab,
    },
  ];
};
