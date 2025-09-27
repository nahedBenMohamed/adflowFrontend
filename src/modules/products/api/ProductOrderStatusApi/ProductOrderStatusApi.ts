import { baseApi } from '@/app';
import type { OrderStatus } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';

class ProductOrderStatusApi {
  getEntityProductOrderStatuses = async (): Promise<OrderStatus[]> => {
    const response = await baseApi.get(ProductsApiRoutes.GET_PRODUCT_ORDER_STATUSES);

    return response.data;
  };
}

export const productOrderStatusApi = new ProductOrderStatusApi();
