import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { CustomerReportFilterDto } from '../../dtos';
import { CUSTOMER_REPORT_LIMIT, reportApi } from '../ReportApi';

export const useGetCustomerReport = ({
  page,
  filter,
}: {
  page: number;
  filter: CustomerReportFilterDto;
}) => {
  const offset = (page - 1) * CUSTOMER_REPORT_LIMIT;

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.customerReport({ offset, filter }),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getCustomerReport({ offset, filter }),
  });
};
