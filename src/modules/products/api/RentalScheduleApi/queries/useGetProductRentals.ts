import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { rentalApi } from '../RentalApi';

interface GetProductRentalsQueryParams {
  startDate: string;
  endDate: string;
}

export const useGetProductRentals = ({
  sectionId,
  productId,
  queryParams,
}: {
  sectionId: number;
  productId: number;
  queryParams: GetProductRentalsQueryParams;
}) =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.rental({
      sectionId,
      productId,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
    }),
    placeholderData: keepPreviousData,
    queryFn: () =>
      rentalApi.getRental({
        sectionId,
        productId,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      }),
  });
