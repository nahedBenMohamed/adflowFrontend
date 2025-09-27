import { Language } from '@/shared';
import { type CountryCode } from 'libphonenumber-js';

export const generateCountryCodeFromLanguage = (lang: Language): CountryCode => {
  switch (lang) {
    case Language.ENGLISH:
      return 'US';

    case Language.RUSSIAN:
      return 'RU';

    case Language.FRENCH:
      return 'FR';

    case Language.POLISH:
      return 'PL';

    case Language.SPANISH:
      return 'ES';
  }
};
