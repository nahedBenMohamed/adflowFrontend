import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { ProductCategory } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { CreateProductCategoryDto, UpdateProductCategoryDto } from '../dtos';

class ProductCategoryApi {
  getProductCategories = async (sectionId: number): Promise<ProductCategory[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_PRODUCT_CATEGORIES, { sectionId })
    );

    return ProductCategory.fromDtos(response.data);
  };

  addProductCategory = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: CreateProductCategoryDto;
  }): Promise<ProductCategory> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_PRODUCT_CATEGORY, { sectionId }),
      dto
    );

    return ProductCategory.fromDto(response.data);
  };

  updateProductCategory = async ({
    sectionId,
    categoryId,
    dto,
  }: {
    sectionId: number;
    categoryId: number;
    dto: UpdateProductCategoryDto;
  }): Promise<ProductCategory> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCT_CATEGORY, {
        sectionId,
        categoryId,
      }),
      dto
    );

    return ProductCategory.fromDto(response.data);
  };

  deleteProductCategory = async ({
    sectionId,
    categoryId,
    newCategoryId = null,
  }: {
    sectionId: number;
    categoryId: number;
    newCategoryId?: Nullable<number>;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.DELETE_PRODUCT_CATEGORY, {
        sectionId,
        categoryId,
      }),
      {
        params: { newCategoryId },
      }
    );
  };
}

export const productCategoryApi = new ProductCategoryApi();
