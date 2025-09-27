import { useQuery } from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../../AppQueryKeys';
import { versionApi } from '../VersionApi';

export const useGetLatestFrontendVersionPolling = (currentVersion: string) =>
  useQuery({
    queryKey: APP_QUERY_KEYS.latestFrontendVersion(currentVersion),
    queryFn: () => versionApi.getLatestFrontendVersion(currentVersion),
    // refetch every 10 minutes
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
