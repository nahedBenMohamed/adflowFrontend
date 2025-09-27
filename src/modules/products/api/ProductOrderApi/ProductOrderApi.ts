import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { Order } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { CreateOrderDto, UpdateOrderDto } from '../dtos';

class ProductOrderApi {
  // expand allows to expand nested entities, e.g. 'items', if multiple entities are needed, separate them with comma
  // e.g. 'items,shippedAt' (in this case this is not needed)
  getEntityProductOrder = async ({
    orderId,
    expand,
  }: {
    orderId?: number;
    expand?: string;
  }): Promise<Order> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_ENTITY_PRODUCT_ORDER, { orderId }),
      {
        params: {
          expand,
        },
      }
    );

    return Order.fromDto(response.data);
  };

  getEntityProductOrders = async (entityId: number): Promise<Order[]> => {
    const response = await baseApi.get(ProductsApiRoutes.GET_ENTITY_PRODUCT_ORDERS, {
      params: {
        entityId,
        expand: 'shippedAt',
      },
    });

    return Order.fromDtos(response.data);
  };

  createEntityProductOrder = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: CreateOrderDto;
  }): Promise<Order> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_ENTITY_PRODUCT_ORDER, { sectionId }),
      dto
    );

    return Order.fromDto(response.data);
  };

  updateEntityProductOrder = async ({
    sectionId,
    orderId,
    dto,
    returnStocks,
  }: {
    sectionId: number;
    orderId: number;
    dto: UpdateOrderDto;
    returnStocks?: boolean;
  }): Promise<Order> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_ENTITY_PRODUCT_ORDER, {
        sectionId,
        orderId,
      }),
      dto,
      {
        params: {
          returnStocks,
        },
      }
    );

    return Order.fromDto(response.data);
  };

  deleteEntityProductOrder = async ({
    orderId,
    sectionId,
    returnStocks,
  }: {
    orderId: number;
    sectionId: number;
    returnStocks?: boolean;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.DELETE_ENTITY_PRODUCT_ORDER, {
        orderId,
        sectionId,
      }),
      {
        params: {
          returnStocks,
        },
      }
    );
  };
}

export const productOrderApi = new ProductOrderApi();
