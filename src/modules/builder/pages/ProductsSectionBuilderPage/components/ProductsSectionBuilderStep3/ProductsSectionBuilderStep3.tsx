import {
  ProductsSectionType,
  WarehousesBlock,
  type ProductsSectionBuilderStore,
  type WarehouseStore,
} from '@/modules/products';
import {
  DelaySelect,
  MySwitchWithModel,
  debounce,
  useErrorMessageIdle,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepItemLabel,
  useGetProductsSectionAfterCancelDelayOptions,
} from '../../../../shared';
import type { BuilderNavStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  navStore: BuilderNavStore;
  warehouseStore: WarehouseStore;
  moduleType: ProductsSectionType;
  sectionBuilderStore: ProductsSectionBuilderStore;
  moduleId?: number;
  saveError?: string;
  onSave?: () => void;
}

const ProductsSectionBuilderStep3 = observer((props: Props) => {
  const { navStore, warehouseStore, moduleType, sectionBuilderStore, moduleId, saveError, onSave } =
    props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.products_section_builder_page.product_section_builder_step3',
  });

  const { error: stepError, idle: stepErrorIdle } = useErrorMessageIdle(t('update_error'));
  const { error: warehousesError, idle: warehousesErrorIdle } = useErrorMessageIdle(
    t('warehouses_error')
  );

  useLayoutEffect(() => {
    if (moduleId) {
      warehouseStore.loadData();
    } else {
      warehouseStore.isLoaded = true;
    }
  }, [moduleId, warehouseStore]);

  const { getStepByOrder, navigateToNextStep, setStepOrder } = navStore;
  const { sectionFormData: formData, productsSection, updateProductsSection } = sectionBuilderStore;
  const { enableWarehouse, enableBarcode, cancelAfter, setCancelAfter } = formData;

  const currentStep = getStepByOrder(3);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceUpdate = useCallback(
    debounce(async (): Promise<void> => {
      if (!productsSection) return;

      if (!formData.validate()) {
        stepErrorIdle();

        return;
      }

      await updateProductsSection({
        id: productsSection.id,
        dto: formData.updateProductsSectionDto,
      });
    }, 500),
    [productsSection, formData]
  );

  const handleSetCancelAfter = useCallback(
    (value: Nullable<number>) => {
      setCancelAfter(value);

      handleDebounceUpdate();
    },
    [setCancelAfter, handleDebounceUpdate]
  );

  const delayOptions = useGetProductsSectionAfterCancelDelayOptions();

  const handleNext = () => {
    if (enableWarehouse.value && !warehouseStore.activeWarehouses.length) {
      warehousesErrorIdle();

      return;
    }

    navigateToNextStep();
  };

  return (
    <BuilderStepTemplate
      canGoBack
      navStore={navStore}
      currentStep={currentStep}
      error={saveError || stepError || warehousesError}
      onSave={onSave}
      onNext={handleNext}
      setStepOrder={setStepOrder}
    >
      <WarehousesBlock
        showSkeleton={Boolean(moduleId)}
        warehouseStore={warehouseStore}
        disabled={!enableWarehouse.value}
      >
        <SwitchWrapper>
          <BuilderStepItemLabel
            label={t('enable_warehouses_label')}
            hint={t('enable_warehouses_hint')}
          />

          <MySwitchWithModel
            model={enableWarehouse}
            label={t('on')}
            onChange={handleDebounceUpdate}
          />
        </SwitchWrapper>

        {enableWarehouse.value && moduleType === ProductsSectionType.SALE && (
          <SelectWrapper>
            <BuilderStepItemLabel label={t('cancel_after_label')} hint={t('cancel_after_hint')} />

            <DelaySelect
              hideMinutes
              titleWidth="240px"
              delay={cancelAfter}
              options={delayOptions}
              intervalInputFullWidth
              maxHeight="fit-content"
              customIntervalColumnVariant
              onChange={handleSetCancelAfter}
            />
          </SelectWrapper>
        )}

        <SwitchWrapper>
          <BuilderStepItemLabel
            label={t('enable_barcodes_label')}
            hint={t('enable_barcodes_hint')}
          />

          <MySwitchWithModel
            model={enableBarcode}
            label={t('on')}
            onChange={handleDebounceUpdate}
          />
        </SwitchWrapper>
      </WarehousesBlock>
    </BuilderStepTemplate>
  );
});

export { ProductsSectionBuilderStep3 };
