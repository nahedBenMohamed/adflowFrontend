import { ProductsSectionType, useGetProductsSections } from '@/modules/products';
import { MyRadio } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  LinkRadiosDelimiter,
  LinkRadiosWrapper,
  NO_LINK_RADIO_VALUE,
  NoLinksBlock,
  RadioWrapper,
  RadiosSkeleton,
} from '../../../../shared';
import type { BuilderNavStore, SchedulerBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

interface Props {
  navStore: BuilderNavStore;
  sectionBuilderStore: SchedulerBuilderStore;
  saveError?: string;
  onSave: () => void;
}

const SchedulerBuilderStep3 = observer((props: Props) => {
  const { navStore, sectionBuilderStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.scheduler_builder_step3',
  });

  const { data: productsSections, isLoading: areProductsSectionsLoading } =
    useGetProductsSections();

  const { formData, isCreating } = sectionBuilderStore;
  const { getStepByOrder, setStepOrder } = navStore;

  const currentStep = getStepByOrder(3);

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      saveLoading={isCreating}
      currentStep={currentStep}
      dangerousSave={sectionBuilderStore.isDestructiveUpdate}
      setStepOrder={setStepOrder}
      onSave={onSave}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <LinkRadiosWrapper>
          {areProductsSectionsLoading ? (
            <RadiosSkeleton />
          ) : (
            productsSections &&
            (productsSections.length > 0 ? (
              productsSections
                .filter(ps => ps.type === ProductsSectionType.SALE)
                .map(ps => (
                  <RadioWrapper key={ps.id}>
                    <MyRadio value={String(ps.id)} model={formData.productsSectionId} />

                    {ps.name}
                  </RadioWrapper>
                ))
            ) : (
              <NoLinksBlock />
            ))
          )}

          <LinkRadiosDelimiter />

          <RadioWrapper $grayLabel>
            <MyRadio value={NO_LINK_RADIO_VALUE} model={formData.productsSectionId} />

            {t('do_not_integrate')}
          </RadioWrapper>
        </LinkRadiosWrapper>
      </BuilderStepOutlinedSection>
    </BuilderStepTemplate>
  );
});

export { SchedulerBuilderStep3 };
