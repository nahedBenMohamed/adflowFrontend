import { generalSettingsStore } from '@/app';
import { type Schedule, SchedulePerformerType } from '@/modules/scheduler';
import { useGetDepartmentSettings } from '@/modules/settings';
import { type BusinessHours, type Nullable, type Optional, UtcDate } from '@/shared';
import { useEffect, useMemo, useState } from 'react';

interface BoardSchedulerBusinessHours {
  businessHours: BusinessHours;
  areBusinessHoursLoading: boolean;
}

export const useGetBoardSchedulerBusinessHours = ({
  schedule,
  performerObjectId,
}: {
  schedule: Optional<Schedule>;
  performerObjectId: number;
}): BoardSchedulerBusinessHours => {
  const [from, setFrom] = useState('00:00');
  const [to, setTo] = useState('24:00');
  const [departmentId, setDepartmentId] = useState<Nullable<number>>(null);

  useEffect(() => {
    if (schedule?.performersType === SchedulePerformerType.DEPARTMENT && performerObjectId) {
      const id = schedule.getPerformerByObjectId(performerObjectId)?.departmentId;

      if (!id) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setDepartmentId(null);

        return;
      }

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setDepartmentId(id);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setDepartmentId(null);
    }
  }, [performerObjectId, schedule]);

  const { data, isLoading, isSuccess } = useGetDepartmentSettings({
    departmentId,
    enabled: departmentId !== null,
  });

  useEffect(() => {
    if (isSuccess && data?.workingTimeFrom && data?.workingTimeTo) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setFrom(data.workingTimeFrom);
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setTo(data.workingTimeTo);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setFrom(generalSettingsStore.accountSettings?.workingTimeFrom ?? '00:00');
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setTo(generalSettingsStore.accountSettings?.workingTimeTo ?? '24:00');
    }
  }, [data, isSuccess]);

  const localBusinessHours = useMemo<BusinessHours>(
    () =>
      UtcDate.localBusinessHours({
        utcBusinessHours: {
          from,
          to,
        },
        timezone: generalSettingsStore.accountSettings?.timeZone ?? '',
      }),
    [from, to]
  );

  return { businessHours: localBusinessHours, areBusinessHoursLoading: isLoading };
};
