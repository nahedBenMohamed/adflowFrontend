import { iconStore } from '@/app';
import type { ProductsSectionBuilderStore } from '@/modules/products';
import { MyInput, debounce, useErrorMessageIdle, useToggleControl, type Icon } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  NameInputSkeleton,
  SectionIconPicker,
} from '../../../../shared';
import type { BuilderNavStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const FormItemWrapper = styled.div`
  flex: 0.5;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  loading: boolean;
  navStore: BuilderNavStore;
  sectionBuilderStore: ProductsSectionBuilderStore;
  saveError?: string;
  onSave?: () => void;
}

const ProductsSectionBuilderStep1 = observer((props: Props) => {
  const { loading, navStore, sectionBuilderStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.products_section_builder_page.product_section_builder_step1',
  });

  const { error: stepError, idle: stepErrorIdle } = useErrorMessageIdle(t('error'));

  const { icons } = iconStore;
  const { navigateToNextStep, getStepByOrder, setStepOrder } = navStore;
  const {
    productsSection,
    isCreatingSection,
    sectionFormData: formData,
    createProductsSection,
    updateProductsSection,
  } = sectionBuilderStore;

  const iconsDropdownControl = useToggleControl(false);

  const currentStep = getStepByOrder(1);

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

  const handleChangeIcon = useCallback(
    (icon: Icon) => {
      formData.setIcon(icon);
      iconsDropdownControl.close();

      handleDebounceUpdate();
    },
    [formData, iconsDropdownControl, handleDebounceUpdate]
  );

  const handleNext = async (): Promise<void> => {
    if (!formData.validate()) {
      stepErrorIdle();

      return;
    }

    if (!productsSection) await createProductsSection(formData.createProductsSectionDto);

    navigateToNextStep();
  };

  return (
    <BuilderStepTemplate
      navStore={navStore}
      currentStep={currentStep}
      error={saveError || stepError}
      nextLoading={isCreatingSection}
      onSave={onSave}
      onNext={handleNext}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <FormItemWrapper>
          <BuilderStepItemLabel label={t('name_the_section')} hint={t('name_the_section_hint')} />

          {loading ? (
            <NameInputSkeleton $delay={0} />
          ) : (
            <MyInput
              autoFocus
              width="70%"
              variant="outlined"
              model={formData.name}
              whitespaceClearing
              placeholder={t('placeholders.section_name')}
              handleChange={handleDebounceUpdate}
            />
          )}
        </FormItemWrapper>

        <FormItemWrapper>
          <BuilderStepItemLabel label={t('choose_icon')} hint={t('choose_icon_hint')} />

          <SectionIconPicker
            icons={icons}
            moduleColor={iconStore.productsColor}
            selectedIcon={formData.icon}
            opened={iconsDropdownControl.active}
            chooseIcon={handleChangeIcon}
            show={iconsDropdownControl.open}
            hide={iconsDropdownControl.close}
          />
        </FormItemWrapper>
      </BuilderStepOutlinedSection>
    </BuilderStepTemplate>
  );
});

export { ProductsSectionBuilderStep1 };
