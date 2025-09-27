import type { Nullable } from '@/shared';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { RENTALS_LIMIT, rentalApi } from '../RentalApi';

interface GetRentalsQueryParams {
  startDate: string;
  endDate: string;
  categoryId: Nullable<number>;
}

export const useGetRentals = ({
  sectionId,
  page = 1,
  queryParams,
}: {
  sectionId: number;
  page: number;
  queryParams: GetRentalsQueryParams;
}) => {
  const offset = (page - 1) * RENTALS_LIMIT;

  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.rentals({
      offset,
      sectionId,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      categoryId: queryParams.categoryId,
    }),
    placeholderData: keepPreviousData,
    queryFn: () =>
      rentalApi.getRentals(
        sectionId,
        offset,
        queryParams.startDate,
        queryParams.endDate,
        queryParams.categoryId
      ),
  });
};
