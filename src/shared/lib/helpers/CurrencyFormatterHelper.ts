import { type Language } from '../models';
import { currenciesWithLocales, type Currency } from '../types';

export class CurrencyFormatterHelper {
  maximumFractionDigits: number;

  private _formatters: { currency: Currency; formatter: Intl.NumberFormat }[] = [];

  constructor(maximumFractionDigits = 2) {
    this.maximumFractionDigits = maximumFractionDigits;

    currenciesWithLocales.forEach(c => {
      this._formatters.push({
        currency: c.currency,
        formatter: new Intl.NumberFormat(c.locale, {
          style: 'currency',
          currency: c.currency,
          maximumFractionDigits: this.maximumFractionDigits,
        }),
      });
    });
  }

  getCurrencyFormatter = (currency: Currency): Intl.NumberFormat => {
    const currencyFormatter = this._formatters.find(f => f.currency === currency);

    if (!currencyFormatter) throw new Error(`Failed to find formatter for currency ${currency}`);

    return currencyFormatter.formatter;
  };

  format = ({ value, currency }: { value: number; currency: Currency }): string => {
    const formatter = this.getCurrencyFormatter(currency);

    return formatter.format(value);
  };

  formatWithLanguage = ({
    value,
    currency,
    language,
  }: {
    value: number;
    currency: Currency;
    language?: Language;
  }): string => {
    const locale = language ?? currenciesWithLocales.find(c => c.currency === currency)?.locale;

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: this.maximumFractionDigits,
    });

    return formatter.format(value);
  };

  compactFormat = ({
    value,
    currency,
    language,
  }: {
    value: number;
    currency: Currency;
    language?: string;
  }): string => {
    const locale = language ?? currenciesWithLocales.find(c => c.currency === currency)?.locale;

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: this.maximumFractionDigits,
    });

    return formatter.format(value);
  };
}

export const currencyFormatterHelper = new CurrencyFormatterHelper();
