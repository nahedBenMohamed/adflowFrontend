import { featureStore } from '@/app';
import { FeatureCode, MyCheckbox, useErrorMessageIdle } from '@/shared';
import { Transition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepCheckboxItemWrapper,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
} from '../../../../shared';
import type { BuilderNavStore, EtSectionBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';
import { TaskFieldsSelector } from '../TaskFieldsSelector/TaskFieldsSelector';

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  sectionBuilderStore: EtSectionBuilderStore;
  navStore: BuilderNavStore;
  saveError?: string;
  onSave?: () => void;
}

const EtSectionBuilderStep3 = observer((props: Props) => {
  const { sectionBuilderStore, navStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.et_section_builder_step3',
  });

  const { getStepByOrder, navigateToNextStep, setStepOrder } = navStore;
  const { data } = sectionBuilderStore;
  const { features } = featureStore;

  const { error: stepError, idle: stepErrorIdle } = useErrorMessageIdle(t('error'));

  const currentStep = getStepByOrder(3);

  const { taskSettingsActiveFields, featureCodes, setFeatureCodes, setTaskSettingsActiveFields } =
    data;

  const showTaskFieldsSelector = data.featureCodes.includes(FeatureCode.TASK);

  const onNext = () => {
    const validate = () => {
      if (!featureCodes.length) {
        stepErrorIdle();

        return false;
      }

      return true;
    };

    if (!validate()) return;

    navigateToNextStep();
  };

  const handleCheckboxChange = (value: FeatureCode) => {
    if (featureCodes.includes(value)) {
      setFeatureCodes(featureCodes.filter(o => o !== value));
    } else {
      setFeatureCodes([...featureCodes, value]);
    }
  };

  return (
    <BuilderStepTemplate
      canGoBack
      navStore={navStore}
      currentStep={currentStep}
      error={saveError || stepError}
      onNext={onNext}
      onSave={onSave}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <FeatureList>
          {features.map((f, idx) => (
            <FeatureWrapper key={f.id}>
              <BuilderStepCheckboxItemWrapper key={idx}>
                <MyCheckbox
                  checked={data.featureCodes.includes(f.code)}
                  onChange={() => handleCheckboxChange(f.code)}
                />

                {t(`features.${f.code}`)}
              </BuilderStepCheckboxItemWrapper>

              <Transition
                transition="pop-top-left"
                mounted={f.code === FeatureCode.TASK && showTaskFieldsSelector}
              >
                {transitionStyles => (
                  <FeatureList style={{ ...transitionStyles }}>
                    <TaskFieldsSelector
                      activeFields={taskSettingsActiveFields}
                      onChange={setTaskSettingsActiveFields}
                    />
                  </FeatureList>
                )}
              </Transition>
            </FeatureWrapper>
          ))}
        </FeatureList>
      </BuilderStepOutlinedSection>
    </BuilderStepTemplate>
  );
});

export { EtSectionBuilderStep3 };
