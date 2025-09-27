import {
  EditFieldsTab,
  PROJECT_FIELDS_CODES,
  ProjectFieldsSettings,
  ProjectFieldsSettingsComponent,
  type FieldCode,
} from '@/modules/fields';
import { EntityCategory, MyInput, Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
} from '../../../../shared';
import type { BuilderNavStore, EtSectionBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const StepItemWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EditFieldsTabWrapper = styled(BuilderStepOutlinedSection)`
  border: none;

  width: 90%;

  background-color: var(--graphite-graphite-20);
`;

const ProjectFieldsWrapper = styled(BuilderStepOutlinedSection)`
  width: fit-content;

  flex-direction: column;
`;

interface Props {
  sectionBuilderStore: EtSectionBuilderStore;
  navStore: BuilderNavStore;
  saveError?: string;
  onSave?: () => void;
}

const EtSectionBuilderStep2 = observer((props: Props) => {
  const { sectionBuilderStore: sectionStore, navStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.et_section_builder_step2',
  });

  const { getStepByOrder, navigateToNextStep, setStepOrder } = navStore;
  const { data, entityCategory, currentEntityTypeId, isEditMode } = sectionStore;

  const currentStep = getStepByOrder(2);

  const { entityName, fieldsSettings, fieldsStore, fieldGroupsStore, setFieldsSettings } = data;

  const onNext = useCallback(() => {
    const validate = (): boolean =>
      fieldsStore.validate() && fieldGroupsStore.validate() && entityName.validate();

    if (!validate()) return;

    navigateToNextStep();
  }, [entityName, fieldGroupsStore, fieldsStore, navigateToNextStep]);

  const handleChangeTab = useCallback(
    (key: Nullable<string>) => fieldGroupsStore.changeActiveTab(key),
    [fieldGroupsStore]
  );

  useLayoutEffect(() => {
    if (currentEntityTypeId === null && entityCategory === EntityCategory.PROJECT)
      setFieldsSettings(new ProjectFieldsSettings(PROJECT_FIELDS_CODES as FieldCode[]));
  }, [currentEntityTypeId, entityCategory, setFieldsSettings]);

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      currentStep={currentStep}
      onNext={onNext}
      onSave={onSave}
      setStepOrder={setStepOrder}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <StepItemWrapper>
          <BuilderStepItemLabel label={t('name_the_card')} hint={t('name_the_card_hint')} />

          <MyInput
            width="304px"
            variant="outlined"
            whitespaceClearing
            model={entityName}
            autoFocus={!isEditMode()}
            placeholder={t('placeholders.card_name')}
          />
        </StepItemWrapper>
      </BuilderStepOutlinedSection>

      {entityCategory === EntityCategory.PROJECT && (
        <>
          <BuilderStepTitle>{t('fine_tuning')}</BuilderStepTitle>

          <ProjectFieldsWrapper>
            <ProjectFieldsSettingsComponent
              activeProjectFieldCodes={fieldsSettings.activeFieldCodes}
              onChange={setFieldsSettings}
            />
          </ProjectFieldsWrapper>
        </>
      )}

      <BuilderStepOutlinedSection>
        <StepItemWrapper>
          <BuilderStepItemLabel label={t('create_fields')} hint={t('create_fields_hint')} />

          <EditFieldsTabWrapper>
            <EditFieldsTab
              showEditButton={false}
              fieldsStore={fieldsStore}
              entityTypeId={currentEntityTypeId}
              fieldGroupsStore={fieldGroupsStore}
              handleChangeTab={handleChangeTab}
            />
          </EditFieldsTabWrapper>
        </StepItemWrapper>
      </BuilderStepOutlinedSection>
    </BuilderStepTemplate>
  );
});

export { EtSectionBuilderStep2 };
