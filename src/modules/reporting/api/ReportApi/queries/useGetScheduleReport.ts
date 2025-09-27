import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ScheduleReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetScheduleReport = (filter: ScheduleReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.scheduleReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getScheduleReport(filter),
  });
