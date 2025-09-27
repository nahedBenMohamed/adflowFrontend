import type { ProductsSectionBuilderStore } from '@/modules/products';
import { MySelect, debounce } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  generateRentalIntervalStartTimeOptions,
  generateRentalIntervalTypeOptions,
} from '../../../../shared';
import type { BuilderNavStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates/BuilderStepTemplate/BuilderStepTemplate';

const ContentWrapper = styled(BuilderStepOutlinedSection)`
  align-items: center;
`;

const FormItemWrapper = styled.div`
  flex: 0.5;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  navStore: BuilderNavStore;
  sectionBuilderStore: ProductsSectionBuilderStore;
  saveError?: string;
  onSave?: () => void;
}

const MAX_SELECT_WIDTH = '320px';

const ProductsSectionBuilderScheduleSettings = observer((props: Props) => {
  const { navStore, sectionBuilderStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.products_section_builder_page.products_section_builder_schedule_settings_step',
  });

  const { getStepByOrder, navigateToNextStep, setStepOrder } = navStore;
  const {
    productsSection,
    rentalInterval,
    isCreatingInterval,
    rentalIntervalFormData: formData,
    createProductsSectionRentalInterval,
  } = sectionBuilderStore;

  const currentStep = getStepByOrder(4);

  const rentalIntervalTypeOptions = useMemo(() => generateRentalIntervalTypeOptions(t), [t]);
  const rentalIntervalStartTimeOptions = useMemo(
    () => generateRentalIntervalStartTimeOptions(),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebounceUpdate = useCallback(
    debounce(async (): Promise<void> => {
      if (!rentalInterval || !productsSection || !formData.validate()) return;

      await createProductsSectionRentalInterval(productsSection.id, formData.rentalIntervalDto);
    }, 500),
    [productsSection, rentalInterval]
  );

  const handleNext = async (): Promise<void> => {
    if (!formData.validate() || !productsSection) return;

    if (!rentalInterval)
      await createProductsSectionRentalInterval(productsSection.id, formData.rentalIntervalDto);

    navigateToNextStep();
  };

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      currentStep={currentStep}
      nextLoading={isCreatingInterval}
      onSave={onSave}
      onNext={handleNext}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>
      <ContentWrapper>
        <FormItemWrapper>
          <BuilderStepItemLabel
            label={t('rental_duration_interval')}
            hint={t('rental_duration_interval_hint')}
          />

          <MySelect
            variant="outlined"
            model={formData.type}
            maxWidth={MAX_SELECT_WIDTH}
            options={rentalIntervalTypeOptions}
            handleChange={handleDebounceUpdate}
          />
        </FormItemWrapper>

        <FormItemWrapper>
          <BuilderStepItemLabel
            label={t('start_of_rental_interval')}
            hint={t('start_of_rental_interval_hint')}
          />

          <MySelect
            variant="outlined"
            model={formData.startTime}
            maxWidth={MAX_SELECT_WIDTH}
            options={rentalIntervalStartTimeOptions}
            handleChange={handleDebounceUpdate}
          />
        </FormItemWrapper>
      </ContentWrapper>
    </BuilderStepTemplate>
  );
});

export { ProductsSectionBuilderScheduleSettings };
