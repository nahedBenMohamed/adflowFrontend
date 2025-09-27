import { generalSettingsStore } from '@/app';
import { Currency, FieldFormat, FieldType, type Optional } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { FieldTextInput, type FieldValueBaseProps, type NumberFieldValue } from '../../../../..';
import { FieldValueTemplate } from '../FieldValueTemplate';

interface Props extends FieldValueBaseProps<NumberFieldValue> {
  title?: string;
  alwaysShowCurrency?: Currency;
  maxWidth?: CSSProperties['maxWidth'];
}

const NumberFieldValueComp = observer((props: Props) => {
  const {
    title,
    field,
    readonly,
    maxWidth,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysShowCurrency,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const model = fieldValue.model;
  const currencyFromSettings = generalSettingsStore.accountSettings?.currency ?? Currency.USD;

  const handleChange = useCallback(
    (value: string) => {
      fieldValue.changeValue(value.length > 0 ? Number(value) : null);

      onChange?.(fieldValue);
    },
    [fieldValue, onChange]
  );

  const currency = useMemo<Optional<Currency>>(() => {
    if (alwaysShowCurrency) return alwaysShowCurrency;

    // if field format is not specified and field type is value (budget) -> show it as currency by default
    if (field.type === FieldType.VALUE && !field.format) return currencyFromSettings;

    return field.format === FieldFormat.CURRENCY ? currencyFromSettings : undefined;
  }, [alwaysShowCurrency, field.format, field.type, currencyFromSettings]);

  return (
    <FieldValueTemplate
      title={title}
      readonly={readonly}
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <FieldTextInput
        type="number"
        model={model}
        noActiveShadow
        renderAs="input"
        currency={currency}
        maxWidth={maxWidth}
        onChange={handleChange}
      />
    </FieldValueTemplate>
  );
});

NumberFieldValueComp.displayName = 'NumberFieldValueComp';
export { NumberFieldValueComp };
