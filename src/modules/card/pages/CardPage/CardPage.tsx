import { appStore, entityTypeStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  generateTimelineRoute,
  type GanttView,
  type TimelineRouteGenerator,
} from '@/modules/gantt';
import {
  CardProductsOrder,
  CardProductsOrders,
  CardRentalProductsOrder,
  ProductsSectionType,
  useGetProductsSections,
} from '@/modules/products';
import {
  EntityTasksBoard,
  EntityTasksList,
  TaskBoardFilterDto,
  TaskSettingsIdentifier,
  TasksBoardPageStore,
  TasksCount,
  TasksFilterButton,
  TasksFilterStore,
  TasksFilterType,
  TasksListsPageStore,
  TasksPageCalendarView,
  TasksSettingsButton,
  TasksTimelinePageStore,
  TimelinePage,
  findSavedCalendarFilter,
  findSavedTasksFilter,
  generateTasksCalendarRoute,
  taskSettingsStore,
  useGetCalendarQueryParams,
  useGetTasksForCalendarCount,
  type CreateTaskDto,
  type TaskBoardFilter,
  type TaskCalendarRouteGenerator,
  type TasksTableSettingsDrawerProps,
} from '@/modules/tasks';
import {
  ArrowBackLink,
  CommonQueryParams,
  DefaultHeader,
  EntityCategory,
  LeftNavTemplate,
  PREV_PAGE_QUERY_PARAM,
  PageTemplateWithSubheader,
  UriCodingUtil,
  UtcDate,
  WholePageLoaderWithLogo,
  useCheckProjectOwnerOrAdmin,
  useMobile,
  useTitle,
  useTypedParams,
  type CalendarView,
  type Optional,
  type UtcDateValue,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useReducer, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CardPageHeader,
  CardTab,
  ORDER_ID_QUERY_PARAM,
  ORDER_NEW_PARAM_VALUE,
  OverviewComponent,
  generateProductsSectionOrderTabValue,
  getCardPageTabsWithProductsSections,
  useGetProjectTaskBoardId,
  type CardPageHeaderControlsProps,
} from '../../shared';
import { CardStore } from '../../store';

const TASKS_TABS = [CardTab.BOARD, CardTab.LIST, CardTab.CALENDAR, CardTab.TIMELINE];

const CardPage = observer(() => {
  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui',
  });

  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { entityId, entityTypeId, tab, view, year, month, day } = useTypedParams<{
    entityId: number;
    entityTypeId: number;
    tab: CardTab;
    view?: CalendarView | GanttView;
    year?: number;
    month?: number;
    day?: number;
  }>();

  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const { user: currentUser } = authStore;

  const prevPageFromParams = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const isAfterAdd = searchParams.get(CardTab.AFTER_ADD) === 'true';

  const orderIdFromParams = searchParams.get(ORDER_ID_QUERY_PARAM);
  const orderId = orderIdFromParams ?? null;

  const fromFromParams = searchParams.get(CommonQueryParams.FROM);
  const fromEncoded = fromFromParams ? UriCodingUtil.encode(fromFromParams) : undefined;

  const [mutationWarningShown, { open: showMutationWarning, close: hideMutationWarning }] =
    useDisclosure(false);
  const [
    fieldUsedInFormulaWarningShown,
    { open: showFieldUsedInFormulaWarning, close: hideFieldUsedInFormulaWarning },
  ] = useDisclosure(false);
  const [
    fieldFormulaCircularDependencyWarningShown,
    {
      open: showFieldFormulaCircularDependencyWarning,
      close: hideFieldFormulaCircularDependencyWarning,
    },
  ] = useDisclosure(false);

  const cardStore = useMemo(
    () =>
      new CardStore({
        entityTypeId,
        analyticsGroupName: t('analytics'),
        requisitesGroupName: t('requisites'),
        showMutationWarning,
        showFieldUsedInFormulaWarning,
        showFieldFormulaCircularDependencyWarning,
        navigate,
        t,
      }),
    [
      entityTypeId,
      showMutationWarning,
      showFieldUsedInFormulaWarning,
      showFieldFormulaCircularDependencyWarning,
      navigate,
      t,
    ]
  );

  const { entity, isLoaded: cardStoreLoaded, entityStageId, changeEntityBoard } = cardStore;

  useTitle({ dynamicTitle: entity?.name });

  const isMobile = useMobile();

  // Subtract 1 from month because we use canonical months (1-12) in url, but in code it is 0-11
  const startDate = useMemo<UtcDateValue>(
    () => (year && month && day ? UtcDate.create({ year, month: month - 1, day }) : null),
    [day, month, year]
  );

  const tasksBoardPageStore = useMemo(() => new TasksBoardPageStore(entityId), [entityId]);
  const {
    meta: tasksBoardMeta,
    addTask: addBoardTask,
    loadData: loadBoardTasks,
  } = tasksBoardPageStore;

  const tasksListPageStore = useMemo(() => new TasksListsPageStore(entityId), [entityId]);
  const { meta: tasksListMeta, addTask: addListTask, loadData: loadListTasks } = tasksListPageStore;

  const tasksFilterStore = useMemo(() => new TasksFilterStore(entityId), [entityId]);
  const {
    filter: tasksFilter,
    filterDto: tasksFilterDto,
    setFilter: setTasksFilter,
    isCalendarInitialFilterSet,
    markCalendarFilterAsInitiallySet,
    unmarkCalendarFilterAsInitiallySet,
  } = tasksFilterStore;

  const [cardProductOrderComponentKey, rerenderCardProductOrderComponent] = useReducer(x => ++x, 0);
  const [cardRentalProductOrderComponentKey, rerenderCardRentalProductOrderComponent] = useReducer(
    x => ++x,
    0
  );

  const { data: productSections, isLoading: areProductSectionsLoading } = useGetProductsSections();

  const taskBoardId = useGetProjectTaskBoardId(entity?.boardId ?? null);

  const tasksTimelinePageStore = useMemo(() => {
    if (taskBoardId) return new TasksTimelinePageStore(taskBoardId);
  }, [taskBoardId]);

  useEffect(() => {
    if (!appStore.isLoaded) return;

    if (cardStore.isLoaded) {
      if (tab === CardTab.OVERVIEW) {
        cardStore.invalidateEntityInCache(entityId);

        return;
      }
    } else {
      cardStore.loadEntity(entityId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, cardStore, appStore.isLoaded, tab]);

  const clearOrderIdQueryParam = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(ORDER_ID_QUERY_PARAM);

      return prev;
    });
  }, [setSearchParams]);

  const isTasksList = useMemo<boolean>(() => tab === CardTab.LIST, [tab]);
  const isTasksBoard = useMemo<boolean>(() => tab === CardTab.BOARD, [tab]);
  const isCalendar = useMemo<boolean>(() => tab === CardTab.CALENDAR, [tab]);
  const isOrder = useMemo<boolean>(
    () => tab && (tab.includes(CardTab.SALE) || tab.includes(CardTab.RENTAL)),
    [tab]
  );

  useEffect(() => {
    if (!orderIdFromParams || isOrder) return;

    clearOrderIdQueryParam();
  }, [orderIdFromParams, isOrder, clearOrderIdQueryParam]);

  const savedTasksFilter = useMemo<Optional<TaskBoardFilter>>(
    () =>
      taskBoardId
        ? findSavedTasksFilter({
            boardId: taskBoardId,
            filterType: TasksFilterType.TASK_BOARD_FILTER,
          })
        : undefined,
    [taskBoardId]
  );

  const savedTasksCalendarFilter = useMemo<Optional<TaskBoardFilter>>(
    () =>
      taskBoardId
        ? findSavedCalendarFilter({
            boardId: taskBoardId,
            filterType: TasksFilterType.TASK_BOARD_FILTER,
          })?.filter
        : undefined,
    [taskBoardId]
  );

  useEffect(() => {
    if (!taskBoardId) return;

    if (appStore.isLoaded) {
      if (isCalendar) {
        if (!tasksFilterStore.isFilterSet) {
          setTasksFilter(savedTasksCalendarFilter ?? {});

          const currentUserFilter = currentUser ? { ownerIds: [currentUser.id] } : {};

          if (!tasksFilterStore.isFilterSet) setTasksFilter(currentUserFilter);
        }

        markCalendarFilterAsInitiallySet();
      } else {
        setTasksFilter(savedTasksFilter ?? {});

        unmarkCalendarFilterAsInitiallySet();
      }
    }
  }, [
    isCalendar,
    currentUser,
    taskBoardId,
    savedTasksFilter,
    savedTasksCalendarFilter,
    tasksFilterStore.isFilterSet,
    markCalendarFilterAsInitiallySet,
    unmarkCalendarFilterAsInitiallySet,
    setTasksFilter,
  ]);

  const loadListData = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      if (!taskBoardId) return;

      setTasksFilter(filter);

      const model = TaskBoardFilterDto.fromModel(filter);
      const filterDto = entityId ? { ...model, entityIds: [entityId] } : model;

      await loadListTasks({ boardId: taskBoardId, filterDto });
    },
    [taskBoardId, entityId, loadListTasks, setTasksFilter]
  );

  const loadBoardData = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      if (!taskBoardId) return;

      setTasksFilter(filter);

      const model = TaskBoardFilterDto.fromModel(filter);
      const filterDto = entityId ? { ...model, entityIds: [entityId] } : model;

      await loadBoardTasks({ boardId: taskBoardId, filterDto });
    },
    [taskBoardId, entityId, loadBoardTasks, setTasksFilter]
  );

  const loadTimelineData = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      if (!taskBoardId || !tasksTimelinePageStore) return;

      setTasksFilter(filter);

      const model = TaskBoardFilterDto.fromModel(filter);
      const filterDto = entityId ? { ...model, entityIds: [entityId] } : model;

      await tasksTimelinePageStore.loadData(filterDto);
    },
    [taskBoardId, tasksTimelinePageStore, setTasksFilter, entityId]
  );

  const identifier = taskBoardId ? TaskSettingsIdentifier.forTaskBoard(taskBoardId) : null;

  const handleAddTaskToBoard = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      if (identifier)
        dto.settingsId = (await taskSettingsStore.findOrCreateByIdentifier(identifier)).id;

      await addBoardTask({ dto, filterDto: tasksFilterDto });
    },
    [identifier, tasksFilterDto, addBoardTask]
  );

  const handleAddTaskToList = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      if (identifier)
        dto.settingsId = (await taskSettingsStore.findOrCreateByIdentifier(identifier)).id;

      await addListTask(dto);
    },
    [identifier, addListTask]
  );

  const handleCreateNewOrder = useCallback(() => {
    setSearchParams(prev => {
      prev.set(ORDER_ID_QUERY_PARAM, ORDER_NEW_PARAM_VALUE);

      return prev;
    });

    if (tab.includes(CardTab.SALE)) rerenderCardProductOrderComponent();

    if (tab.includes(CardTab.RENTAL)) rerenderCardRentalProductOrderComponent();
  }, [tab, setSearchParams]);

  const tasksCalendarQueryParams = useGetCalendarQueryParams({
    boardId: taskBoardId,
    startDate,
    filterDto: tasksFilterDto,
    calendarView: view as CalendarView,
  });

  const { data: tasksCountForCalendar } = useGetTasksForCalendarCount({
    queryParams: tasksCalendarQueryParams,
    enabled: tab === CardTab.CALENDAR && isCalendarInitialFilterSet,
  });

  const tasksCount = useMemo<number>(() => {
    switch (tab) {
      case CardTab.BOARD:
        return tasksBoardMeta.total;

      case CardTab.LIST:
        return tasksListMeta.total;

      case CardTab.TIMELINE:
        return tasksTimelinePageStore?.meta.total ?? 0;

      default:
        return tasksCountForCalendar ?? 0;
    }
  }, [
    tab,
    tasksBoardMeta.total,
    tasksCountForCalendar,
    tasksListMeta.total,
    tasksTimelinePageStore?.meta.total,
  ]);

  const loadData = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      switch (tab) {
        case CardTab.BOARD:
          return loadBoardData(filter);

        case CardTab.LIST:
          return loadListData(filter);

        case CardTab.TIMELINE:
          return loadTimelineData(filter);

        default:
          throw new Error(`Attempt to load data in CardPage on unknown tab: ${tab}`);
      }
    },
    [loadBoardData, loadListData, loadTimelineData, tab]
  );

  const calendarRouteGenerator = useMemo<TaskCalendarRouteGenerator>(
    () =>
      generateTasksCalendarRoute({
        entityId,
        entityTypeId,
        from: fromEncoded,
        baseRoute: 'projects',
      }),
    [entityId, entityTypeId, fromEncoded]
  );

  const timelineRouteGenerator = useMemo<TimelineRouteGenerator>(
    () =>
      generateTimelineRoute({
        entityId,
        entityTypeId,
        from: fromEncoded,
        baseRoute: 'project_tasks',
      }),
    [entityId, entityTypeId, fromEncoded]
  );

  const isProjectOwnerOrAdmin = useCheckProjectOwnerOrAdmin({ boardId: taskBoardId });

  const [
    tasksTableSettingsDrawerOpened,
    { close: hideTasksTableSettingsDrawer, toggle: toggleTasksTableSettingsDrawer },
  ] = useDisclosure(false);

  const cardPageHeaderControlsProps = useMemo<CardPageHeaderControlsProps>(
    () => ({
      tab,
      orderId,
      entityId,
      identifier,
      taskBoardId,
      timeAllocation: isTasksBoard ? tasksBoardMeta.timeAllocation : tasksListMeta.timeAllocation,
      handleCreateNewOrder,
      handleAddTask: isTasksBoard ? handleAddTaskToBoard : handleAddTaskToList,
    }),
    [
      tab,
      orderId,
      entityId,
      identifier,
      taskBoardId,
      isTasksBoard,
      tasksListMeta.timeAllocation,
      tasksBoardMeta.timeAllocation,
      handleAddTaskToList,
      handleCreateNewOrder,
      handleAddTaskToBoard,
    ]
  );

  const tableSettingsDrawerProps = useMemo<Optional<TasksTableSettingsDrawerProps>>(
    () =>
      isTasksList
        ? {
            drawerOpened: tasksTableSettingsDrawerOpened,
            toggleDrawer: toggleTasksTableSettingsDrawer,
          }
        : undefined,
    [isTasksList, tasksTableSettingsDrawerOpened, toggleTasksTableSettingsDrawer]
  );

  const rootXMargins = useMemo<CSSProperties['marginLeft']>(
    () => (isCalendar ? 0 : isOrder ? '14px' : undefined),
    [isCalendar, isOrder]
  );

  if (!appStore.isLoaded || !cardStoreLoaded || areProductSectionsLoading)
    return (
      <LeftNavTemplate Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureHeaderWithOffset />
      </LeftNavTemplate>
    );

  const entityType = entityTypeStore.getById(entityTypeId);
  const isProject = entityType.entityCategory === EntityCategory.PROJECT;

  const linkedProductSections = productSections?.filter(ps =>
    entityType.linkedProductsSectionIds.includes(ps.id)
  );

  const tabs = getCardPageTabsWithProductsSections({
    entityId,
    entityTypeId,
    pathname,
    from: fromEncoded,
    productsSections: linkedProductSections,
    taskBoardId: isProject && taskBoardId ? taskBoardId : null,
    t,
  });

  const backLinkURL = prevPageFromParams
    ? UriCodingUtil.decode(prevPageFromParams)
    : routes.section({ entityType, firstBoardId: entity?.boardId });

  if (!entity)
    return (
      <LeftNavTemplate
        Header={
          <CardPageHeader
            entity={entity}
            entityTypeId={entityTypeId}
            entityStageId={entityStageId}
            controlsProps={cardPageHeaderControlsProps}
            changeEntityBoard={changeEntityBoard}
          />
        }
      >
        <WholePageLoaderWithLogo ensureHeader />
      </LeftNavTemplate>
    );

  return tabs.length ? (
    <PageTemplateWithSubheader
      tabs={tabs}
      marginLeft={rootXMargins}
      marginRight={rootXMargins}
      pageMinWidth={isTasksBoard && isMobile ? 0 : undefined}
      rootWidth={
        tab && (tab.includes(CardTab.SALE) || tab.includes(CardTab.RENTAL)) ? '100vw' : undefined
      }
      Header={
        <CardPageHeader
          entity={entity}
          entityTypeId={entityTypeId}
          entityStageId={entityStageId}
          controlsProps={cardPageHeaderControlsProps}
          changeEntityBoard={changeEntityBoard}
        />
      }
      SubheaderContent={<ArrowBackLink small alignBaseToLeft backLink={backLinkURL} />}
      SubheaderControls={
        tab &&
        TASKS_TABS.includes(tab) && (
          <>
            <TasksCount count={tasksCount} />

            {!isCalendar && (
              <TasksFilterButton
                filter={tasksFilter}
                boardId={taskBoardId}
                hideEntitiesSearchBlock
                filterType={TasksFilterType.TASK_BOARD_FILTER}
                loadData={loadData}
              />
            )}

            {isProjectOwnerOrAdmin && taskBoardId && (
              <TasksSettingsButton
                entityId={entityId}
                boardId={taskBoardId}
                entityTypeId={entityTypeId}
                currentPageEncodedUrl={currentPageEncodedUrl}
                tableSettingsDrawerProps={tableSettingsDrawerProps}
              />
            )}
          </>
        )
      }
    >
      <Tabs.Panel key={CardTab.OVERVIEW} value={CardTab.OVERVIEW}>
        <OverviewComponent
          ensureSubheader
          entityId={entityId}
          cardStore={cardStore}
          backLink={backLinkURL}
          isAfterAdd={isAfterAdd}
          entityType={entityType}
          mutationWarningShown={mutationWarningShown}
          fieldUsedInFormulaWarningShown={fieldUsedInFormulaWarningShown}
          fieldFormulaCircularDependencyWarningShown={fieldFormulaCircularDependencyWarningShown}
          hideMutationWarning={hideMutationWarning}
          hideFieldUsedInFormulaWarning={hideFieldUsedInFormulaWarning}
          hideFieldFormulaCircularDependencyWarning={hideFieldFormulaCircularDependencyWarning}
        />
      </Tabs.Panel>

      {taskBoardId && (
        <Tabs.Panel key={CardTab.BOARD} value={CardTab.BOARD}>
          <EntityTasksBoard
            entityId={entityId}
            boardId={taskBoardId}
            filterDto={tasksFilterDto}
            entityTypeId={entityTypeId}
            tasksPageStore={tasksBoardPageStore}
            currentPageEncodedUrl={currentPageEncodedUrl}
            handleAddTask={handleAddTaskToBoard}
          />
        </Tabs.Panel>
      )}

      {taskBoardId && identifier && (
        <>
          <Tabs.Panel key={CardTab.LIST} value={CardTab.LIST}>
            <EntityTasksList
              entityId={entityId}
              boardId={taskBoardId}
              identifier={identifier}
              filterDto={tasksFilterDto}
              tasksListPageStore={tasksListPageStore}
              settingsDrawerOpened={tasksTableSettingsDrawerOpened}
              hideSettingsDrawer={hideTasksTableSettingsDrawer}
            />
          </Tabs.Panel>

          <Tabs.Panel key={CardTab.CALENDAR} value={CardTab.CALENDAR}>
            <TasksPageCalendarView
              entityId={entityId}
              calendarView={view as CalendarView}
              startDate={startDate}
              boardId={taskBoardId}
              identifier={identifier}
              isInitialFilterSet={isCalendarInitialFilterSet}
              filterDto={tasksFilterDto}
              setFilter={setTasksFilter}
              routeGenerator={calendarRouteGenerator}
            />
          </Tabs.Panel>

          {tasksTimelinePageStore && (
            <Tabs.Panel key={CardTab.TIMELINE} value={CardTab.TIMELINE}>
              <TimelinePage
                boardId={taskBoardId}
                entityId={entityId}
                view={view as GanttView}
                filterDto={tasksFilterDto}
                routeGenerator={timelineRouteGenerator}
                tasksTimelinePageStore={tasksTimelinePageStore}
              />
            </Tabs.Panel>
          )}
        </>
      )}

      {productSections &&
        productSections.map(ps =>
          ps.type === ProductsSectionType.SALE ? (
            <Tabs.Panel
              key={ps.id}
              value={generateProductsSectionOrderTabValue({
                sectionId: ps.id,
                sectionType: ps.type,
              })}
            >
              <CardProductsOrder
                entity={entity}
                orderId={orderId}
                productsSection={ps}
                currentUser={currentUser}
                cardProductOrderComponentKey={cardProductOrderComponentKey}
              />
            </Tabs.Panel>
          ) : (
            <Tabs.Panel
              key={ps.id}
              value={generateProductsSectionOrderTabValue({
                sectionId: ps.id,
                sectionType: ps.type,
              })}
            >
              <CardRentalProductsOrder
                entity={entity}
                orderId={orderId}
                productsSection={ps}
                currentUser={currentUser}
                cardRentalProductOrderComponentKey={cardRentalProductOrderComponentKey}
              />
            </Tabs.Panel>
          )
        )}

      <Tabs.Panel value={CardTab.ORDERS} key={CardTab.ORDERS}>
        <CardProductsOrders
          etId={entityTypeId}
          entityId={entityId}
          fromEncoded={fromEncoded}
          linkedProductSections={linkedProductSections}
        />
      </Tabs.Panel>
    </PageTemplateWithSubheader>
  ) : (
    <LeftNavTemplate
      Header={
        <CardPageHeader
          entity={entity}
          entityTypeId={entityTypeId}
          entityStageId={entityStageId}
          controlsProps={cardPageHeaderControlsProps}
          changeEntityBoard={changeEntityBoard}
        />
      }
    >
      <OverviewComponent
        entityId={entityId}
        cardStore={cardStore}
        backLink={backLinkURL}
        isAfterAdd={isAfterAdd}
        entityType={entityType}
        mutationWarningShown={mutationWarningShown}
        fieldUsedInFormulaWarningShown={fieldUsedInFormulaWarningShown}
        fieldFormulaCircularDependencyWarningShown={fieldFormulaCircularDependencyWarningShown}
        hideMutationWarning={hideMutationWarning}
        hideFieldUsedInFormulaWarning={hideFieldUsedInFormulaWarning}
        hideFieldFormulaCircularDependencyWarning={hideFieldFormulaCircularDependencyWarning}
      />
    </LeftNavTemplate>
  );
});

CardPage.displayName = 'CardPage';
export { CardPage };
