import type { Nullable } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';
import { departmentsSettingsApi } from '../DepartmentsSettingsApi';

export const useGetDepartmentSettings = ({
  departmentId,
  enabled,
}: {
  departmentId: Nullable<number>;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.departmentSettings(departmentId),
    queryFn: () => {
      if (!departmentId) {
        return Promise.reject(new Error('Invalid departmentId: cannot fetch settings'));
      }

      return departmentsSettingsApi.getGroupSettings(departmentId);
    },
    enabled: Boolean(enabled && departmentId),
  });
};
