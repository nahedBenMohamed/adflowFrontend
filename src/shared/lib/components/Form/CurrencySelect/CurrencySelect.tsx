import { getCurrenciesOptions } from '@/modules/settings';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { MySelectTitleRootVariant, SelectModel } from '../../../models';
import type { Currency } from '../../../types';
import { MySelect } from '../MySelect/MySelect/MySelect';

interface Props {
  model: SelectModel;
  withLabel?: boolean;
  dropdownMinWidth?: string;
  variant?: MySelectTitleRootVariant;
  titleMaxWidth?: CSSProperties['maxWidth'];
  titleMinWidth?: CSSProperties['minWidth'];
  handleChange?: (currency: Currency) => void;
}

const CurrencySelect = observer((props: Props) => {
  const {
    model,
    withLabel,
    dropdownMinWidth,
    variant = 'outlined',
    titleMaxWidth,
    titleMinWidth,
    handleChange,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.general_settings_page',
  });

  const currencyOptions = useMemo(() => getCurrenciesOptions(t), [t]);

  const handleChangeCurrency = useCallback(
    (value: Currency) => handleChange?.(value),
    [handleChange]
  );

  return (
    <MySelect
      withinPortal
      model={model}
      variant={variant}
      maxWidth={titleMaxWidth}
      options={currencyOptions}
      titleMinWidth={titleMinWidth}
      dropdownMinWidth={dropdownMinWidth}
      label={withLabel ? t('currency_select') : undefined}
      handleChange={handleChangeCurrency}
    />
  );
});

CurrencySelect.displayName = 'CurrencySelect';
export { CurrencySelect };
