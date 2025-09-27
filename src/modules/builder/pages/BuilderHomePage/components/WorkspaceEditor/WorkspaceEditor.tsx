import { entityTypeStore, iconStore, routes } from '@/app';
import {
  ProductsSectionType,
  useDeleteProductSection,
  useGetProductsSections,
} from '@/modules/products';
import { useDeleteSchedule, useGetSchedules } from '@/modules/scheduler';
import {
  DefaultLoader,
  ErrorCode,
  IconName,
  SectionView,
  type Optional,
  type ServiceError,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useDeleteSiteForm, useGetSiteForms } from '../../../../api';
import { BuilderStepSubtitle, SiteFormType } from '../../../../shared';
import { EntityTypeFieldUsedInFormulaWarningModal, WorkspaceItem } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoaderWrapper = styled.div`
  width: 100%;
  height: 80px;
`;

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:not(:first-child) {
    margin-top: 8px;
  }
`;

const WorkspaceEditor = observer(() => {
  const { t } = useTranslation();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  const { data: productsSections, refetch: refetchProductsSections } = useGetProductsSections();
  const { mutateAsync: deleteProductSection } = useDeleteProductSection();

  const { data: schedulers, refetch: refetchSchedulers } = useGetSchedules();
  const { mutateAsync: deleteScheduler } = useDeleteSchedule();

  const {
    data: siteForms,
    isLoading: areSiteFormsLoading,
    refetch: refetchSiteForms,
  } = useGetSiteForms();
  const { mutateAsync: deleteSiteForm } = useDeleteSiteForm();

  const { entityTypes, deleteEntityType, invalidateEntityTypesInCache } = entityTypeStore;

  const [
    entityTypeFieldUsedInFormulaErrorOpened,
    { open: showEntityTypeFieldUsedInFormulaError, close: hideEntityTypeFieldUsedInFormulaError },
  ] = useDisclosure(false);

  const handleDeleteScheduler = async (schedulerId: number): Promise<void> => {
    await deleteScheduler(schedulerId);

    refetchProductsSections();
    invalidateEntityTypesInCache();
  };

  const handleDeleteProductsSection = async (productsSectionId: number): Promise<void> => {
    await deleteProductSection(productsSectionId);

    refetchSchedulers();
    invalidateEntityTypesInCache();
  };

  useEffect(() => {
    entityTypeStore.invalidateEntityTypesInCache();
  }, []);

  const handleDeleteEntityType = async (etId: number): Promise<void> => {
    try {
      await deleteEntityType(etId);

      refetchSiteForms();
      refetchSchedulers();
      refetchProductsSections();

      invalidateEntityTypesInCache();
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.ENTITY_TYPE_FIELD_USED_IN_FORMULA)
        showEntityTypeFieldUsedInFormulaError();
    }
  };

  return (
    <Root>
      {entityTypes.map(et => {
        const {
          id,
          section: { name, icon },
          entityCategory,
        } = et;

        return (
          <WorkspaceItem
            key={id}
            name={name}
            iconName={icon}
            editLink={routes.builderUpdateEt(id)}
            tag={t(`workspace_tags.${et.entityCategory}`)}
            moduleColor={iconStore.getEntityColorByEntityCategory(entityCategory)}
            sectionLink={
              et.section.view === SectionView.BOARD
                ? routes.boardSection({ entityTypeId: id })
                : routes.listSection(id)
            }
            onDelete={() => handleDeleteEntityType(id)}
          />
        );
      })}

      {productsSections &&
        productsSections.map(ps => (
          <WorkspaceItem
            key={ps.id}
            name={ps.name}
            iconName={ps.icon}
            moduleColor={iconStore.productsColor}
            sectionLink={routes.products({ sectionId: ps.id, sectionType: ps.type })}
            editLink={routes.builderUpdateProductsSection({ moduleId: ps.id, moduleType: ps.type })}
            tag={
              ps.type === ProductsSectionType.RENTAL
                ? t('workspace_tags.products_rentals')
                : t('workspace_tags.products_for_sales')
            }
            onDelete={() => handleDeleteProductsSection(ps.id)}
          />
        ))}

      {schedulers &&
        schedulers.map(s => (
          <WorkspaceItem
            key={s.id}
            name={s.name}
            iconName={s.icon}
            tag={t('workspace_tags.visits')}
            moduleColor={iconStore.schedulerColor}
            editLink={routes.builderUpdateScheduler(s.id)}
            sectionLink={routes.scheduler({
              scheduleId: s.id,
              scheduleType: s.type,
              tab: SectionView.OVERVIEW,
            })}
            onDelete={() => handleDeleteScheduler(s.id)}
          />
        ))}

      {areSiteFormsLoading ? (
        <LoaderWrapper>
          <DefaultLoader />
        </LoaderWrapper>
      ) : siteForms && siteForms.length > 0 ? (
        <GroupWrapper>
          <BuilderStepSubtitle $withIndent>{t('site_form')}</BuilderStepSubtitle>

          {siteForms.map(sf => (
            <WorkspaceItem
              key={sf.id}
              name={sf.name}
              iconName={IconName.SITE_FORM}
              tag={
                sf.type === SiteFormType.SCHEDULE
                  ? t('workspace_tags.online_booking_site_form')
                  : sf.isHeadless
                    ? t('workspace_tags.headless_site_form')
                    : t('workspace_tags.site_form')
              }
              moduleColor={iconStore.systemModuleColor}
              editLink={
                sf.type === SiteFormType.SCHEDULE
                  ? routes.builderUpdateOnlineBookingSiteForm(sf.id)
                  : sf.isHeadless
                    ? routes.builderUpdateHeadlessSiteForm(sf.id)
                    : routes.builderUpdateSiteForm(sf.id)
              }
              onDelete={() => deleteSiteForm(sf.id)}
            />
          ))}
        </GroupWrapper>
      ) : null}

      {entityTypeFieldUsedInFormulaErrorOpened && (
        <EntityTypeFieldUsedInFormulaWarningModal
          opened={entityTypeFieldUsedInFormulaErrorOpened}
          onClose={hideEntityTypeFieldUsedInFormulaError}
        />
      )}
    </Root>
  );
});

WorkspaceEditor.displayName = 'WorkspaceEditor';
export { WorkspaceEditor };
