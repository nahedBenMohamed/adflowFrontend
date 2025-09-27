import type { Nullable } from '@/shared';
import countryCodeToFlagEmoji from 'country-code-to-flag-emoji';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PhoneUserInfo } from '../../models';

const simpleCountryCodeByRUCountryNameGenerator = (countryName: string): Nullable<string> => {
  switch (countryName) {
    case 'Россия':
    case 'Российская Федерация':
      return 'RU';

    case 'Казахстан':
    case 'Республика Казахстан':
      return 'KZ';

    case 'Таджикистан':
    case 'Республика Таджикистан':
      return 'TJ';

    case 'Молдова':
    case 'Республика Молдова':
      return 'MD';

    case 'Беларусь':
    case 'Белоруссия':
    case 'Республика Белоруссия':
      return 'BY';

    case 'Армения':
    case 'Республика Армения':
      return 'AM';

    case 'Узбекистан':
    case 'Республика Узбекистан':
      return 'UZ';

    case 'Киргизия':
    case 'Киргизстан':
    case 'Киргизская Республика':
      return 'KG';

    default:
      return null;
  }
};

interface Props {
  phoneUserInfo: Nullable<PhoneUserInfo>;
}

const TimezoneHint = memo((props: Props) => {
  const { phoneUserInfo } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.field_value',
  });

  if (phoneUserInfo && (phoneUserInfo.country || phoneUserInfo.region || phoneUserInfo.city)) {
    const { country, region, city } = phoneUserInfo;

    const countryCode = country ? simpleCountryCodeByRUCountryNameGenerator(country) : null;

    return (
      <ul>
        {country && (
          <li>
            {countryCode ? `${countryCodeToFlagEmoji(countryCode)} ` : ''}
            {country}
          </li>
        )}
        {region && <li>{region}</li>}
        {city && <li>{city}</li>}
      </ul>
    );
  }

  return t('local_time');
});

TimezoneHint.displayName = 'TimezoneHint';
export { TimezoneHint };
