import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { RentalInterval } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { RentalIntervalDto } from '../dtos';

class ProductSectionRentalIntervalApi {
  getProductSectionRentalInterval = async (
    sectionId: number
  ): Promise<Nullable<RentalInterval>> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_PRODUCTS_SECTION_RENTAL_INTERVAL, {
        sectionId,
      })
    );

    if (!response.data) return null;

    return RentalInterval.fromDto(response.data);
  };

  createProductSectionRentalInterval = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: RentalIntervalDto;
  }): Promise<RentalInterval> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_PRODUCTS_SECTION_RENTAL_INTERVAL, {
        sectionId,
      }),
      dto
    );

    return RentalInterval.fromDto(response.data);
  };
}

export const productSectionRentalIntervalApi = new ProductSectionRentalIntervalApi();
