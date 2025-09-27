import { appStore, entityTypeStore, routes } from '@/app';
import { invalidateProductsSections } from '@/modules/products';
import {
  SectionView,
  useErrorMessageIdle,
  useScrollWindowToTop,
  useTitle,
  useTypedParams,
  type Optional,
} from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BuilderTabs, generateSchedulerBuilderNavSteps, type BuilderNavStep } from '../../shared';
import { BuilderNavStore, SchedulerBuilderStore } from '../../store';
import { BuilderWithVerticalNavPageTemplate } from '../../templates';
import { SchedulerBuilderStep1, SchedulerBuilderStep2, SchedulerBuilderStep3 } from './components';

const SchedulerBuilderPage = observer(() => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.steps',
  });

  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const navigate = useNavigate();

  useScrollWindowToTop();

  const { error: saveError, idle: saveErrorIdle } = useErrorMessageIdle(t('save_error'));

  const schedulerBuilderStore = useMemo(() => new SchedulerBuilderStore(t('default_title')), [t]);

  const schedulerBuilderNavSteps = useMemo<BuilderNavStep[]>(
    () => generateSchedulerBuilderNavSteps(t),
    [t]
  );
  const schedulerBuilderNavStore = useMemo(
    () => new BuilderNavStore(schedulerBuilderNavSteps),
    [schedulerBuilderNavSteps]
  );

  const { isLoaded, schedule, formData, loadData, createSchedule, updateSchedule } =
    schedulerBuilderStore;

  useTitle({
    titleTranslationKey: schedule ? undefined : 'builder.scheduler',
    dynamicTitle: schedule ? `${schedule.name} | ${t('default_title')}` : undefined,
  });

  useLayoutEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        if (moduleId) loadData(moduleId);
      }
    );
  }, [moduleId, loadData]);

  const handleSave = useCallback(async () => {
    if (!formData.validate()) {
      saveErrorIdle();

      return;
    }

    if (!schedule) {
      const newSchedule = await createSchedule(formData.createScheduleDto);

      navigate(
        routes.scheduler({
          scheduleId: newSchedule.id,
          tab: SectionView.OVERVIEW,
          scheduleType: newSchedule.type,
        })
      );
    } else if (moduleId) {
      await updateSchedule({ moduleId, dto: formData.updateScheduleDto });

      navigate(routes.builder(BuilderTabs.WORKSPACE));

      invalidateProductsSections();
      entityTypeStore.invalidateEntityTypesInCache();
    } else {
      throw new Error(
        `Failed to create or update schedule, not moduleId nor schedule was provided`
      );
    }
  }, [formData, moduleId, schedule, saveErrorIdle, createSchedule, navigate, updateSchedule]);

  const loading = Boolean(moduleId && appStore.isLoaded && !isLoaded);

  return (
    <BuilderWithVerticalNavPageTemplate loading={loading} navStore={schedulerBuilderNavStore}>
      <SchedulerBuilderStep1
        loading={loading}
        saveError={saveError}
        navStore={schedulerBuilderNavStore}
        sectionBuilderStore={schedulerBuilderStore}
        onSave={moduleId ? handleSave : undefined}
      />

      <SchedulerBuilderStep2
        saveError={saveError}
        navStore={schedulerBuilderNavStore}
        sectionBuilderStore={schedulerBuilderStore}
        onSave={moduleId ? handleSave : undefined}
      />

      <SchedulerBuilderStep3
        saveError={saveError}
        navStore={schedulerBuilderNavStore}
        sectionBuilderStore={schedulerBuilderStore}
        onSave={handleSave}
      />
    </BuilderWithVerticalNavPageTemplate>
  );
});

SchedulerBuilderPage.displayName = 'SchedulerBuilderPage';
export { SchedulerBuilderPage };
