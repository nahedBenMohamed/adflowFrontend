import { entityTypeStore } from '@/app';
import { MyCheckboxWithBooleanModel, MyRadio } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  LinkRadiosDelimiter,
  LinkRadiosWrapper,
  NO_LINK_RADIO_VALUE,
  NoLinksBlock,
  RadioWrapper,
} from '../../../../shared';
import type { BuilderNavStore, SchedulerBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  navStore: BuilderNavStore;
  sectionBuilderStore: SchedulerBuilderStore;
  saveError?: string;
  onSave?: () => void;
}

const SchedulerBuilderStep2 = observer((props: Props) => {
  const { navStore, sectionBuilderStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.scheduler_builder_step2',
  });

  const { formData, isCreating } = sectionBuilderStore;
  const { navigateToNextStep, getStepByOrder, setStepOrder } = navStore;

  const currentStep = getStepByOrder(2);

  const handleNext = () => {
    navigateToNextStep();
  };

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      nextLoading={isCreating}
      currentStep={currentStep}
      dangerousSave={sectionBuilderStore.isDestructiveUpdate}
      onSave={onSave}
      onNext={handleNext}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <CheckboxWrapper>
          <MyCheckboxWithBooleanModel model={formData.oneEntityPerDay} />

          <BuilderStepItemLabel label={t('duplicate_title')} hint={t('duplicate_hint')} />
        </CheckboxWrapper>
      </BuilderStepOutlinedSection>

      <BuilderStepOutlinedSection>
        <LinkRadiosWrapper>
          {entityTypeStore.entityTypesOptions.length > 0 ? (
            entityTypeStore.entityTypesOptions.map(o => (
              <RadioWrapper key={o.value}>
                <MyRadio value={String(o.value)} model={formData.entityTypeId} />

                {o.label}
              </RadioWrapper>
            ))
          ) : (
            <NoLinksBlock />
          )}

          <LinkRadiosDelimiter />

          <RadioWrapper $grayLabel>
            <MyRadio value={NO_LINK_RADIO_VALUE} model={formData.entityTypeId} />

            {t('do_not_link')}
          </RadioWrapper>
        </LinkRadiosWrapper>
      </BuilderStepOutlinedSection>
    </BuilderStepTemplate>
  );
});

export { SchedulerBuilderStep2 };
