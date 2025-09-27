import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { SHIPMENTS_LIMIT, shipmentApi } from '../ShipmentApi';

export const useGetShipments = ({ sectionId, page }: { sectionId: number; page: number }) => {
  const offset = (page - 1) * SHIPMENTS_LIMIT;

  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.shipments({ sectionId, offset }),
    placeholderData: keepPreviousData,
    queryFn: () => shipmentApi.getShipments({ sectionId, offset }),
  });
};
