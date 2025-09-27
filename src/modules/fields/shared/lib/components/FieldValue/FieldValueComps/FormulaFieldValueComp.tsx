import { generalSettingsStore } from '@/app';
import {
  Currency,
  currencyFormatterHelper,
  FieldFormat,
  SpanWithEllipsis,
  TruncateMixin,
  type Optional,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { FieldValueBaseProps, FormulaFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const Root = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--graphite-graphite-840);

  padding: 4px 8px;

  ${TruncateMixin}
`;

const FormulaFieldValueComp = observer((props: FieldValueBaseProps<FormulaFieldValue>) => {
  const {
    field,
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.field_value',
  });

  const model = fieldValue.model;
  const currencyFromSettings = generalSettingsStore.accountSettings?.currency ?? Currency.USD;

  const currency = useMemo<Optional<Currency>>(
    () => (field.format === FieldFormat.CURRENCY ? currencyFromSettings : undefined),
    [field.format, currencyFromSettings]
  );

  return (
    <FieldValueTemplate
      readonly={readonly}
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
      title={model.value ? t('value_field_formula_calculation', { value: model.value }) : undefined}
    >
      <Root>
        <SpanWithEllipsis
          title={model.value}
          text={
            currency
              ? currencyFormatterHelper.format({
                  value: model.asNumber(),
                  currency,
                })
              : model.value
          }
        />
      </Root>
    </FieldValueTemplate>
  );
});

FormulaFieldValueComp.displayName = 'FormulaFieldValueComp';
export { FormulaFieldValueComp };
