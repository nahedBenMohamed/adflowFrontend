import { appStore, entityTypeStore } from '@/app';
import type { ProductsSection } from '@/modules/products';
import { SchedulePerformerType, type Schedule } from '@/modules/scheduler';
import {
  CommonQueryParams,
  WholePageLoaderWithLogo,
  useTypedParams,
  type Nullable,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useMemo, useState, type RefObject } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  ReportsSection,
  reportSectionToScheduleReportTypeMap,
  type ProductsReportType,
  type ProjectReportType,
  type RenderTabs,
  type ReportTabPanelProps,
  type ScheduleReportType,
} from '../../shared';
import {
  ComparativeReportTabPanel,
  CustomerReportTabPanel,
  GeneralReportTabPanel,
  ProductsGeneralReportTabPanel,
  ProjectReportTabPanel,
  ReportsNavigationSidebar,
  ScheduleReportTabPanel,
  TelephonyReportTabPanel,
} from './components';

const Root = styled(Tabs)<{ $sidebarShown: boolean }>`
  width: 100%;

  padding: 16px 0 16px ${p => (p.$sidebarShown ? 'var(--reports-navigation-sidebar-width)' : 0)};

  transition: padding var(--transition-200);
`;

interface Props {
  settingsDrawerOpened: boolean;
  settingsButtonRef?: RefObject<HTMLButtonElement | null>;
  scheduleEntityTypeId?: Nullable<number>;
  productsSection?: ProductsSection;
  schedule?: Schedule;
  hideSettingsDrawer: () => void;
}

const Reports = (props: Props) => {
  const {
    settingsButtonRef,
    settingsDrawerOpened,
    scheduleEntityTypeId = null,
    productsSection,
    schedule,
    hideSettingsDrawer,
  } = props;

  const { entityTypeId } = useTypedParams<{
    entityTypeId?: number;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();

  const entityType = entityTypeId ? entityTypeStore.getById(entityTypeId) : null;
  const entityCategory = entityType ? entityType.entityCategory : null;

  const isProject = entityType ? entityType.isProjectCategory() : false;

  const firstLinkedSchedulerId = entityType ? entityType.linkedSchedulerIds[0] : null;

  const [projectReportTabs, setProjectReportTabs] = useState<RenderTabs<ProjectReportType>[]>([]);
  const [scheduleReportTabs, setScheduleReportTabs] = useState<RenderTabs<ScheduleReportType>[]>(
    () =>
      // we should not show performer tab for schedule with department performers
      schedule && schedule.performersType === SchedulePerformerType.DEPARTMENT
        ? reportSectionToScheduleReportTypeMap.filter(
            t => t.value !== ReportsSection.SCHEDULE_PERFORMER
          )
        : reportSectionToScheduleReportTypeMap
  );
  const [productsGeneralReportTabs, setProductsGeneralReportTabs] = useState<
    RenderTabs<ProductsReportType>[]
  >([]);

  const [sidebarShown, { toggle: toggleSidebar }] = useDisclosure(true);

  const activeTabFromParams = searchParams.get(CommonQueryParams.SECTION);
  const activeTab = activeTabFromParams ? (activeTabFromParams as ReportsSection) : null;

  const handleChangeTab = useCallback(
    (value: Nullable<string>) => {
      if (!value) return;

      setSearchParams(prev => {
        prev.set(CommonQueryParams.SECTION, value);

        return prev;
      });
    },
    [setSearchParams]
  );

  const commonProps = useMemo(
    () =>
      ({
        sidebarShown,
        settingsButtonRef,
        settingsDrawerOpened,
        toggleSidebar,
        hideSettingsDrawer,
      }) satisfies ReportTabPanelProps,
    [sidebarShown, settingsButtonRef, settingsDrawerOpened, toggleSidebar, hideSettingsDrawer]
  );

  return appStore.isLoaded ? (
    <Root
      value={activeTab}
      keepMounted={false}
      orientation="vertical"
      $sidebarShown={sidebarShown}
      onChange={handleChangeTab}
    >
      {activeTab && (
        <ReportsNavigationSidebar
          schedule={schedule}
          activeTab={activeTab}
          isProject={isProject}
          sidebarShown={sidebarShown}
          entityTypeId={entityTypeId}
          toggleSidebar={toggleSidebar}
          entityCategory={entityCategory}
          productsSection={productsSection}
          setProjectReportTabs={setProjectReportTabs}
          setScheduleReportTabs={setScheduleReportTabs}
          setProductsGeneralReportTabs={setProductsGeneralReportTabs}
        />
      )}

      {entityTypeId && (
        <>
          {isProject ? (
            <ProjectReportTabPanel
              {...commonProps}
              entityTypeId={entityTypeId}
              projectReportTabs={projectReportTabs}
            />
          ) : (
            <>
              <GeneralReportTabPanel entityTypeId={entityTypeId} {...commonProps} />

              <ComparativeReportTabPanel entityTypeId={entityTypeId} {...commonProps} />

              <TelephonyReportTabPanel entityTypeId={entityTypeId} {...commonProps} />
            </>
          )}

          <CustomerReportTabPanel entityTypeId={entityTypeId} {...commonProps} />
        </>
      )}

      <ProductsGeneralReportTabPanel
        {...commonProps}
        productsGeneralReportTabs={productsGeneralReportTabs}
      />

      {schedule && (
        <ScheduleReportTabPanel
          {...commonProps}
          scheduleId={schedule.id}
          scheduleReportTabs={scheduleReportTabs}
          scheduleEntityTypeId={scheduleEntityTypeId}
        />
      )}

      {firstLinkedSchedulerId && (
        <ScheduleReportTabPanel
          {...commonProps}
          scheduleId={firstLinkedSchedulerId}
          scheduleReportTabs={scheduleReportTabs}
          scheduleEntityTypeId={scheduleEntityTypeId}
        />
      )}
    </Root>
  ) : (
    <WholePageLoaderWithLogo ensureHeaderWithOffset />
  );
};

export { Reports };
