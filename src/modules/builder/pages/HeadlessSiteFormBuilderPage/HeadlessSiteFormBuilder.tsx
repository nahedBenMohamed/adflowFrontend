import { appStore, routes } from '@/app';
import {
  useErrorMessageIdle,
  useTitle,
  useTypedParams,
  type Nullable,
  type Optional,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  BuilderStepControls,
  BuilderTabs,
  generateHeadlessSiteFormBuilderNavSteps,
  HorizontalStepMotion,
  type BuilderNavStep,
  type BuilderStepControlsButtonProps,
  type BuilderStepControlsSaveButtonProps,
  type HorizontalStepMotionDirection,
} from '../../shared';
import { BuilderNavStore, HeadlessSiteFormBuilderStore } from '../../store';
import { BuilderWithHorizontalNavPageTemplate } from '../../templates';
import { SiteFormBuilderStep1 } from '../SiteFormBuilderPage/components';
import { HeadlessSiteFormBuilderStep2, HeadlessSiteFormBuilderStep3 } from './components';

const Root = styled.div<{ $withoutPadding?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;

  padding-bottom: ${p =>
    p.$withoutPadding ? 'none' : 'var(--fixed-builder-step-controls-height)'};
`;

const HeadlessSiteFormBuilder = observer(() => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.headless_site_form_builder_page.steps',
  });

  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const navigate = useNavigate();

  const prevStepOrder = useRef<Nullable<number>>(null);

  const siteFormBuilderStore = useMemo(
    () => new HeadlessSiteFormBuilderStore({ defaultTitle: t('default_title') }),
    [t]
  );

  const siteFormBuilderNavSteps = useMemo<BuilderNavStep[]>(
    () => generateHeadlessSiteFormBuilderNavSteps(t),
    [t]
  );
  const siteFormBuilderNavStore = useMemo(
    () => new BuilderNavStore(siteFormBuilderNavSteps),
    [siteFormBuilderNavSteps]
  );

  const {
    isLoaded,
    siteForm,
    isLoading,
    isCreatingOrUpdating,
    siteFormElementsFormData,
    siteFormInitializationFormData,
    loadData,
    createSiteForm,
    updateSiteForm,
  } = siteFormBuilderStore;
  const {
    isCurrentStepLast,
    isCurrentStepFirst,
    stepOrder: activeStepOrder,
    setStepOrder,
    navigateToNextStep,
    navigateToPreviousStep,
  } = siteFormBuilderNavStore;

  useLayoutEffect(() => {
    // we need this check becase store has appStore.isLoaded as a dependency
    // to prevent multiple loads
    if (isLoaded || isLoading) return;

    if (moduleId && appStore.isLoaded) loadData(moduleId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, isLoaded, isLoading, appStore.isLoaded, loadData]);

  useTitle({
    titleTranslationKey: siteForm?.name ? undefined : 'builder.site_form',
    dynamicTitle: siteForm?.name ? `${siteForm.name}` : undefined,
  });

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    prevStepOrder.current = activeStepOrder;
  }, [activeStepOrder]);

  const { error: commonError, idle: commonErrorIdle } = useErrorMessageIdle(t('common_error'));
  const { error: firstStepError, idle: firstStepErrorIdle } = useErrorMessageIdle(t('step1.error'));

  // silentUpdate -> isUpdating flag is not mutated

  const handleSave = useCallback(
    async ({ silentUpdate }: { silentUpdate: boolean }): Promise<void> => {
      if (!siteFormInitializationFormData.validate()) {
        firstStepErrorIdle();

        setStepOrder(1);

        return;
      }

      if (siteForm) {
        await updateSiteForm({ silentUpdate });
      } else {
        await createSiteForm();
      }
    },
    [
      siteForm,
      siteFormInitializationFormData,
      setStepOrder,
      updateSiteForm,
      createSiteForm,
      firstStepErrorIdle,
    ]
  );

  const handleSaveAndLeave = useCallback(async (): Promise<void> => {
    await handleSave({ silentUpdate: false });

    navigate(routes.builder(BuilderTabs.WORKSPACE));
  }, [handleSave, navigate]);

  const handleNavigateToNextStep = useCallback(() => {
    const firstStepValidationError =
      activeStepOrder === 1 && !siteFormInitializationFormData.validate();

    if (firstStepValidationError) {
      commonErrorIdle();

      return;
    }

    navigateToNextStep();
  }, [activeStepOrder, siteFormInitializationFormData, commonErrorIdle, navigateToNextStep]);

  const motionDirection = useMemo<HorizontalStepMotionDirection>(
    () =>
      prevStepOrder.current === null
        ? 'none'
        : activeStepOrder > prevStepOrder.current
          ? 'right'
          : 'left',
    [activeStepOrder, prevStepOrder]
  );

  const stepError = useMemo<Optional<string>>(
    () => commonError || firstStepError,
    [commonError, firstStepError]
  );

  const nextProps = useMemo<Optional<BuilderStepControlsButtonProps>>(() => {
    // nowhere to go forward
    if (isCurrentStepLast) return;

    // we need to save form if it's not already exists on 2rd -> 3th step transition so that
    // we can preview it on the fourth step (we can preview only existing forms)
    if (activeStepOrder === 2 && !siteForm)
      return {
        onClick: async (): Promise<void> => {
          await handleSave({ silentUpdate: false });

          handleNavigateToNextStep();
        },
      };

    return {
      onClick: handleNavigateToNextStep,
    };
  }, [siteForm, activeStepOrder, isCurrentStepLast, handleSave, handleNavigateToNextStep]);

  const backProps = useMemo<Optional<BuilderStepControlsButtonProps>>(() => {
    // nowhere to go back
    if (isCurrentStepFirst) return;

    return {
      onClick: navigateToPreviousStep,
    };
  }, [isCurrentStepFirst, navigateToPreviousStep]);

  const saveProps = useMemo<Optional<BuilderStepControlsSaveButtonProps>>(() => {
    // if there is no siteForm it means that we are on 1-3 step and we not yet have a created form
    if (!siteForm) return;

    return {
      onClick: () => handleSave({ silentUpdate: false }),
    };
  }, [siteForm, handleSave]);

  const saveAndLeaveProps = useMemo<Optional<BuilderStepControlsSaveButtonProps>>(
    () =>
      // same condition as for saveProps, but with different label and onClick handler
      saveProps
        ? {
            variant: 'outlined',
            label: t('save_and_leave'),
            onClick: handleSaveAndLeave,
          }
        : undefined,
    [saveProps, handleSaveAndLeave, t]
  );

  const loading = Boolean(moduleId && appStore.isLoaded && !isLoaded) || isCreatingOrUpdating;

  return (
    <BuilderWithHorizontalNavPageTemplate
      loading={loading}
      navStore={siteFormBuilderNavStore}
      alwaysShowNavBorderBottom={activeStepOrder === 4}
    >
      <Root $withoutPadding={activeStepOrder === 4}>
        {activeStepOrder === 1 && (
          <HorizontalStepMotion motionKey={1} direction={motionDirection}>
            <SiteFormBuilderStep1 loading={loading} siteFormBuilderStore={siteFormBuilderStore} />
          </HorizontalStepMotion>
        )}

        {activeStepOrder === 2 && (
          <HorizontalStepMotion motionKey={2} direction={motionDirection}>
            <HeadlessSiteFormBuilderStep2
              siteFormElementsFormData={siteFormElementsFormData}
              entityTypeIds={siteFormInitializationFormData.allLinkedToFormEntityTypeIds}
            />
          </HorizontalStepMotion>
        )}

        {activeStepOrder === 3 && siteForm && (
          <HorizontalStepMotion motionKey={5} direction={motionDirection}>
            <HeadlessSiteFormBuilderStep3
              code={siteForm.code}
              siteFormPages={siteFormElementsFormData.pages}
            />
          </HorizontalStepMotion>
        )}
      </Root>

      <BuilderStepControls
        fixed
        error={stepError}
        nextProps={nextProps}
        backProps={backProps}
        saveProps={saveProps}
        saveAndLeavePropsProps={saveAndLeaveProps}
      />
    </BuilderWithHorizontalNavPageTemplate>
  );
});

HeadlessSiteFormBuilder.displayName = 'HeadlessSiteFormBuilder';
export { HeadlessSiteFormBuilder };
