import {
  DialogModalSecondary,
  FunctionalTextEditor,
  MyInput,
  MySelect,
  debounce,
  useModalControl,
  useUploadFiles,
  type ModalControl,
  type Nullable,
} from '@/shared';
import { FocusTrap } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAddProduct } from '../../../../api';
import {
  ProductCategoriesSelect,
  ProductType,
  ProductsSectionType,
  checkDuplicateProductSku,
  generateProductTypeOptions,
} from '../../../../shared';
import {
  type AddProductModalStore,
  type ProductCategoryStore,
  type WarehouseStore,
} from '../../../../store';
import { AddPhotoBlock } from '../AddPhotoBlock/AddPhotoBlock';
import { AddWarehousePlaceholder } from '../AddWarehousePlaceholder/AddWarehousePlaceholder';
import { ProductPriceList } from '../Prices/ProductPriceList';
import {
  AddProductModalFormGroup,
  AddProductModalSkuField,
  AddProductModalWarning,
  CreateStocksBlock,
} from './components';

const FormWrapper = styled.div`
  padding: 16px 32px;
`;

interface Props {
  control: ModalControl;
  barcodesEnabled: boolean;
  warehousesEnabled: boolean;
  warehouseStore: WarehouseStore;
  sectionType: ProductsSectionType;
  addProductModalStore: AddProductModalStore;
  productCategoryStore: ProductCategoryStore;
  clearAllPresetParams: () => void;
  resetAddProductModalStore: () => void;
}

const AddProductModal = observer((props: Props) => {
  const {
    control,
    sectionType,
    warehouseStore,
    barcodesEnabled,
    warehousesEnabled,
    addProductModalStore,
    productCategoryStore,
    clearAllPresetParams,
    resetAddProductModalStore,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.add_product_modal',
  });

  const { sectionId } = warehouseStore;

  const [skuDuplicateError, setSkuDuplicateError] = useState<Nullable<string>>(null);
  const [checkingSku, setCheckingSku] = useState(false);

  const productTypeOptions = generateProductTypeOptions(t);

  const {
    sku,
    tax,
    name,
    type,
    unit,
    prices,
    categoryId,
    description,
    warehouseId,
    createStockRows,
    isJsonStateChanged,
    generateCreateProductDto,
  } = addProductModalStore;

  const uploadFilesControl = useUploadFiles();

  const { mutateAsync: handleAddProduct, isPending: isAddingProduct } = useAddProduct(
    warehouseStore.sectionId
  );

  const warningModalControl = useModalControl(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckDuplicateSku = useCallback(
    debounce(async (sku: string): Promise<void> => {
      if (!sku.trim().length) {
        setSkuDuplicateError(null);

        return;
      }

      try {
        setCheckingSku(true);

        const result = await checkDuplicateProductSku({ sectionId, sku });

        if (result) {
          setSkuDuplicateError(t('sku_already_exists_warning', { sku }));
        } else {
          setSkuDuplicateError(null);
        }
      } finally {
        setCheckingSku(false);
      }
    }, 500),
    [sectionId]
  );

  const handleHideAndReset = () => {
    control.close();
    clearAllPresetParams();
    resetAddProductModalStore();
  };

  const onSubmit = async (): Promise<void> => {
    if (!addProductModalStore.validate()) return;

    const dto = generateCreateProductDto(uploadFilesControl.uploadedFiles);

    try {
      await handleAddProduct(dto);

      handleHideAndReset();
    } catch (e) {
      throw new Error(`Error while adding product ${dto.name}: ${e}`);
    }
  };

  const formChanged = isJsonStateChanged() || uploadFilesControl.uploadedFiles.length > 0;

  const handleHideAddProductModal = () => {
    if (formChanged) {
      warningModalControl.open();
    } else {
      handleHideAndReset();
    }
  };

  const handleApproveHide = () => {
    warningModalControl.close();

    handleHideAndReset();
  };

  const approveDisabled =
    isAddingProduct || !formChanged || Boolean(skuDuplicateError) || checkingSku;

  return (
    <DialogModalSecondary
      width="100%"
      maxWidth="640px"
      loading={isAddingProduct}
      isOpened={control.opened}
      Header={t('add_product')}
      errorMessage={skuDuplicateError}
      approveDisabled={approveDisabled}
      onApprove={onSubmit}
      onClose={handleHideAddProductModal}
    >
      <FocusTrap>
        <FormWrapper>
          <AddProductModalFormGroup text={t('name')}>
            <MyInput model={name} variant="outlined" />
          </AddProductModalFormGroup>

          <AddProductModalFormGroup text={t('type')}>
            <MySelect
              model={type}
              options={productTypeOptions}
              variant="outlined-without-active-shadow"
            />
          </AddProductModalFormGroup>

          <AddProductModalFormGroup text={t('add_photo')} alignItems="start">
            <AddPhotoBlock uploadFilesControl={uploadFilesControl} />
          </AddProductModalFormGroup>

          <AddProductModalFormGroup text={t('description')} alignItems="start">
            <FunctionalTextEditor
              variant="outlined"
              model={description}
              contentMinHeight="88px"
              contentMaxHeight="400px"
            />
          </AddProductModalFormGroup>

          <AddProductModalSkuField
            sku={sku}
            checkingSku={checkingSku}
            barcodesEnabled={barcodesEnabled}
            checkDuplicateSku={debouncedCheckDuplicateSku}
          />

          <AddProductModalFormGroup text={t('category')}>
            <ProductCategoriesSelect
              maxHeight="280px"
              model={categoryId}
              variant="outlined-without-active-shadow"
              productCategoryStore={productCategoryStore}
            />
          </AddProductModalFormGroup>

          <AddProductModalFormGroup text={t('unit')}>
            <MyInput model={unit} variant="outlined" />
          </AddProductModalFormGroup>

          <AddProductModalFormGroup text={t('prices')} margin="0 0 12px">
            <ProductPriceList prices={prices} />
          </AddProductModalFormGroup>

          <AddProductModalFormGroup text={t('tax')}>
            <MyInput model={tax} variant="outlined" />
          </AddProductModalFormGroup>

          {warehousesEnabled && sectionType === ProductsSectionType.RENTAL && (
            <AddProductModalFormGroup text="Warehouse">
              <MySelect
                model={warehouseId}
                placeholder="Select warehouse"
                variant="outlined-without-active-shadow"
                options={warehouseStore.warehousesOptions}
                noOptionsLabel={
                  <AddWarehousePlaceholder sectionId={sectionId} sectionType={sectionType} />
                }
              />
            </AddProductModalFormGroup>
          )}

          {warehousesEnabled &&
            type.value === ProductType.PRODUCT &&
            createStockRows.length > 0 &&
            sectionType === ProductsSectionType.SALE && (
              <AddProductModalFormGroup text={t('stocks')}>
                <CreateStocksBlock
                  warehouseStore={warehouseStore}
                  createStockRows={createStockRows}
                />
              </AddProductModalFormGroup>
            )}
        </FormWrapper>
      </FocusTrap>

      {warningModalControl.opened && (
        <AddProductModalWarning
          opened={warningModalControl.opened}
          onApprove={handleApproveHide}
          hide={warningModalControl.close}
        />
      )}
    </DialogModalSecondary>
  );
});

AddProductModal.displayName = 'AddProductModal';
export { AddProductModal };
