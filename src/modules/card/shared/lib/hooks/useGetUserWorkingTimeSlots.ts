import { generalSettingsStore, useGetUserProfiles } from '@/app';
import { useGetDepartmentsSettings } from '@/modules/settings';
import { ConvertTimeUtil, Time, User } from '@/shared';
import { useTranslation } from 'react-i18next';

export const useGetUserWorkingTimeSlots = (user: User): Time[] | null => {
  const { t } = useTranslation();

  const departmentId = user.departmentId;
  const accountWorkingTimeFrom = generalSettingsStore.accountSettings?.workingTimeFrom;
  const accountWorkingTimeTo = generalSettingsStore.accountSettings?.workingTimeTo;

  const { data: departmentSettings, isLoading: areDepartmentSettingsLoading } =
    useGetDepartmentsSettings({ departmentIds: departmentId ? [departmentId] : [] });

  const { data: userProfiles, isLoading: areUserProfilesLoading } = useGetUserProfiles({
    userIds: [user.id],
  });

  if (areDepartmentSettingsLoading || areUserProfilesLoading) return null;

  if (
    userProfiles[0]?.settings &&
    userProfiles[0].settings.workingTimeFrom &&
    userProfiles[0].settings.workingTimeTo
  ) {
    const allDaySlot: Time = {
      label: t('all_day'),
      startTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
        ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(userProfiles[0].settings.workingTimeFrom)
      ),
      endTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
        ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(userProfiles[0].settings.workingTimeTo)
      ),
    };

    return [
      allDaySlot,
      ...ConvertTimeUtil.generateTimeSlots({
        startTime: userProfiles[0].settings.workingTimeFrom,
        endTime: userProfiles[0].settings.workingTimeTo,
      }),
    ];
  }

  if (
    departmentSettings[0]?.settings &&
    departmentSettings[0].settings.workingTimeFrom &&
    departmentSettings[0].settings.workingTimeTo
  ) {
    const allDaySlot: Time = {
      label: t('all_day'),
      startTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
        ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(
          departmentSettings[0].settings.workingTimeFrom
        )
      ),
      endTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
        ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(
          departmentSettings[0].settings.workingTimeTo
        )
      ),
    };

    return [
      allDaySlot,
      ...ConvertTimeUtil.generateTimeSlots({
        startTime: departmentSettings[0].settings.workingTimeFrom,
        endTime: departmentSettings[0].settings.workingTimeTo,
      }),
    ];
  }

  if (accountWorkingTimeFrom && accountWorkingTimeTo) {
    const allDaySlot: Time = {
      label: t('all_day'),
      startTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
        ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(accountWorkingTimeFrom)
      ),
      endTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
        ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(accountWorkingTimeTo)
      ),
    };

    return [
      allDaySlot,
      ...ConvertTimeUtil.generateTimeSlots({
        startTime: accountWorkingTimeFrom,
        endTime: accountWorkingTimeTo,
      }),
    ];
  }

  const allDaySlot: Time = {
    label: t('all_day'),
    startTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
      ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict('00:00')
    ),
    endTime: ConvertTimeUtil.getSecondsFromHoursAndMinutes(
      ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict('23:59')
    ),
  };

  return [
    allDaySlot,
    ...ConvertTimeUtil.generateTimeSlots({ startTime: '00:00', endTime: '23:59' }),
  ];
};
