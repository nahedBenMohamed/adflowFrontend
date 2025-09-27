import { useMutation } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import type { RentalOrderFilter } from '../../dtos';
import { productRentalOrderApi } from '../ProductRentalOrderApi';

export const useSearchRentalOrders = (sectionId: number) =>
  useMutation({
    mutationKey: PRODUCTS_QUERY_KEYS.searchRentalOrders(sectionId),
    mutationFn: (dto: RentalOrderFilter) =>
      productRentalOrderApi.searchRentalOrders({ sectionId, dto }),
  });
