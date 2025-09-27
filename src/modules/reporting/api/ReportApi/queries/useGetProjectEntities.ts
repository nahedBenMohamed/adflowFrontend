import { entityApi } from '@/modules/section';
import { useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';

export const useGetProjectEntities = ({
  entityTypeId,
  boardId,
}: {
  entityTypeId: number;
  boardId: number;
}) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.projectEntities({ entityTypeId, boardId }),
    queryFn: () => entityApi.searchEntities({ entityTypeId, boardId }),
    select: data => data.entities,
  });
