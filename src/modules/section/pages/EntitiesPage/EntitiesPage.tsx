import { appStore, boardApiUtil, entityTypeStore, iconStore, routes, SettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import { MutationWarningCode, MutationWarningModal } from '@/modules/card';
import { FieldCode } from '@/modules/fields';
import {
  type GanttView,
  generateTimelineRoute,
  type TimelineRouteGenerator,
} from '@/modules/gantt';
import { Dashboard, Reports, ReportsSection } from '@/modules/reporting';
import { ProjectsTimelinePage } from '@/modules/section';
import {
  CommonQueryParams,
  CreateButtonSkeleton,
  DefaultHeader,
  type DefaultHeaderModuleIconProps,
  EntitiesAndBoardsPicker,
  EntitiesBoardPicker,
  EntityApiUtil,
  type EntityType,
  lastSectionService,
  ModuleNameSkeleton,
  type Optional,
  PageTemplateWithSubheader,
  PermissionObjectType,
  SectionView,
  TutorialProductType,
  UriCodingUtil,
  useMobile,
  useTitle,
  useTypedParams,
  WholePageLoaderWithLogo,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  EntitiesBoard,
  EntitiesFilterButton,
  EntitiesList,
  EntitiesPageUtil,
  ENTITY_CARDS_FILTER_SETTINGS_KEY,
  type EntityBoardCardFilter,
  type EntityCardsFilterSettings,
  SearchBlock,
  SectionHeaderWithBoardsControls,
  SectionSettingsButton,
  type SectionSettingsButtonTableSettingsProps,
} from '../../shared';
import {
  entitiesCardStore,
  EntitiesFilterStore,
  EntitiesListPageStore,
  ProjectsTimelinePageStore,
  stageGroupStore,
} from '../../store';
import { CardsTotalBlock, ReportsSettingsButton } from './components';

const EntitiesPage = observer(() => {
  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_header_with_boards',
  });

  const reportsSettingsButtonRef = useRef<HTMLButtonElement>(null);

  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { boardId, entityTypeId, tab, view } = useTypedParams<{
    entityTypeId: number;
    boardId: number;
    tab: SectionView;
    view?: GanttView;
  }>();

  const isListTab = tab === SectionView.LIST;
  const isBoardTab = tab === SectionView.BOARD;
  const isReportsTab = tab === SectionView.REPORTS;
  const isTimelineTab = tab === SectionView.TIMELINE;
  const isDashboardTab = tab === SectionView.DASHBOARD;

  const isSectionTab = isListTab || isBoardTab || isReportsTab || isDashboardTab;

  const navigate = useNavigate();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const [pageTitle, setPageTitle] = useState<string>();

  const { data: boards } = boardApiUtil.useGetBoardsByEntityTypeId({ entityTypeId });

  useTitle({ dynamicTitle: pageTitle });

  const hasSectionTab = searchParams.has(CommonQueryParams.SECTION);

  const pageFromParams = searchParams.get(CommonQueryParams.PAGE);
  const currentPage = pageFromParams ? Number(pageFromParams) : 1;

  const { user: currentUser } = authStore;

  const entitiesListPageStore = useMemo(
    () => new EntitiesListPageStore(entityTypeId),
    [entityTypeId]
  );

  const projectsTimelinePageStore = useMemo(
    () => new ProjectsTimelinePageStore({ boardId, entityTypeId }),
    [boardId, entityTypeId]
  );

  const isMobile = useMobile();

  const [mutationWarningShown, { open: showMutationWarning, close: hideMutationWarning }] =
    useDisclosure(false);
  const [
    reportsSettingsDrawerOpened,
    { toggle: toggleReportsSettingsDrawer, close: hideReportsSettingsDrawer },
  ] = useDisclosure(false);
  const [settingsOpened, { toggle: toggleSettings, close: closeSettings }] = useDisclosure(false);

  const [priceHidden, setPriceHidden] = useState(false);

  const entitiesFilterStore = useMemo(() => new EntitiesFilterStore(), []);
  const { filter: entitiesFilter, setFilter } = entitiesFilterStore;

  const { settings } = useMemo(
    () =>
      SettingsStore.getSettingsStore<{
        filters: EntityCardsFilterSettings[];
      }>(ENTITY_CARDS_FILTER_SETTINGS_KEY),
    []
  );
  const savedFilter = useMemo<Optional<EntityBoardCardFilter>>(
    () =>
      settings.filters?.find(f => f.entityTypeId === entityTypeId && f.boardId === boardId)?.filter,
    [settings, entityTypeId, boardId]
  );

  useEffect(() => {
    setFilter(savedFilter ?? {});
  }, [savedFilter, setFilter]);

  useEffect(() => {
    stageGroupStore.setShowMutationWarningCb(showMutationWarning);
    entitiesListPageStore.setShowMutationWarningCb(showMutationWarning);
  }, [entitiesListPageStore, showMutationWarning]);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        const et = entityTypeStore.getById(entityTypeId);

        setPageTitle(`${et.section.name} | ${t(tab)}`);
      }
    );
  }, [entityTypeId, tab, t]);

  // if boardId = -1, then we should find the first board and navigate user to it
  useLayoutEffect(() => {
    if (boardId === -1 && boards?.[0])
      navigate(routes.boardSection({ entityTypeId, boardId: boards[0]?.id }));
  }, [boardId, boards, entityTypeId, navigate]);

  useLayoutEffect(() => {
    // if tab is reports and section tab is not present -> set it to default value,
    // which is either current boardId or ReportsSection.USERS, depending on entity type
    if (isReportsTab && !hasSectionTab && appStore.isLoaded) {
      const et = entityTypeStore.getById(entityTypeId);

      setSearchParams(prev => {
        prev.set(
          CommonQueryParams.SECTION,
          et.isProjectCategory() ? String(boardId) : ReportsSection.USERS
        );

        return prev;
      });
    }

    // if no page param was found -> set it to current page, which in this case will be 1
    if (isListTab && !currentPage)
      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(currentPage));

        return prev;
      });

    // if tab is not reports and section tab is present -> remove it 'cause it's not needed
    if (!isReportsTab && hasSectionTab)
      setSearchParams(prev => {
        prev.delete(CommonQueryParams.SECTION);

        return prev;
      });
  }, [
    boardId,
    isListTab,
    isReportsTab,
    searchParams,
    currentPage,
    hasSectionTab,
    entityTypeId,
    setSearchParams,
  ]);

  useEffect(() => {
    if (isSectionTab)
      lastSectionService.setLastSectionParams({ entityTypeId, tab, boardId: boardId ?? null });
  }, [isSectionTab, entityTypeId, boardId, tab]);

  useEffect(() => {
    const checkPriceHidden = async (): Promise<void> => {
      const et = entityTypeStore.getById(entityTypeId);

      if (!et.isProjectCategory()) return;

      setPriceHidden(!et.fields.find(f => f.code === FieldCode.VALUE)?.active);
    };

    when(() => appStore.isLoaded, checkPriceHidden);
  }, [entityTypeId]);

  const handleChangePage = useCallback(
    (page: number) => {
      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(page));

        return prev;
      });
    },
    [setSearchParams]
  );

  const tableSettingsProps = useMemo<SectionSettingsButtonTableSettingsProps>(
    () => ({
      opened: settingsOpened,
      toggle: toggleSettings,
    }),
    [settingsOpened, toggleSettings]
  );

  const getModuleIconProps = useCallback(
    (et: EntityType): DefaultHeaderModuleIconProps => ({
      icon: iconStore.getByName(et.section.icon).icon,
      color: iconStore.getEntityColorByEntityCategory(et.entityCategory),
    }),
    []
  );

  const loadData = useCallback(
    async (filter: EntityBoardCardFilter): Promise<void> => {
      setFilter(filter);

      if (isBoardTab) {
        stageGroupStore.loadData({ boardId, entityTypeId, filter });
      } else if (isTimelineTab) {
        projectsTimelinePageStore.loadData(filter);
      } else {
        if (currentPage !== 1) {
          setSearchParams(prev => {
            prev.set(CommonQueryParams.PAGE, String(1));

            return prev;
          });

          await entitiesListPageStore.loadData({ filter, boardId, page: 1 });

          return;
        }

        await entitiesListPageStore.loadData({ filter, boardId, page: currentPage });
      }
    },
    [
      setFilter,
      isBoardTab,
      isTimelineTab,
      boardId,
      entityTypeId,
      projectsTimelinePageStore,
      currentPage,
      entitiesListPageStore,
      setSearchParams,
    ]
  );

  const timelineRouteGenerator = useMemo<TimelineRouteGenerator>(
    () =>
      generateTimelineRoute({
        boardId,
        entityTypeId,
        baseRoute: 'projects',
      }),
    [boardId, entityTypeId]
  );

  if (!appStore.isLoaded || boardId === -1)
    return (
      <PageTemplateWithSubheader
        tabs={[]}
        Header={
          <DefaultHeader Controls={<CreateButtonSkeleton />}>
            <ModuleNameSkeleton />
          </DefaultHeader>
        }
      >
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  const et = entityTypeStore.getById(entityTypeId);

  const canViewReports = Boolean(
    currentUser?.canViewReport(PermissionObjectType.ENTITY_TYPE, entityTypeId)
  );
  const canViewDashboard = Boolean(
    currentUser?.canViewDashboard(PermissionObjectType.ENTITY_TYPE, entityTypeId)
  );

  const boardAndListTabs = EntitiesPageUtil.getBoardAndListTabs({ entityTypeId, boardId, t });
  const reportsTab = EntitiesPageUtil.getReportsTab({ et, boardId, canView: canViewReports, t });
  const dashboardTab = EntitiesPageUtil.getDashboardTab({
    et,
    boardId,
    canView: canViewDashboard,
    t,
  });
  const timelineTab = EntitiesPageUtil.getTimelineTab({
    et,
    boardId,
    active: pathname.includes(SectionView.TIMELINE),
    t,
  });
  const automationTabLink = EntitiesPageUtil.getAutomationTabLink({
    boardId,
    etId: entityTypeId,
    from: currentPageEncodedUrl,
    t,
  });

  const isAdmin = authStore.isAdmin();

  const expandedEntitiesTabs = et.isProjectCategory()
    ? [...boardAndListTabs, timelineTab, reportsTab]
    : [...boardAndListTabs, dashboardTab, reportsTab];

  if (isAdmin) expandedEntitiesTabs.push(automationTabLink);

  const { isLoading: cardLoading, meta: cardMeta } = entitiesCardStore;
  const {
    totalCount: cardTotalCount,
    totalPrice: cardTotalPrice,
    hasPrice: cardHasPrice,
  } = cardMeta;

  const { meta: listMeta } = entitiesListPageStore;
  const {
    totalCount: listTotalCount,
    totalPrice: listTotalPrice,
    hasPrice: listHasPrice,
  } = listMeta;

  const { meta: timelineMeta } = projectsTimelinePageStore;
  const {
    totalCount: timelineTotalCount,
    totalPrice: timelineTotalPrice,
    hasPrice: timelineHasPrice,
  } = timelineMeta;

  const totalCount = isBoardTab
    ? cardTotalCount
    : isTimelineTab
      ? timelineTotalCount
      : listTotalCount;
  const totalPrice = isBoardTab
    ? cardHasPrice
      ? cardTotalPrice
      : undefined
    : isTimelineTab
      ? timelineHasPrice
        ? timelineTotalPrice
        : undefined
      : listHasPrice
        ? listTotalPrice
        : undefined;

  const isTabWithDeals = EntitiesPageUtil.tabsWithDealCards().includes(tab);

  return (
    <>
      <PageTemplateWithSubheader
        tabs={expandedEntitiesTabs}
        rootWidth={isReportsTab ? '100%' : undefined}
        pageMinWidth={(isBoardTab || isReportsTab) && isMobile ? 0 : undefined}
        marginLeft={isDashboardTab ? 0 : undefined}
        Header={
          <DefaultHeader
            objectId={entityTypeId}
            moduleName={et.section.name}
            moduleIconProps={getModuleIconProps(et)}
            productType={TutorialProductType.ENTITY_TYPE}
            Controls={
              isTabWithDeals ? (
                <SectionHeaderWithBoardsControls
                  entityType={et}
                  boardId={boardId}
                  currentPageEncodedUrl={currentPageEncodedUrl}
                />
              ) : null
            }
            CentralContent={
              <SearchBlock entityTypeId={et.id} searchEntities={EntityApiUtil.searchEntities} />
            }
          >
            {isTabWithDeals &&
              (EntitiesPageUtil.companyAndContactEntityTypeCategories().includes(
                et.entityCategory
              ) ? (
                <EntitiesAndBoardsPicker et={et} tab={tab} activeBoardId={boardId} />
              ) : boards ? (
                <EntitiesBoardPicker
                  tab={tab}
                  linkType="common"
                  activeBoardId={boardId}
                  entityTypeId={entityTypeId}
                  boards={boards}
                />
              ) : null)}
          </DefaultHeader>
        }
        SubheaderControls={
          <>
            {isTabWithDeals && (
              <>
                <CardsTotalBlock
                  totalCount={totalCount}
                  totalPrice={totalPrice}
                  etCategory={et.entityCategory}
                />

                <EntitiesFilterButton
                  boardId={boardId}
                  filter={entitiesFilter}
                  entityTypeId={entityTypeId}
                  loadData={loadData}
                />

                <SectionSettingsButton
                  entityType={et}
                  boardId={boardId}
                  hideSettings={!isAdmin}
                  currentPageEncodedUrl={currentPageEncodedUrl}
                  tableSettingsProps={isListTab ? tableSettingsProps : undefined}
                />
              </>
            )}

            {isReportsTab && (
              <ReportsSettingsButton
                ref={reportsSettingsButtonRef}
                settingsDrawerOpened={reportsSettingsDrawerOpened}
                toggleSettingsDrawer={toggleReportsSettingsDrawer}
              />
            )}
          </>
        }
      >
        <Tabs.Panel value={SectionView.BOARD}>
          <EntitiesBoard
            entityType={et}
            boardId={boardId}
            filter={entitiesFilter}
            savedFilter={savedFilter}
            priceHidden={priceHidden}
            showSkeleton={cardLoading}
            currentPageEncodedUrl={currentPageEncodedUrl}
          />
        </Tabs.Panel>

        <Tabs.Panel value={SectionView.LIST}>
          <EntitiesList
            et={et}
            boardId={boardId}
            filter={entitiesFilter}
            totalCount={listTotalCount}
            savedFilter={savedFilter}
            currentPage={currentPage}
            settingsOpened={settingsOpened}
            currentPageEncodedUrl={currentPageEncodedUrl}
            entitiesListPageStore={entitiesListPageStore}
            onPageChange={handleChangePage}
            handleCloseSettings={closeSettings}
          />
        </Tabs.Panel>

        {!et.isProjectCategory() && (
          <Tabs.Panel value={SectionView.DASHBOARD}>
            <Dashboard et={et} firstBoardId={boards?.[0]?.id} />
          </Tabs.Panel>
        )}

        {et.isProjectCategory() && view && (
          <Tabs.Panel value={SectionView.TIMELINE}>
            <ProjectsTimelinePage
              view={view}
              boardId={boardId}
              entityTypeId={entityTypeId}
              filter={entitiesFilter}
              savedFilter={savedFilter}
              projectsTimelinePageStore={projectsTimelinePageStore}
              routeGenerator={timelineRouteGenerator}
            />
          </Tabs.Panel>
        )}

        {hasSectionTab && (
          <Tabs.Panel value={SectionView.REPORTS}>
            <Reports
              settingsButtonRef={reportsSettingsButtonRef}
              settingsDrawerOpened={reportsSettingsDrawerOpened}
              hideSettingsDrawer={hideReportsSettingsDrawer}
            />
          </Tabs.Panel>
        )}
      </PageTemplateWithSubheader>

      {mutationWarningShown && (
        <MutationWarningModal
          opened={mutationWarningShown}
          code={MutationWarningCode.CHANGE_STAGE}
          onClose={hideMutationWarning}
        />
      )}
    </>
  );
});

EntitiesPage.displayName = 'EntitiesPage';
export { EntitiesPage };
