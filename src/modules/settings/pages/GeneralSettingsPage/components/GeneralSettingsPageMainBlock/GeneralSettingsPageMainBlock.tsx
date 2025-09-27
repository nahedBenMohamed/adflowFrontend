import { generalSettingsStore } from '@/app';
import {
  CurrencySelect,
  MultiselectWithCheckboxes,
  MySelect,
  MyTimePickerInput,
  UtcDate,
  debounce,
  type DateFormat,
  type Language,
  type MyTimePickerInputProps,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  getAllTimezoneOptions,
  getLanguageOptions,
  getPhoneFormatOptions,
  getWorkingDaysOptions,
  useGetDateFormatOptions,
} from '../../../../shared';
import { GeneralSettingsPageFormGroup } from '../GeneralSettingsPageFormGroup/GeneralSettingsPageFormGroup';
import { SettingsBlock } from '../SettingsBlock/SettingsBlock';

const WorkingTimeWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
`;

const Bulkhead = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-primary-text);
`;

const GeneralSettingsPageMainBlock = observer(() => {
  const { t, i18n } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.general_settings_page',
  });

  const { generalSettingsForm, updateAccountSettings } = generalSettingsStore;

  const dateFormatOptions = useGetDateFormatOptions();

  const languageOptions = getLanguageOptions();
  const timeZoneOptions = getAllTimezoneOptions();
  const phoneFormatOptions = getPhoneFormatOptions(t);
  const workingDaysOptions = getWorkingDaysOptions(t);

  const handleChangeLanguage = useCallback(
    (value: Language) => {
      updateAccountSettings();

      i18n.changeLanguage(value);
      UtcDate.setLocale(value);
      document.documentElement.lang = value;
    },
    [i18n, updateAccountSettings]
  );

  const handleChangeDateFormat = useCallback(
    (value: Nullable<DateFormat>) => {
      updateAccountSettings();

      UtcDate.setFormat(value);
    },
    [updateAccountSettings]
  );

  const handleChangeWorkingTime = useCallback(() => {
    const workingTimeFromSeconds = UtcDate.parseHoursStringToSeconds(
      generalSettingsForm.workingTimeFrom.value
    );
    const workingTimeToSeconds = UtcDate.parseHoursStringToSeconds(
      generalSettingsForm.workingTimeTo.value
    );

    // to prevent setting end time earlier than start time
    if (workingTimeFromSeconds >= workingTimeToSeconds) {
      // edge case when start time is 23:30 or later
      if (workingTimeFromSeconds >= 23.5 * 60 * 60) {
        generalSettingsForm.workingTimeTo.setValue('23:59');

        return;
      }

      // add 30 minutes to start time
      generalSettingsForm.workingTimeTo.setValue(
        UtcDate.secondsToHoursString(workingTimeFromSeconds + 60 * 30)
      );
    }

    updateAccountSettings();
  }, [
    updateAccountSettings,
    generalSettingsForm.workingTimeFrom.value,
    generalSettingsForm.workingTimeTo,
  ]);

  const pickerDropdownProps = useMemo<MyTimePickerInputProps['pickerDropdownProps']>(
    () => ({
      step: 30,
      inModal: true,
      withinPortal: true,
      position: 'bottom-start',
    }),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateAccountSettings = useCallback(debounce(updateAccountSettings, 500), [
    updateAccountSettings,
  ]);

  return (
    <SettingsBlock>
      <GeneralSettingsPageFormGroup text={t('language')}>
        <MySelect
          withinPortal
          options={languageOptions}
          model={generalSettingsForm.language}
          variant="outlined-without-active-shadow"
          handleChange={handleChangeLanguage}
        />
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('time_zone')}>
        <MySelect
          withinPortal
          options={timeZoneOptions}
          model={generalSettingsForm.timeZone}
          variant="outlined-without-active-shadow"
          handleChange={debouncedUpdateAccountSettings}
        />
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('working_days')}>
        <MultiselectWithCheckboxes
          withinPortal
          options={workingDaysOptions}
          model={generalSettingsForm.workingDays}
          variant="outlined-without-active-shadow"
          handleChange={debouncedUpdateAccountSettings}
        />
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('start_of_week')}>
        <MySelect
          withinPortal
          options={workingDaysOptions}
          model={generalSettingsForm.startOfWeek}
          variant="outlined-without-active-shadow"
          handleChange={debouncedUpdateAccountSettings}
        />
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('currency')}>
        <CurrencySelect
          model={generalSettingsForm.currency}
          variant="outlined-without-active-shadow"
          handleChange={debouncedUpdateAccountSettings}
        />
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('working_time')}>
        <WorkingTimeWrapper>
          <MyTimePickerInput
            fullWidth
            pickerDropdownProps={pickerDropdownProps}
            model={generalSettingsForm.workingTimeFrom}
            handleChange={handleChangeWorkingTime}
          />

          <Bulkhead>{t('to')}</Bulkhead>

          <MyTimePickerInput
            fullWidth
            pickerDropdownProps={pickerDropdownProps}
            model={generalSettingsForm.workingTimeTo}
            handleChange={handleChangeWorkingTime}
          />
        </WorkingTimeWrapper>
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('phone_format')}>
        <MySelect
          withinPortal
          options={phoneFormatOptions}
          model={generalSettingsForm.phoneFormat}
          variant="outlined-without-active-shadow"
          handleChange={debouncedUpdateAccountSettings}
        />
      </GeneralSettingsPageFormGroup>

      <GeneralSettingsPageFormGroup text={t('date_format')}>
        <MySelect
          withinPortal
          options={dateFormatOptions}
          model={generalSettingsForm.dateFormat}
          variant="outlined-without-active-shadow"
          handleChange={handleChangeDateFormat}
        />
      </GeneralSettingsPageFormGroup>
    </SettingsBlock>
  );
});

GeneralSettingsPageMainBlock.displayName = 'GeneralSettingsPageMainBlock';
export { GeneralSettingsPageMainBlock };
