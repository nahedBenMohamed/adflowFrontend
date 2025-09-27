import { generalSettingsStore, useGetUserProfiles, userStore } from '@/app';
import { useGetDepartmentsSettings } from '@/modules/settings';
import { type BusinessHours, UtcDate } from '@/shared';
import { useEffect, useMemo, useState } from 'react';
import { type SchedulePerformer, SchedulePerformerType } from '../models';

interface SchedulerBusinessHours {
  businessHours: Map<SchedulePerformer, BusinessHours>;
  areBusinessHoursLoading: boolean;
}

/* Resolves business hours for scheduler performers.
 *
 *  Step-by-step logic:
 *  1. Finds and stores:
 *    * list of department IDs for every department type performer;
 *    * list of user IDs for every user type performer;
 *    * list of corresponding department IDs for every user type performer;
 *
 *  2. Gets working type settings from API for each entity from lists above;
 *
 *  3. For each department performer:
 *    * if working time settings for this specific department exist, they are stored in map;
 *
 *  4. For each user performer:
 *    * if working time settings for this specific user exist, they are stored in map;
 *    * else if working time settings for corresponding department exist, they are stored in map;
 *
 *  5. For each stored map entry, local business hours offset is applied;
 *
 *  6. Result is returned in the map format: SchedulePerformer -> BusinessHours.
 */
export const useGetSchedulerPerformersBusinessHours = ({
  performers,
}: {
  performers: SchedulePerformer[];
}): SchedulerBusinessHours => {
  const [businessHours, setBusinessHours] = useState<Map<SchedulePerformer, BusinessHours>>(
    new Map()
  );

  const departmentIds = performers.reduce<number[]>((acc, p) => {
    if (p.type === SchedulePerformerType.DEPARTMENT) {
      if (p.departmentId) acc.push(p.departmentId);
    }

    return acc;
  }, []);

  const userIds = performers.reduce<number[]>((acc, p) => {
    if (p.type === SchedulePerformerType.USER) {
      if (p.userId) acc.push(p.userId);
    }

    return acc;
  }, []);

  const userDepartmentIds = performers.reduce<number[]>((acc, p) => {
    if (p.type === SchedulePerformerType.USER && p.userId) {
      const departmentId = userStore.getById(p.userId)?.departmentId;

      if (departmentId) acc.push(departmentId);
    }

    return acc;
  }, []);

  const { data: departmentSettings, isLoading: areDepartmentSettingsLoading } =
    useGetDepartmentsSettings({ departmentIds });
  const { data: userProfiles, isLoading: areUserProfilesLoading } = useGetUserProfiles({ userIds });
  const { data: userDepartmentSettings, isLoading: areUserDepartmentSettingsLoading } =
    useGetDepartmentsSettings({ departmentIds: userDepartmentIds });

  useEffect(() => {
    const businessHoursMap = new Map<SchedulePerformer, BusinessHours>();

    // apply business hours for department performers
    if (departmentSettings && departmentSettings.length && !areDepartmentSettingsLoading) {
      for (const department of departmentSettings) {
        if (
          !department.departmentId ||
          !department.settings ||
          !department.settings.workingTimeFrom ||
          !department.settings.workingTimeTo
        )
          continue;

        const performer = performers.find(p => p.departmentId === department.departmentId);

        if (!performer) continue;

        businessHoursMap.set(performer, {
          from: department.settings.workingTimeFrom,
          to: department.settings.workingTimeTo,
        });
      }
    }

    // apply business hours for users performers
    if (userProfiles && userProfiles.length && !areUserProfilesLoading) {
      for (const userProfile of userProfiles) {
        if (!userProfile.userId || !userProfile.settings) continue;

        const performer = performers.find(p => p.userId === userProfile.userId);

        if (!performer) continue;

        if (
          userProfile.settings.workingTimeFrom === null ||
          userProfile.settings.workingTimeTo === null
        ) {
          if (!userDepartmentSettings.length) continue;

          const userDepartment = userDepartmentSettings.find(
            s => s.departmentId === userStore.getById(userProfile.userId).departmentId
          );

          if (
            !userDepartment ||
            !userDepartment.settings ||
            !userDepartment.settings.workingTimeFrom ||
            !userDepartment.settings.workingTimeTo
          )
            continue;

          businessHoursMap.set(performer, {
            from: userDepartment.settings.workingTimeFrom,
            to: userDepartment.settings.workingTimeTo,
          });
        } else {
          businessHoursMap.set(performer, {
            from: userProfile.settings.workingTimeFrom,
            to: userProfile.settings.workingTimeTo,
          });
        }
      }
    }

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setBusinessHours(businessHoursMap);
  }, [
    departmentSettings,
    areDepartmentSettingsLoading,
    performers,
    userProfiles,
    areUserProfilesLoading,
    userDepartmentSettings,
  ]);

  const localBusinessHours = useMemo<Map<SchedulePerformer, BusinessHours>>(() => {
    const localBusinessHours = new Map<SchedulePerformer, BusinessHours>();

    for (const [key, value] of businessHours.entries()) {
      localBusinessHours.set(
        key,
        UtcDate.localBusinessHours({
          utcBusinessHours: value,
          timezone: generalSettingsStore.accountSettings?.timeZone ?? '',
        })
      );
    }

    return localBusinessHours;
  }, [businessHours]);

  return {
    businessHours: localBusinessHours,
    areBusinessHoursLoading:
      areDepartmentSettingsLoading || areUserProfilesLoading || areUserDepartmentSettingsLoading,
  };
};
