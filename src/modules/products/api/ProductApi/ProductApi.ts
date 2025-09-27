import { baseApi } from '@/app';
import { FileLink, UrlTemplateUtil, type Nullable } from '@/shared';
import { GetProductsResult, Product, Stock } from '../../shared';
import { ProductsApiRoutes } from '../ProductsApiRoutes';
import type { CreateProductDto, StockDto, UpdateProductDto, UpdateStocksDto } from '../dtos';

export const PRODUCTS_LIMIT = 30;

export interface GetProductsQueryParams {
  offset?: number;
  sku?: Nullable<string>;
  search?: Nullable<string>;
  endDate?: Nullable<string>;
  startDate?: Nullable<string>;
  categoryId?: Nullable<number>;
  warehouseId?: Nullable<number>;
}

class ProductApi {
  getProduct = async ({
    sectionId,
    productId,
  }: {
    sectionId: number;
    productId: number;
  }): Promise<Product> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_PRODUCT, { sectionId, productId })
    );

    return Product.fromDto(response.data);
  };

  getProducts = async ({
    sectionId,
    queryParams,
  }: {
    sectionId: number;
    queryParams: GetProductsQueryParams;
  }): Promise<GetProductsResult> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_PRODUCTS, { sectionId }),
      {
        params: {
          limit: PRODUCTS_LIMIT,
          ...queryParams,
        },
      }
    );

    return GetProductsResult.fromDto(response.data);
  };

  getProductsByIds = async ({
    sectionId,
    ids,
  }: {
    sectionId: number;
    ids: number[];
  }): Promise<GetProductsResult> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ProductsApiRoutes.GET_PRODUCTS, { sectionId }),
      {
        params: {
          ids: ids.join(','),
        },
      }
    );

    return GetProductsResult.fromDto(response.data);
  };

  addProduct = async ({
    sectionId,
    dto,
  }: {
    sectionId: number;
    dto: CreateProductDto;
  }): Promise<Product> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.CREATE_PRODUCT, { sectionId }),
      dto
    );

    return Product.fromDto(response.data);
  };

  updateProduct = async ({
    sectionId,
    productId,
    dto,
  }: {
    sectionId: number;
    productId: number;
    dto: UpdateProductDto;
  }): Promise<Product> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCT, { sectionId, productId }),
      dto
    );

    return Product.fromDto(response.data);
  };

  updateProductStocks = async ({
    sectionId,
    productId,
    dto,
  }: {
    sectionId: number;
    productId: number;
    dto: UpdateStocksDto;
  }): Promise<Stock[]> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPDATE_PRODUCT_STOCKS, { sectionId, productId }),
      dto
    );

    return Stock.fromDtos(response.data as StockDto[]);
  };

  uploadProductImages = async ({
    sectionId,
    productId,
    images,
  }: {
    sectionId: number;
    productId: number;
    images: FileList;
  }): Promise<FileLink[]> => {
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image) formData.append('files', image);
    }

    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ProductsApiRoutes.UPLOAD_PRODUCT_IMAGES, { sectionId, productId }),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return FileLink.fromDtos(response.data);
  };

  deleteProduct = async ({
    sectionId,
    productId,
  }: {
    sectionId: number;
    productId: number;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(ProductsApiRoutes.DELETE_PRODUCT, { sectionId, productId })
    );
  };
}

export const productApi = new ProductApi();
