import { generalSettingsStore } from '@/app';
import { useMemo } from 'react';
import { type BusinessHours, UtcDate } from '../models';

export const useGetLocalBusinessHours = (): BusinessHours => {
  const { accountSettings } = generalSettingsStore;

  return useMemo<BusinessHours>(() => {
    if (!accountSettings || !accountSettings.workingTimeFrom || !accountSettings.workingTimeTo)
      return { from: '00:00', to: '23:59' };

    return UtcDate.localBusinessHours({
      utcBusinessHours: {
        from: accountSettings.workingTimeFrom,
        to: accountSettings.workingTimeTo,
      },
      timezone: accountSettings?.timeZone ?? '',
    });
  }, [accountSettings]);
};
