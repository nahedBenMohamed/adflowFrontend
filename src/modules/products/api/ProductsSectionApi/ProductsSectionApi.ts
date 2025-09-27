import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { ProductsSection } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { CreateProductsSectionDto, UpdateProductsSectionDto } from '../dtos';

class ProductsSectionApi {
  getProductsSections = async (): Promise<ProductsSection[]> => {
    const response = await baseApi.get(ProductsApiRoutes.GET_PRODUCTS_SECTIONS);

    return ProductsSection.fromDtos(response.data);
  };

  getProductsSection = async (sectionId: number): Promise<ProductsSection> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_PRODUCTS_SECTION, { sectionId })
    );

    return ProductsSection.fromDto(response.data);
  };

  createProductsSection = async (dto: CreateProductsSectionDto): Promise<ProductsSection> => {
    const response = await baseApi.post(ProductsApiRoutes.CREATE_PRODUCTS_SECTION, dto);

    return ProductsSection.fromDto(response.data);
  };

  updateProductsSection = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: UpdateProductsSectionDto;
  }): Promise<ProductsSection> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCTS_SECTION, { sectionId }),
      dto
    );

    return ProductsSection.fromDto(response.data);
  };

  deleteProductsSection = async (sectionId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.DELETE_PRODUCTS_SECTION, { sectionId })
    );
  };

  updateProductsSectionLinks = async ({
    sectionId,
    entityTypeIds,
    schedulerIds,
  }: {
    sectionId: number;
    entityTypeIds: number[];
    schedulerIds: number[];
  }): Promise<boolean> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCTS_SECTION_LINKS, { sectionId }),
      { entityTypeIds, schedulerIds }
    );

    return response.data;
  };
}

export const productsSectionApi = new ProductsSectionApi();
