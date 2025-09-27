import { useQueries } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';
import { departmentsSettingsApi } from '../DepartmentsSettingsApi';

export const useGetDepartmentsSettings = ({ departmentIds }: { departmentIds: number[] }) => {
  return useQueries({
    queries: departmentIds.map(departmentId => ({
      queryKey: SETTINGS_QUERY_KEYS.departmentSettings(departmentId),
      queryFn: () => departmentsSettingsApi.getGroupSettings(departmentId),
    })),
    combine: res => ({
      data: res.map((result, idx) => ({
        departmentId: departmentIds[idx]!,
        settings: result.data,
      })),
      isLoading: res.some(result => result.isPending),
    }),
  });
};
