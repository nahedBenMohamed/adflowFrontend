import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { Warehouse } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { CreateWarehouseDto, UpdateWarehouseDto } from '../dtos';

class WarehouseApi {
  getWarehouses = async (sectionId: number): Promise<Warehouse[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_WAREHOUSES, { sectionId })
    );

    return Warehouse.fromDtos(response.data);
  };

  addWarehouse = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: CreateWarehouseDto;
  }): Promise<Warehouse> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_WAREHOUSE, { sectionId }),
      dto
    );

    return Warehouse.fromDto(response.data);
  };

  updateWarehouse = async ({
    sectionId,
    warehouseId,
    dto,
  }: {
    sectionId: number;
    warehouseId: number;
    dto: UpdateWarehouseDto;
  }): Promise<Warehouse> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_WAREHOUSE, { sectionId, warehouseId }),
      dto
    );

    return Warehouse.fromDto(response.data);
  };

  deleteWarehouse = async ({
    sectionId,
    warehouseId,
    newWarehouseId,
  }: {
    sectionId: number;
    warehouseId: number;
    newWarehouseId?: number;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.DELETE_WAREHOUSE, { sectionId, warehouseId }),
      {
        params: {
          newWarehouseId,
        },
      }
    );
  };
}

export const warehouseApi = new WarehouseApi();
