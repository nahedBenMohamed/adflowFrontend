import { generalSettingsStore } from '@/app';
import { PhoneFieldControls } from '@/modules/fields';
import {
  PhoneFieldInput,
  envUtil,
  generateCountryCodeFromLanguage,
  type InputModel,
  type Optional,
  type SearchDuplicatesProps,
} from '@/shared';
import { isPossiblePhoneNumber, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useGetPhoneUserInfo } from '../../../../../../../../../api';
import type { FieldSettings } from '../../../../../../../models';
import { MultitextFieldValueCompTemplate } from '../../../components';

interface Props {
  idx: number;
  model: InputModel;
  disabled?: boolean;
  tableView?: boolean;
  fieldSettings?: FieldSettings;
  alwaysHideIndicator?: boolean;
  searchDuplicatesProps?: SearchDuplicatesProps;
  rightIndicatorOnMobile?: boolean;
  handleChange: (phone: string) => void;
}

const PhoneFieldValueCompItem = observer((props: Props) => {
  const {
    idx,
    model,
    disabled,
    tableView,
    fieldSettings,
    alwaysHideIndicator,
    searchDuplicatesProps,
    rightIndicatorOnMobile,
    handleChange,
  } = props;

  const { accountSettings } = generalSettingsStore;

  const countryCode = useMemo<Optional<CountryCode>>(
    () => (accountSettings ? generateCountryCodeFromLanguage(accountSettings.language) : undefined),
    [accountSettings]
  );

  const getPhoneUserInfoQueryEnabled = useMemo<boolean>(
    () =>
      envUtil.appRUSegment &&
      (isValidPhoneNumber(model.value) ||
        isPossiblePhoneNumber(model.value, { defaultCountry: countryCode })),
    [model.value, countryCode]
  );

  const { data: phoneUserInfo, isLoading: isPhoneUserInfoLoading } = useGetPhoneUserInfo({
    phone: model.value,
    enabled: getPhoneUserInfoQueryEnabled,
  });

  return (
    <MultitextFieldValueCompTemplate
      key={idx}
      tableView={tableView}
      fieldSettings={fieldSettings}
      filled={model.value.length > 0}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <PhoneFieldInput
        model={model}
        disabled={disabled}
        Controls={
          <PhoneFieldControls
            phone={model.value}
            tableView={tableView}
            phoneUserInfo={phoneUserInfo}
            isPhoneUserInfoLoading={isPhoneUserInfoLoading}
          />
        }
        searchDuplicatesProps={searchDuplicatesProps}
        handleChange={handleChange}
      />
    </MultitextFieldValueCompTemplate>
  );
});

PhoneFieldValueCompItem.displayName = 'PhoneFieldValueCompItem';
export { PhoneFieldValueCompItem };
