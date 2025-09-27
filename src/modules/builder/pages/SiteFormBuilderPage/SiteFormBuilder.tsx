import { appStore, determineApiHost, routes } from '@/app';
import {
  envUtil,
  useErrorMessageIdle,
  useTitle,
  useTypedParams,
  type Nullable,
  type Optional,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  BuilderStepControls,
  BuilderTabs,
  generateSiteFormBuilderNavSteps,
  HorizontalStepMotion,
  type BuilderNavStep,
  type BuilderStepControlsButtonProps,
  type BuilderStepControlsSaveButtonProps,
  type HorizontalStepMotionDirection,
} from '../../shared';
import { BuilderNavStore, SiteFormBuilderStore } from '../../store';
import { BuilderWithHorizontalNavPageTemplate } from '../../templates';
import {
  SiteFormBuilderStep1,
  SiteFormBuilderStep2,
  SiteFormBuilderStep3,
  SiteFormBuilderStep4,
  SiteFormBuilderStep5,
} from './components';

const Root = styled.div<{ $withoutPadding?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;

  padding-bottom: ${p =>
    p.$withoutPadding ? 'none' : 'var(--fixed-builder-step-controls-height)'};
`;

const SiteFormBuilder = observer(() => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.steps',
  });

  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const navigate = useNavigate();

  const prevStepOrder = useRef<Nullable<number>>(null);

  const siteFormBuilderStore = useMemo(
    () =>
      new SiteFormBuilderStore({
        defaultTitle: t('default_title'),
        defaultFormTitle: t('default_form_title'),
        defaultConsentText: t('default_consent_text'),
        defaultConsentLinkText: t('default_consent_link_text'),
        defaultGratitudeHeader: t('default_gratitude_header'),
        defaultGratitudeText: t('default_gratitude_text'),
        defaultFormButtonText: t('default_form_button_text'),
        defaultClientButtonText: t('default_client_button_text'),
      }),
    [t]
  );

  const siteFormBuilderNavSteps = useMemo<BuilderNavStep[]>(
    () => generateSiteFormBuilderNavSteps(t),
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
    isSilentlyUpdating,
    isCreatingOrUpdating,
    siteFormDesignFormData,
    siteFormConsentFormData,
    siteFormElementsFormData,
    siteFormGratitudeFormData,
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
  const { error: secondStepError, idle: secondStepErrorIdle } = useErrorMessageIdle(
    t('step2.error')
  );
  const { error: consentBlockError, idle: consentBlockErrorIdle } = useErrorMessageIdle(
    t('step3.consent_error')
  );

  const [fourthStepKey, rerenderFourthStep] = useReducer(x => ++x, 0);

  // silentUpdate -> isUpdating flag is not mutated

  const handleSave = useCallback(
    async ({ silentUpdate }: { silentUpdate: boolean }): Promise<void> => {
      if (!siteFormInitializationFormData.validate()) {
        firstStepErrorIdle();

        setStepOrder(1);

        return;
      }

      if (!siteFormElementsFormData.validate()) {
        secondStepErrorIdle();

        setStepOrder(2);

        return;
      }

      if (!siteFormConsentFormData.validate()) {
        consentBlockErrorIdle();

        setStepOrder(3);

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
      siteFormConsentFormData,
      siteFormElementsFormData,
      siteFormInitializationFormData,
      setStepOrder,
      updateSiteForm,
      createSiteForm,
      firstStepErrorIdle,
      secondStepErrorIdle,
      consentBlockErrorIdle,
    ]
  );

  const handleSaveAndRerenderFourthStep = useCallback(async (): Promise<void> => {
    if (isCreatingOrUpdating) return;

    // we can already see loading indication on this step
    await handleSave({ silentUpdate: true });

    rerenderFourthStep();
  }, [isCreatingOrUpdating, handleSave, rerenderFourthStep]);

  const handleSaveAndLeave = useCallback(async (): Promise<void> => {
    await handleSave({ silentUpdate: false });

    navigate(routes.builder(BuilderTabs.WORKSPACE));
  }, [handleSave, navigate]);

  const handleNavigateToNextStep = useCallback(() => {
    const firstStepValidationError =
      activeStepOrder === 1 && !siteFormInitializationFormData.validate();
    const secondStepValidationError = activeStepOrder === 2 && !siteFormElementsFormData.validate();

    const consentStepValidationError = activeStepOrder === 3 && !siteFormConsentFormData.validate();

    if (firstStepValidationError || secondStepValidationError || consentStepValidationError) {
      commonErrorIdle();

      return;
    }

    navigateToNextStep();
  }, [
    activeStepOrder,
    siteFormConsentFormData,
    siteFormElementsFormData,
    siteFormInitializationFormData,
    commonErrorIdle,
    navigateToNextStep,
  ]);

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
    () => commonError || firstStepError || secondStepError || consentBlockError,
    [commonError, firstStepError, secondStepError, consentBlockError]
  );

  const nextProps = useMemo<Optional<BuilderStepControlsButtonProps>>(() => {
    // nowhere to go forward
    if (isCurrentStepLast) return;

    // we need to save form if it's not already exists on 3rd -> 4th step transition so that
    // we can preview it on the fourth step (we can preview only existing forms)
    if (activeStepOrder === 3 && !siteForm)
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
    // so that preview will display the changes
    if (activeStepOrder === 4)
      return {
        disabled: isSilentlyUpdating,
        onClick: handleSaveAndRerenderFourthStep,
      };

    // if there is no siteForm it means that we are on 1-3 step and we not yet have a created form
    if (!siteForm) return;

    return {
      onClick: () => handleSave({ silentUpdate: false }),
    };
  }, [siteForm, activeStepOrder, isSilentlyUpdating, handleSave, handleSaveAndRerenderFourthStep]);

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

  // we slice last character because form expect base url to be without trailing slash
  const baseUrl = useMemo<string>(() => {
    const apiHost = determineApiHost();

    return apiHost.endsWith('/')
      ? encodeURIComponent(apiHost.slice(0, -1))
      : encodeURIComponent(apiHost);
  }, []);

  const previewUrl = siteForm
    ? `${envUtil.appUrl}/form-preview?code=${siteForm.code}&cn=${envUtil.appName}&baUrl=${baseUrl}&su=${envUtil.appUrl}`
    : null;

  const publicLinkUrl = siteForm ? `${envUtil.appUrl}/form/${siteForm.code}` : null;

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
            <SiteFormBuilderStep2
              siteFormElementsFormData={siteFormElementsFormData}
              entityTypeIds={siteFormInitializationFormData.allLinkedToFormEntityTypeIds}
            />
          </HorizontalStepMotion>
        )}

        {activeStepOrder === 3 && (
          <HorizontalStepMotion motionKey={3} direction={motionDirection}>
            <SiteFormBuilderStep3
              siteFormConsentFormData={siteFormConsentFormData}
              siteFormGratitudeFormData={siteFormGratitudeFormData}
            />
          </HorizontalStepMotion>
        )}

        {activeStepOrder === 4 && previewUrl && (
          <HorizontalStepMotion motionKey={4} direction={motionDirection}>
            <SiteFormBuilderStep4
              key={fourthStepKey}
              previewUrl={previewUrl}
              siteFormDesignFormData={siteFormDesignFormData}
            />
          </HorizontalStepMotion>
        )}

        {activeStepOrder === 5 && siteForm && publicLinkUrl && (
          <HorizontalStepMotion motionKey={5} direction={motionDirection}>
            <SiteFormBuilderStep5
              code={siteForm.code}
              previewUrl={publicLinkUrl}
              siteFormPages={siteFormElementsFormData.pages}
              multiformEnabled={siteFormElementsFormData.multiformEnabled}
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

SiteFormBuilder.displayName = 'SiteFormBuilder';
export { SiteFormBuilder };
