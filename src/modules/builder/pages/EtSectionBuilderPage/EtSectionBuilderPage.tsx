import { appStore, routes } from '@/app';
import { invalidateProductsSections } from '@/modules/products';
import {
  CommonQueryParams,
  SectionView,
  useErrorMessageIdle,
  useScrollWindowToTop,
  useTitle,
  useTypedParams,
  validateForm,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BuilderTabs,
  EntityTypeUsedInFormulaWarningModal,
  generateEtSectionBuilderNavSteps,
  type BuilderNavStep,
  type ModuleCategory,
} from '../../shared';
import { BuilderNavStore, EtSectionBuilderStore } from '../../store';
import { BuilderWithVerticalNavPageTemplate } from '../../templates';
import {
  EtSectionBuilderStep1,
  EtSectionBuilderStep2,
  EtSectionBuilderStep3,
  EtSectionBuilderStep4,
} from './components';

const EtSectionBuilderPage = observer(() => {
  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.steps',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [
    entityTypeUsedInFormulaWarningShown,
    { open: showEntityTypeUsedInFormulaWarning, close: hideEntityTypeUsedInFormulaWarning },
  ] = useDisclosure(false);

  useScrollWindowToTop();

  const moduleCategory = searchParams.get(CommonQueryParams.CATEGORY);

  const { error: saveError, idle: saveErrorIdle } = useErrorMessageIdle(t('save_error'));

  const entityTypeSectionBuilderStore = useMemo(
    () =>
      new EtSectionBuilderStore({
        analyticsGroupName: t('analytics'),
        entityTypeId: moduleId ?? null,
        showEntityTypeUsedInFormulaWarning,
        moduleCategory: moduleCategory ? (moduleCategory as ModuleCategory) : null,
        t,
      }),
    [moduleId, moduleCategory, showEntityTypeUsedInFormulaWarning, t]
  );

  const entityTypeBuilderNavSteps = useMemo<BuilderNavStep[]>(
    () => generateEtSectionBuilderNavSteps(t),
    [t]
  );
  const entityTypeBuilderNavStore = useMemo(
    () => new BuilderNavStore(entityTypeBuilderNavSteps),
    [entityTypeBuilderNavSteps]
  );

  const {
    data,
    isLoaded,
    isCreatingFinalEntityType,
    loadData,
    isEditMode,
    initSection,
    makeFinalEntityType,
  } = entityTypeSectionBuilderStore;

  const sectionName = entityTypeSectionBuilderStore.data.sectionName.value;

  // this way we know that data is loaded and we can use sectionName in the title
  useTitle({
    titleTranslationKey: moduleCategory ? `builder.${moduleCategory}` : undefined,
    dynamicTitle: moduleCategory
      ? undefined
      : sectionName
        ? `${entityTypeSectionBuilderStore.data.sectionName.value} | ${t('default_titles.builder')}`
        : undefined,
  });

  useLayoutEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        initSection(t);

        if (moduleId) loadData(moduleId);
      }
    );
  }, [moduleId, loadData, initSection, t]);

  const editMode = isEditMode();

  const handleSave = useCallback(async (): Promise<void> => {
    if (!validateForm(data)) {
      saveErrorIdle();

      return;
    }

    const et = await makeFinalEntityType();
    const etId = et.id;

    if (editMode) {
      navigate(routes.builder(BuilderTabs.WORKSPACE));
    } else if (et.section.view === SectionView.BOARD) {
      navigate(routes.boardSection({ entityTypeId: etId }));
    } else {
      navigate(routes.listSection(etId));
    }

    invalidateProductsSections();
  }, [data, editMode, saveErrorIdle, makeFinalEntityType, navigate]);

  const loading = Boolean(moduleId && appStore.isLoaded && !isLoaded) || isCreatingFinalEntityType;

  return (
    <BuilderWithVerticalNavPageTemplate loading={loading} navStore={entityTypeBuilderNavStore}>
      <EtSectionBuilderStep1
        loading={loading}
        saveError={saveError}
        navStore={entityTypeBuilderNavStore}
        sectionBuilderStore={entityTypeSectionBuilderStore}
        onSave={editMode ? handleSave : undefined}
      />

      <EtSectionBuilderStep2
        saveError={saveError}
        navStore={entityTypeBuilderNavStore}
        sectionBuilderStore={entityTypeSectionBuilderStore}
        onSave={editMode ? handleSave : undefined}
      />

      <EtSectionBuilderStep3
        saveError={saveError}
        navStore={entityTypeBuilderNavStore}
        sectionBuilderStore={entityTypeSectionBuilderStore}
        onSave={editMode ? handleSave : undefined}
      />

      <EtSectionBuilderStep4
        saveError={saveError}
        navStore={entityTypeBuilderNavStore}
        sectionBuilderStore={entityTypeSectionBuilderStore}
        onSave={handleSave}
      />

      {entityTypeUsedInFormulaWarningShown && (
        <EntityTypeUsedInFormulaWarningModal
          opened={entityTypeUsedInFormulaWarningShown}
          onClose={hideEntityTypeUsedInFormulaWarning}
        />
      )}
    </BuilderWithVerticalNavPageTemplate>
  );
});

EtSectionBuilderPage.displayName = 'EtSectionBuilderPage';
export { EtSectionBuilderPage };
