import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { GetShipmentsResult, Shipment } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';

export const SHIPMENTS_LIMIT = 30;

class ShipmentApi {
  getShipments = async ({
    sectionId,
    offset,
  }: {
    sectionId: number;
    offset: number;
  }): Promise<GetShipmentsResult> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_SHIPMENTS, { sectionId }),
      {
        params: {
          offset,
          limit: SHIPMENTS_LIMIT,
        },
      }
    );

    return GetShipmentsResult.fromDto(response.data);
  };

  getShipment = async ({
    sectionId,
    shipmentId,
  }: {
    sectionId: number;
    shipmentId: number;
  }): Promise<Shipment> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_SHIPMENT, { sectionId, shipmentId })
    );

    return Shipment.fromDto(response.data);
  };

  changeShipmentStatus = async ({
    sectionId,
    shipmentId,
    statusId,
  }: {
    sectionId: number;
    shipmentId: number;
    statusId: number;
  }): Promise<Shipment> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CHANGE_SHIPMENT_STATUS, {
        sectionId,
        shipmentId,
        statusId,
      })
    );

    return Shipment.fromDto(response.data);
  };
}

export const shipmentApi = new ShipmentApi();
