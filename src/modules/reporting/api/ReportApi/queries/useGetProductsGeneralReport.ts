import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ProductsReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetProductsGeneralReport = (filter: ProductsReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.productsGeneralReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getProductsGeneralReport(filter),
  });
