import { iconStore } from '@/app';
import { MyCheckboxWithModel, MyInput, SectionView, envUtil, type Icon } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  BuilderStepCheckboxItemWrapper,
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  LoadableSectionImage,
  NameInputSkeleton,
  SectionIconPicker,
} from '../../../../shared';
import type { BuilderNavStore, EtSectionBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const StepItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopBlockItemWrapper = styled(StepItemWrapper)`
  flex: 0.5;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const ElementWithImage = styled.label<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.8;
    `}
`;

interface Props {
  loading: boolean;
  sectionBuilderStore: EtSectionBuilderStore;
  navStore: BuilderNavStore;
  saveError?: string;
  onSave?: () => void;
}

const NAME_INPUT_WIDTH = '304px';

const EtSectionBuilderStep1 = observer((props: Props) => {
  const { loading, sectionBuilderStore, navStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.et_section_builder_step1',
  });

  const { getStepByOrder, navigateToNextStep, setStepOrder } = navStore;
  const { sectionName, sectionView, sectionIcon, setSectionIcon } = sectionBuilderStore.data;

  const [opened, { close, open }] = useDisclosure(false);

  const currentStep = getStepByOrder(1);

  const isEditMode = sectionBuilderStore.isEditMode();

  const icons = iconStore.icons;
  const selectedIcon = iconStore.getByName(sectionIcon) ?? icons[0];

  const handleChangeIcon = (icon: Icon) => {
    setSectionIcon(icon.name);

    close();
  };

  const onNext = () => {
    const validate = (): boolean =>
      sectionName.validate() && sectionView.validate() && sectionView.values.length > 0;

    if (!validate()) return;

    navigateToNextStep();
  };

  return (
    <BuilderStepTemplate
      error={saveError}
      navStore={navStore}
      currentStep={currentStep}
      onNext={onNext}
      onSave={onSave}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <TopBlockItemWrapper>
          <BuilderStepItemLabel label={t('name_the_section')} hint={t('name_the_section_hint')} />

          {loading ? (
            <NameInputSkeleton $delay={0} $width={NAME_INPUT_WIDTH} />
          ) : (
            <MyInput
              autoFocus
              variant="outlined"
              whitespaceClearing
              model={sectionName}
              width={NAME_INPUT_WIDTH}
              placeholder={t('placeholders.section_name')}
            />
          )}
        </TopBlockItemWrapper>

        <TopBlockItemWrapper>
          <BuilderStepItemLabel label={t('choose_icon')} hint={t('choose_icon_hint')} />

          <SectionIconPicker
            icons={icons}
            opened={opened}
            moduleColor={
              sectionBuilderStore.entityCategory
                ? iconStore.getEntityColorByEntityCategory(sectionBuilderStore.entityCategory)
                : iconStore.defaultModuleColor
            }
            selectedIcon={selectedIcon}
            hide={close}
            show={open}
            chooseIcon={handleChangeIcon}
          />
        </TopBlockItemWrapper>
      </BuilderStepOutlinedSection>

      <BuilderStepOutlinedSection>
        <StepItemWrapper>
          <BuilderStepItemLabel label={t('type_of_display')} hint={t('type_of_display_hint')} />

          <CheckboxGroup>
            <ElementWithImage $disabled={isEditMode}>
              <BuilderStepCheckboxItemWrapper>
                <MyCheckboxWithModel
                  model={sectionView}
                  disabled={isEditMode}
                  value={SectionView.BOARD}
                />
                {t('board')}
              </BuilderStepCheckboxItemWrapper>

              <LoadableSectionImage
                alt={t('board_img_alt', { company: envUtil.appName })}
                src="/images/builder/deals-view/board.png"
              />
            </ElementWithImage>

            <ElementWithImage $disabled={isEditMode}>
              <BuilderStepCheckboxItemWrapper>
                <MyCheckboxWithModel
                  model={sectionView}
                  disabled={isEditMode}
                  value={SectionView.LIST}
                />
                {t('list')}
              </BuilderStepCheckboxItemWrapper>

              <LoadableSectionImage
                alt={t('list_img_alt', { company: envUtil.appName })}
                src="/images/builder/deals-view/list.png"
              />
            </ElementWithImage>
          </CheckboxGroup>
        </StepItemWrapper>
      </BuilderStepOutlinedSection>
    </BuilderStepTemplate>
  );
});

export { EtSectionBuilderStep1 };
