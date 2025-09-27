import type { ProductsSectionType } from '@/modules/products';
import { RequestSetupFormButton } from '@/modules/settings';
import {
  envUtil,
  RequestAdditionalStorageFormModal,
  RequestBpmnFormModal,
  type Nullable,
  type Option,
  type RequestAdditionalStorageFormModalState,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  AdditionalModuleCategory,
  BuilderAdditionalStorageCategory,
  BuilderMarketplaceCategory,
  BuilderStepBox,
  getJourneyLink,
  useAdditionalModulesOptions,
  useBuilderMarketplaceOptions,
  useGetAdditionalStorageOptions,
  useModulesCategoriesOptions,
  type ModuleCategory,
  type ModuleOptionExtra,
} from '../../../../shared';
import { BuilderModuleOption, PickJourneyLink } from './components';

const Root = styled.div`
  width: 100%;
  max-width: 1800px;

  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 1800px) {
    gap: 16px;
  }
`;

const Content = styled(BuilderStepBox)`
  overflow: clip;

  width: 100%;
`;

const TitleWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  line-height: 44px;
  color: var(--button-text-graphite-priory-text);

  @media (max-width: 1800px) {
    font-size: 24px;
    line-height: 32px;
  }
`;

const Subtitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: var(--button-text-graphite-priory-text);

  @media (max-width: 1800px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

const GridWrapper = styled.div<{ $bottomSpace?: boolean }>`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 48px;

  padding: ${p => (p.$bottomSpace ? '48px 64px 140px' : '48px 64px')};

  @media (max-width: 1800px) {
    gap: 32px;

    padding: ${p => (p.$bottomSpace ? '32px 48px 100px' : '32px 48px')};
  }
`;

const ModuleOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
  gap: 32px;

  @media (max-width: 1800px) {
    gap: 24px;
  }
`;

const slideUp = keyframes`
  from {
    bottom: -90px;
  }

  to {
    bottom: 0;
  }
`;

const JourneyLinkWrapper = styled.div`
  position: sticky;
  bottom: 0;

  width: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  padding: 24px 48px;
  background: var(--primary-statuses-white-0);
  border-top: 1px solid var(--graphite-graphite-80);
  animation: var(--transition-duration) var(--transition-timing-function) ${slideUp};
`;

const SESSION_STORAGE_BUILDER_ALWAYS_UNLOCKED_KEY = 'builderAlwaysUnlocked';

const BuilderJourneyPicker = () => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.module_names',
  });

  const navigate = useNavigate();

  const [moduleCategory, setModuleCategory] =
    useState<
      Nullable<
        | ModuleCategory
        | AdditionalModuleCategory
        | BuilderMarketplaceCategory
        | BuilderAdditionalStorageCategory
      >
    >(null);
  const [productsSectionType, setProductsSectionType] = useState<ProductsSectionType>();

  const moduleOptions = useModulesCategoriesOptions();
  const additionalModulesOptions = useAdditionalModulesOptions();
  const builderMarketplaceOptions = useBuilderMarketplaceOptions();
  const additionalStorageOptions = useGetAdditionalStorageOptions();

  const [
    isRequestBpmnFormModalOpened,
    { close: hideRequestBpmnFormModal, open: showRequestBpmnFormModal },
  ] = useDisclosure(false);

  const [requestAdditionalStorageFormModalState, setRequestAdditionalStorageFormModalState] =
    useState<RequestAdditionalStorageFormModalState>(null);

  const getOnSelectModuleHandler = useCallback((o: Option<ModuleCategory, ModuleOptionExtra>) => {
    return () => {
      setModuleCategory(o.value);

      if (o.extra?.productsSectionType) setProductsSectionType(o.extra.productsSectionType);
    };
  }, []);

  const getOnSelectAdditionalModuleHandler = useCallback(
    (o: Option<AdditionalModuleCategory, ModuleOptionExtra>) => () => {
      if (
        [
          AdditionalModuleCategory.SITE_FORMS,
          AdditionalModuleCategory.HEADLESS_SITE_FORMS,
          AdditionalModuleCategory.ONLINE_BOOKING,
        ].includes(o.value)
      ) {
        setModuleCategory(o.value);

        return;
      }

      if (o.extra?.link) navigate(o.extra.link);
    },
    [navigate]
  );

  const getOnSelectBuilderMarketplaceCategoryHandler = useCallback(
    (o: Option<BuilderMarketplaceCategory, ModuleOptionExtra>) => () => {
      if (o.value === BuilderMarketplaceCategory.AUTOMATISATION) showRequestBpmnFormModal();

      if (o.extra?.link) navigate(o.extra.link);
    },
    [navigate, showRequestBpmnFormModal]
  );

  const getOnSelectAdditionalStorageCategoryHandler = useCallback(
    (o: Option<BuilderAdditionalStorageCategory, ModuleOptionExtra>) => () => {
      switch (o.value) {
        case BuilderAdditionalStorageCategory.TEN_GB: {
          setRequestAdditionalStorageFormModalState(10);

          break;
        }

        case BuilderAdditionalStorageCategory.ONE_HUNDRED_GB: {
          setRequestAdditionalStorageFormModalState(100);

          break;
        }

        case BuilderAdditionalStorageCategory.ONE_TB: {
          setRequestAdditionalStorageFormModalState(1000);

          break;
        }
      }
    },
    []
  );

  const handleCloseRequestBpmnFormModal = useCallback(() => {
    hideRequestBpmnFormModal();

    setModuleCategory(null);
  }, [hideRequestBpmnFormModal]);

  const handleCloseRequestAdditionalStorageFormModal = useCallback(() => {
    setRequestAdditionalStorageFormModalState(null);

    setModuleCategory(null);
  }, []);

  const isAdditionalModuleSelected = useMemo<boolean>(
    () =>
      Boolean(
        moduleCategory &&
          Object.values(AdditionalModuleCategory).includes(
            moduleCategory as AdditionalModuleCategory
          )
      ),
    [moduleCategory]
  );

  return (
    <Root>
      {(!envUtil.builderHideMainModules ||
        // sometimes we need to always show the main builder modules, for this case this gateway is made, change carefully
        // https://docs.google.com/document/d/1sD9f0VVuf68nLRe10kymYxz3W1VLBfk1hrvyI29RRSQ/edit#heading=h.c3y6sacucfkm
        sessionStorage.getItem(SESSION_STORAGE_BUILDER_ALWAYS_UNLOCKED_KEY) === 'true') && (
        <Content>
          <GridWrapper>
            <TitleWrapper>
              <Title>{t('main_modules')}</Title>

              <RequestSetupFormButton titleKey="request_setup" />
            </TitleWrapper>

            <ModuleOptionsGrid>
              {moduleOptions.map(o => (
                <BuilderModuleOption
                  key={o.value}
                  moduleName={o.label}
                  icon={o.extra?.icon}
                  color={o.extra?.color}
                  comingSoon={o.extra?.comingSoon}
                  active={o.value === moduleCategory}
                  onSelect={getOnSelectModuleHandler(o)}
                />
              ))}
            </ModuleOptionsGrid>
          </GridWrapper>

          {moduleCategory && !isAdditionalModuleSelected && (
            <JourneyLinkWrapper>
              <PickJourneyLink to={getJourneyLink({ moduleCategory, productsSectionType })} />
            </JourneyLinkWrapper>
          )}
        </Content>
      )}

      <Content>
        <GridWrapper>
          <Title>{t('additional_modules')}</Title>

          <ModuleOptionsGrid>
            {additionalModulesOptions.map(o => (
              <BuilderModuleOption
                key={o.value}
                moduleName={o.label}
                icon={o.extra?.icon}
                color={o.extra?.color}
                comingSoon={o.extra?.comingSoon}
                active={o.value === moduleCategory}
                onSelect={getOnSelectAdditionalModuleHandler(o)}
              />
            ))}
          </ModuleOptionsGrid>
        </GridWrapper>

        {moduleCategory && isAdditionalModuleSelected && (
          <JourneyLinkWrapper>
            <PickJourneyLink to={getJourneyLink({ moduleCategory, productsSectionType })} />
          </JourneyLinkWrapper>
        )}
      </Content>

      <Content>
        <GridWrapper>
          <Title>{t('marketplace')}</Title>

          <ModuleOptionsGrid>
            {builderMarketplaceOptions.map(o => (
              <BuilderModuleOption
                key={o.value}
                tag={o.extra?.tag}
                moduleName={o.label}
                icon={o.extra?.icon}
                color={o.extra?.color}
                comingSoon={o.extra?.comingSoon}
                active={o.value === moduleCategory}
                onSelect={getOnSelectBuilderMarketplaceCategoryHandler(o)}
              />
            ))}
          </ModuleOptionsGrid>

          <Subtitle>{t('additional_storage')}</Subtitle>

          <ModuleOptionsGrid>
            {additionalStorageOptions.map(o => (
              <BuilderModuleOption
                key={o.value}
                tag={o.extra?.tag}
                moduleName={o.label}
                icon={o.extra?.icon}
                color={o.extra?.color}
                comingSoon={o.extra?.comingSoon}
                active={o.value === moduleCategory}
                onSelect={getOnSelectAdditionalStorageCategoryHandler(o)}
              />
            ))}
          </ModuleOptionsGrid>
        </GridWrapper>

        {isRequestBpmnFormModalOpened && (
          <RequestBpmnFormModal
            isOpened={isRequestBpmnFormModalOpened}
            onClose={handleCloseRequestBpmnFormModal}
          />
        )}

        {requestAdditionalStorageFormModalState !== null && (
          <RequestAdditionalStorageFormModal
            state={requestAdditionalStorageFormModalState}
            onClose={handleCloseRequestAdditionalStorageFormModal}
          />
        )}
      </Content>
    </Root>
  );
};

export { BuilderJourneyPicker };
