import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { ProductRentalStatus, RentalOrder, type RentalOrderStatus } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type {
  CheckRentalStatusDto,
  CreateRentalOrderDto,
  RentalOrderFilter,
  UpdateRentalOrderDto,
} from '../dtos';

class ProductRentalOrderApi {
  getEntityRentalProductOrder = async ({
    sectionId,
    orderId,
  }: {
    sectionId: number;
    orderId: number;
  }): Promise<RentalOrder> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_ENTITY_PRODUCT_RENTAL_ORDER, {
        sectionId,
        orderId,
      })
    );

    return RentalOrder.fromDto(response.data);
  };

  getEntityRentalProductOrders = async ({
    sectionId,
    entityId,
  }: {
    sectionId: number;
    entityId: number;
  }): Promise<RentalOrder[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_ENTITY_PRODUCT_RENTAL_ORDERS, {
        entityId,
        sectionId,
      })
    );

    return RentalOrder.fromDtos(response.data);
  };

  createEntityRentalProductOrder = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: CreateRentalOrderDto;
  }): Promise<RentalOrder> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_ENTITY_PRODUCT_RENTAL_ORDER, { sectionId }),
      dto
    );

    return RentalOrder.fromDto(response.data);
  };

  updateEntityRentalProductOrder = async ({
    sectionId,
    orderId,
    dto,
  }: {
    sectionId: number;
    orderId: number;
    dto: UpdateRentalOrderDto;
  }): Promise<RentalOrder> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_ENTITY_PRODUCT_RENTAL_ORDER, {
        sectionId,
        orderId,
      }),
      dto
    );

    return RentalOrder.fromDto(response.data);
  };

  deleteEntityRentalProductOrder = async ({
    sectionId,
    orderId,
  }: {
    sectionId: number;
    orderId: number;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.DELETE_ENTITY_PRODUCT_RENTAL_ORDER, {
        sectionId,
        orderId,
      })
    );
  };

  checkRentalProductsAvailabilityStatus = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: CheckRentalStatusDto;
  }): Promise<ProductRentalStatus[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CHECK_RENTAL_PRODUCTS_AVAILABILITY_STATUS, {
        sectionId,
      }),
      dto
    );

    return ProductRentalStatus.fromDtos(response.data);
  };

  searchRentalOrders = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: RentalOrderFilter;
  }): Promise<RentalOrder[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.SEARCH_RENTAL_ORDERS, { sectionId }),
      dto
    );

    return RentalOrder.fromDtos(response.data);
  };

  changeRentalOrderStatus = async ({
    sectionId,
    orderId,
    status,
  }: {
    sectionId: number;
    orderId: number;
    status: RentalOrderStatus;
  }): Promise<RentalOrder> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CHANGE_ENTITY_PRODUCT_RENTAL_ORDER_STATUS, {
        sectionId,
        orderId,
        status,
      })
    );

    return RentalOrder.fromDto(response.data);
  };
}

export const productRentalOrderApi = new ProductRentalOrderApi();
