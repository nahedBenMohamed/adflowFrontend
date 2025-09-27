import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { ProductPrice } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { CreateProductPriceDto, ProductPriceDto, UpdateProductPriceDto } from '../dtos';

class ProductPriceApi {
  addPrice = async ({
    sectionId,
    productId,
    dto,
  }: {
    sectionId: number;
    productId: number;
    dto: CreateProductPriceDto;
  }) => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_PRODUCT_PRICE, { sectionId, productId }),
      dto
    );

    return ProductPrice.fromDto(response.data as ProductPriceDto);
  };

  updatePrice = async ({
    sectionId,
    productId,
    priceId,
    dto,
  }: {
    sectionId: number;
    productId: number;
    priceId: number;
    dto: UpdateProductPriceDto;
  }): Promise<ProductPrice> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCT_PRICE, {
        sectionId,
        productId,
        priceId,
      }),
      dto
    );

    return ProductPrice.fromDto(response.data as ProductPriceDto);
  };

  deletePrice = async ({
    sectionId,
    productId,
    priceId,
  }: {
    sectionId: number;
    productId: number;
    priceId: number;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCT_PRICE, {
        sectionId,
        productId,
        priceId,
      })
    );
  };
}

export const productPriceApi = new ProductPriceApi();
