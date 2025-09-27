import { appStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  ArrowBackLink,
  InputModel,
  Label,
  MyInput,
  MySelect,
  PREV_PAGE_QUERY_PARAM,
  PermissionObjectType,
  SelectModel,
  SpanWithEllipsis,
  TruncateMixin,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  debounce,
  useTitle,
  useTypedParams,
  validateForm,
  type Nullable,
} from '@/shared';
import { when } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  UpdateProductDto,
  UpdateStockDto,
  UpdateStocksDto,
  useDeleteProduct,
  useGetProduct,
  useGetProductsSection,
  useUpdateProduct,
  useUpdateProductStocks,
} from '../../api';
import {
  ProductActionsDropdown,
  ProductDescription,
  ProductFeed,
  ProductNameBlock,
} from '../../pages';
import {
  ProductCategoriesSelect,
  ProductsSectionType,
  checkDuplicateProductSku,
  type Product,
} from '../../shared';
import { ProductCategoryStore, WarehouseStore } from '../../store';
import { ProductPageTemplate } from '../../templates';
import { ProductFormGroup, ProductMainImage } from './components';

const Root = styled.div`
  display: grid;
  grid-template-columns: 45% 1fr;
  gap: 16px;

  padding: 16px 0;
`;

const LeftBlock = styled.section`
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const RightBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopBlock = styled.div`
  display: flex;
  gap: 16px;
`;

const TopBlockContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${TruncateMixin}
`;

const ProductNameBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface InitialForm {
  sku: InputModel;
  tax: InputModel;
  name: InputModel;
  unit: InputModel;
  categoryId: SelectModel;
  description: InputModel;
  warehouseId: SelectModel;
}

const ProductPage = observer(() => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page',
  });

  const { sectionId, productId, sectionType } = useTypedParams<{
    sectionId: number;
    sectionType: ProductsSectionType;
    productId: number;
  }>();

  const [searchParams] = useSearchParams();

  const prevPageFromParams = searchParams.get(PREV_PAGE_QUERY_PARAM);

  const { data: productsSection } = useGetProductsSection(sectionId);

  const [checkingSku, setCheckingSku] = useState(false);

  const warehousesEnabled = Boolean(productsSection?.enableWarehouse);
  const isRental = sectionType === ProductsSectionType.RENTAL;

  const productCategoryStore = useMemo(() => new ProductCategoryStore(sectionId), [sectionId]);
  const warehouseStore = useMemo(() => new WarehouseStore(sectionId), [sectionId]);

  const { user: currentUser } = authStore;

  const canEditProduct = Boolean(currentUser?.canEdit(PermissionObjectType.PRODUCTS, sectionId));
  const canDeleteProduct = Boolean(
    currentUser?.canDelete(PermissionObjectType.PRODUCTS, sectionId)
  );

  const { isLoaded: areCategoriesLoaded, loadData: loadCategories } = productCategoryStore;
  const { isLoaded: areWarehousesLoaded, loadData: loadWarehouses } = warehouseStore;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        loadCategories();
        loadWarehouses();
      }
    );
  }, [loadCategories, loadWarehouses]);

  const dataLoaded = areCategoriesLoaded && areWarehousesLoaded && appStore.isLoaded;

  const form = useLocalObservable<InitialForm>(() => ({
    sku: InputModel.create(),
    unit: InputModel.create(),
    categoryId: SelectModel.create(),
    description: InputModel.create(),
    warehouseId: SelectModel.create(),
    name: InputModel.create().required(),
    tax: InputModel.create().between(0, 100),
  }));

  const [formInitialized, setFormInitialized] = useState(false);

  const handleInitialiseForm = useCallback(
    (product: Product) => {
      form.name.value = product.name;
      form.categoryId.value = product.categoryId;

      if (product.unit) form.unit.value = product.unit;

      if (product.description) form.description.value = product.description;

      if (product.sku) form.sku.value = product.sku;

      if (product.tax) form.tax.value = String(product.tax);

      if (isRental) {
        // check if rental product has a warehouse,
        // we do not mutate its stocks in any kind, we just putting a symbolical value === 1
        // to track whether product has a warehouse
        const warehouseId = product.stocks[0] ? product.stocks[0].warehouseId : null;

        if (warehouseId) form.warehouseId.value = warehouseId;
      }
    },
    [form, isRental]
  );

  const { data: product, isLoading } = useGetProduct({ sectionId, productId });

  useTitle({
    dynamicTitle:
      productsSection && product ? `${product.name} | ${productsSection.name}` : undefined,
  });

  useEffect(() => {
    when(
      () => dataLoaded,
      () => {
        if (product && !formInitialized) {
          handleInitialiseForm(product);

          setFormInitialized(true);
        }
      }
    );
  }, [dataLoaded, product, form, formInitialized, handleInitialiseForm]);

  const { mutate: updateProduct } = useUpdateProduct({ sectionId, productId });
  const { mutate: deleteProduct } = useDeleteProduct({ sectionId, productId });

  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateProduct = useCallback(
    debounce(() => {
      if (!validateForm(form)) return;

      const dto = new UpdateProductDto({
        sku: form.sku.valueOrNull(),
        name: form.name.trimmedValue,
        unit: form.unit.valueOrNull(),
        tax: form.tax.asNumberOrNull(),
        categoryId: form.categoryId.value,
        description: form.description.valueOrNull(),
      });

      updateProduct(dto);
    }, 750),
    []
  );

  const { mutate: updateProductStocks } = useUpdateProductStocks({ sectionId, productId });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateRentalProductWarehouse = useCallback(
    debounce((warehouseId: Nullable<number>) => {
      if (!product) return;

      if (warehouseId) {
        const dtos = new UpdateStocksDto(
          product.stocks.length > 0
            ? product.stocks.map<UpdateStockDto>(s =>
                s.warehouseId === warehouseId
                  ? new UpdateStockDto({ warehouseId: s.warehouseId, stockQuantity: 1 })
                  : new UpdateStockDto({ warehouseId: s.warehouseId, stockQuantity: null })
              )
            : [new UpdateStockDto({ warehouseId, stockQuantity: 1 })]
        );

        updateProductStocks(dtos);
      } else {
        updateProductStocks(
          new UpdateStocksDto(
            product.stocks.map<UpdateStockDto>(
              s => new UpdateStockDto({ warehouseId: s.warehouseId, stockQuantity: null })
            )
          )
        );
      }
    }, 500),
    [product, updateProductStocks]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckDuplicateSku = useCallback(
    debounce(async (sku: string): Promise<void> => {
      if (!sku.trim().length) return;

      try {
        setCheckingSku(true);

        const result = await checkDuplicateProductSku({
          sectionId,
          sku,
          currentProductId: productId,
        });

        if (result) {
          form.sku.showError(t('sku_already_exists_warning', { sku }));
        } else {
          debouncedUpdateProduct();
        }
      } finally {
        setCheckingSku(false);
      }
    }, 500),
    [sectionId, productId]
  );

  const handleDeleteProduct = () => {
    deleteProduct();

    navigate(routes.products({ sectionId, sectionType }));
  };

  const backLinkURL = prevPageFromParams
    ? UriCodingUtil.decode(prevPageFromParams)
    : routes.products({ sectionId, sectionType });

  return (
    <ProductPageTemplate productsSection={productsSection} productName={form.name.value}>
      {formInitialized && product && !isLoading ? (
        <Root>
          <LeftBlock>
            <TopBlock>
              {product.photoFileLinks.length > 0 && (
                <ProductMainImage photoFileLinks={product.photoFileLinks} />
              )}

              <TopBlockContent>
                <ProductNameBlockWrapper>
                  <ArrowBackLink backLink={backLinkURL} />

                  <ProductNameBlock
                    model={form.name}
                    disabled={!canEditProduct}
                    onChange={debouncedUpdateProduct}
                  />

                  {canDeleteProduct && (
                    <ProductActionsDropdown handleDelete={handleDeleteProduct} />
                  )}
                </ProductNameBlockWrapper>

                <ProductFormGroup label={t('sku')}>
                  <MyInput
                    model={form.sku}
                    variant="outlined"
                    loading={checkingSku}
                    disabled={!canEditProduct}
                    handleChange={debouncedCheckDuplicateSku}
                  />
                </ProductFormGroup>

                <ProductFormGroup label={t('unit')}>
                  <MyInput
                    model={form.unit}
                    variant="outlined"
                    disabled={!canEditProduct}
                    handleChange={debouncedUpdateProduct}
                  />
                </ProductFormGroup>

                <ProductFormGroup label={t('tax')}>
                  <MyInput
                    model={form.tax}
                    variant="outlined"
                    disabled={!canEditProduct}
                    handleChange={debouncedUpdateProduct}
                  />
                </ProductFormGroup>

                <ProductFormGroup label={t('category')}>
                  <ProductCategoriesSelect
                    model={form.categoryId}
                    dropdownMinWidth="240px"
                    disabled={!canEditProduct}
                    variant="outlined-without-active-shadow"
                    productCategoryStore={productCategoryStore}
                    handleChange={debouncedUpdateProduct}
                  />
                </ProductFormGroup>

                {warehousesEnabled && isRental && (
                  <ProductFormGroup label={t('warehouse')}>
                    <MySelect
                      variant="outlined"
                      model={form.warehouseId}
                      disabled={!canEditProduct}
                      options={warehouseStore.warehousesOptions}
                      handleChange={debouncedUpdateRentalProductWarehouse}
                    />
                  </ProductFormGroup>
                )}
              </TopBlockContent>
            </TopBlock>

            <DescriptionWrapper>
              <Label $color="var(--button-text-graphite-primary-text)">
                <SpanWithEllipsis text={t('product_description')} />
              </Label>

              <ProductDescription
                disabled={!canEditProduct}
                description={form.description}
                onChange={debouncedUpdateProduct}
              />
            </DescriptionWrapper>
          </LeftBlock>

          <RightBlock>
            <ProductFeed
              product={product}
              sectionType={sectionType}
              disabled={!canEditProduct}
              warehouseStore={warehouseStore}
              productsSection={productsSection}
            />
          </RightBlock>
        </Root>
      ) : (
        <WholePageLoaderWithLogo ensureHeader />
      )}
    </ProductPageTemplate>
  );
});

ProductPage.displayName = 'ProductPage';
export { ProductPage };
