import { entityTypeStore } from '@/app';
import {
  ProductsSectionType,
  type ProductsSectionBuilderStore,
  type WarehouseStore,
} from '@/modules/products';
import { useGetSchedules } from '@/modules/scheduler';
import { MyCheckbox, debounce, type Nullable, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepCheckboxItemWrapper,
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  NoLinksBlock,
} from '../../../../shared';
import type { BuilderNavStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface Props {
  navStore: BuilderNavStore;
  moduleType: ProductsSectionType;
  warehouseStore: Nullable<WarehouseStore>;
  sectionBuilderStore: ProductsSectionBuilderStore;
  saveError?: string;
  onSave: () => void;
}

const ProductsSectionBuilderLinkSectionsStep = observer((props: Props) => {
  const { navStore, moduleType, sectionBuilderStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.products_section_builder_page.products_section_builder_link_sections_step',
  });

  const { data: schedulers, isLoading: areSchedulesLoading } = useGetSchedules();

  const { getStepByOrder, setStepOrder } = navStore;
  const {
    productsSection,
    sectionFormData: formData,
    updateProductsSectionLinks,
  } = sectionBuilderStore;

  const currentStep = getStepByOrder(moduleType === ProductsSectionType.SALE ? 4 : 5);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedUpdate = useCallback(
    debounce(() => {
      if (!productsSection) return;

      updateProductsSectionLinks({
        id: productsSection.id,
        entityTypeIds: formData.entityTypeIds,
        schedulerIds: formData.schedulerIds,
      });
    }, 500),
    [productsSection, productsSection, formData, updateProductsSectionLinks]
  );

  const { entityTypeIds, schedulerIds } = formData;

  const handleCheckboxChange = (value: number) => {
    let options: number[] = [];

    if (entityTypeIds.includes(value)) {
      options = entityTypeIds.filter(id => id !== value);
    } else {
      options = [...entityTypeIds, value];
    }

    formData.setEntityTypeIds(options);
    handleDebouncedUpdate();
  };

  const handleSchedulersCheckboxChange = (value: number) => {
    let options: number[] = [];

    if (schedulerIds.includes(value)) {
      options = schedulerIds.filter(id => id !== value);
    } else {
      options = [...schedulerIds, value];
    }

    formData.setSchedulerIds(options);
    handleDebouncedUpdate();
  };

  const options = entityTypeStore.entityTypes.map<Option<number>>(et => ({
    label: et.name,
    value: et.id,
  }));

  const schedulesOptions =
    schedulers?.map<Option<number>>(s => ({ label: s.name, value: s.id })) ?? [];

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      currentStep={currentStep}
      setStepOrder={setStepOrder}
      onSave={onSave}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <CheckboxList>
          <BuilderStepItemLabel label={t('cards')} />

          {options.length > 0 ? (
            options.map(o => (
              <BuilderStepCheckboxItemWrapper key={o.value}>
                <MyCheckbox
                  checked={entityTypeIds.includes(o.value)}
                  onChange={() => handleCheckboxChange(o.value)}
                />

                {entityTypeStore.getById(o.value).section.name}
              </BuilderStepCheckboxItemWrapper>
            ))
          ) : (
            <NoLinksBlock />
          )}
        </CheckboxList>
      </BuilderStepOutlinedSection>

      {moduleType === ProductsSectionType.SALE && (
        <BuilderStepOutlinedSection $loading={areSchedulesLoading}>
          <CheckboxList>
            <BuilderStepItemLabel label={t('schedulers')} />

            {schedulesOptions.length > 0 ? (
              schedulesOptions.map(o => (
                <BuilderStepCheckboxItemWrapper key={o.value}>
                  <MyCheckbox
                    checked={formData.schedulerIds.includes(o.value)}
                    onChange={() => handleSchedulersCheckboxChange(o.value)}
                  />

                  {o.label}
                </BuilderStepCheckboxItemWrapper>
              ))
            ) : (
              <NoLinksBlock />
            )}
          </CheckboxList>
        </BuilderStepOutlinedSection>
      )}
    </BuilderStepTemplate>
  );
});

export { ProductsSectionBuilderLinkSectionsStep };
