import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { GetRentalsResult, Rental } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';

export const RENTALS_LIMIT = 1000;

class RentalApi {
  getRentals = async (
    sectionId: number,
    offset: number,
    startDate: string,
    endDate: string,
    categoryId: Nullable<number>
  ): Promise<GetRentalsResult> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_RENTALS, { sectionId }),
      {
        params: {
          startDate,
          endDate,
          offset,
          limit: RENTALS_LIMIT,
          categoryId,
        },
      }
    );

    return GetRentalsResult.fromDto(response.data);
  };

  getRental = async ({
    sectionId,
    productId,
    startDate,
    endDate,
  }: {
    sectionId: number;
    productId: number;
    startDate: string;
    endDate: string;
  }): Promise<Rental[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_RENTAL, {
        sectionId,
        productId,
      }),
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return Rental.fromDtos(response.data);
  };
}

export const rentalApi = new RentalApi();
