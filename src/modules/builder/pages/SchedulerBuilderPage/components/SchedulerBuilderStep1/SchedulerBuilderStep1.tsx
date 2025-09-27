import { useErrorMessageIdle } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { BuilderStepTitle } from '../../../../shared';
import type { BuilderNavStore, SchedulerBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';
import {
  SchedulerBuilderStep1BottomBlock,
  SchedulerBuilderStep1TopBlock,
  SchedulerBuilderStep1TypeBlock,
} from './components';

interface Props {
  loading: boolean;
  navStore: BuilderNavStore;
  sectionBuilderStore: SchedulerBuilderStore;
  saveError?: string;
  onSave?: () => void;
}

const SchedulerBuilderStep1 = observer((props: Props) => {
  const { loading, navStore, sectionBuilderStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.scheduler_builder_step1',
  });

  const { error: stepError, idle: stepErrorIdle } = useErrorMessageIdle(t('error'));

  const { formData, isCreating } = sectionBuilderStore;
  const { navigateToNextStep, getStepByOrder, setStepOrder } = navStore;

  const currentStep = getStepByOrder(1);

  const handleNext = async (): Promise<void> => {
    if (!formData.validate()) {
      stepErrorIdle();

      return;
    }

    navigateToNextStep();
  };

  return (
    <BuilderStepTemplate
      navStore={navStore}
      nextLoading={isCreating}
      currentStep={currentStep}
      error={saveError || stepError}
      dangerousSave={sectionBuilderStore.isDestructiveUpdate}
      onSave={onSave}
      onNext={handleNext}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <SchedulerBuilderStep1TopBlock
        loading={loading}
        sectionBuilderStore={sectionBuilderStore}
        formData={formData}
      />

      <SchedulerBuilderStep1TypeBlock sectionBuilderStore={sectionBuilderStore} />

      <SchedulerBuilderStep1BottomBlock sectionBuilderStore={sectionBuilderStore} />
    </BuilderStepTemplate>
  );
});

export { SchedulerBuilderStep1 };
