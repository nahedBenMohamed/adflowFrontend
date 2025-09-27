import type { UtcDate } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useImperativeHandle, useMemo, type MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GanttContext, type GanttContextValue } from '../../../../context';
import { GanttStore } from '../../../../store';
import { BAR_HEIGHT, TABLE_INDENT, type Dependence, type GanttRecord } from '../../models';
import type { GanttView } from '../../types';
import { GanttBody } from '../GanttBody/GanttBody';
import { GanttChart } from '../GanttChart/GanttChart';
import { TableBody } from '../GanttTable/TableBody/TableBody';
import { TableHeader } from '../GanttTable/TableHeader/TableHeader';
import { GanttViewSelect } from '../GanttViewSelect/GanttViewSelect';
import { RecordsContentDivider } from '../RecordsContentDivider/RecordsContentDivider';
import { RowSelectionIndicator } from '../RowSelectionIndicator/RowSelectionIndicator';
import { TimeAxis } from '../TimeAxis/TimeAxis/TimeAxis';
import { TimeAxisTodayIndicator } from '../TimeAxis/TimeAxisTodayIndicator/TimeAxisTodayIndicator';

const GanttHeader = styled.div`
  position: relative;

  width: 100%;
  height: 56px;

  overflow: hidden;
`;

const GanttContent = styled.div`
  position: relative;
  width: 100%;

  flex: 1;

  overflow: hidden auto;
  will-change: overflow, transform;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const EMPTY_DEPS_ARRAY: Dependence[] = [];

export interface GanttProps {
  data: GanttRecord[];
  boardId: number;
  isLoadingMore: boolean;
  view: GanttView;
  canLoadMore: boolean;
  rowHeight?: number;
  endDateKey?: string;
  startDateKey?: string;
  dependencies?: Dependence[];
  innerRef?: MutableRefObject<GanttRef>;
  entityId: GanttContextValue['entityId'];
  tasksProps?: GanttContextValue['tasksProps'];
  entityTypeId: GanttContextValue['entityTypeId'];
  tableIndent?: GanttContextValue['tableIndent'];
  scrollTop?: GanttContextValue['scrollTop'];
  loadMore: () => void;
  updateRecordTitle: GanttContextValue['updateRecordTitle'];
  updateResponsibleUser: GanttContextValue['updateResponsibleUser'];
  onExpand?: GanttContextValue['onExpand'];
  onBarClick?: GanttContextValue['onBarClick'];
  onRowClick?: GanttContextValue['onRowClick'];
  routeGenerator: GanttContextValue['routeGenerator'];
  renderGroupBar?: GanttContextValue['renderGroupBar'];
  onUpdate: (record: GanttRecord, startDate: string, endDate: string) => Promise<boolean>;
}
export interface GanttRef {
  backToday: () => void;
  getWidthByDates: ({ startDate, endDate }: { startDate: UtcDate; endDate: UtcDate }) => number;
}

const GanttViewComponent = observer((props: GanttProps) => {
  const {
    data,
    boardId,
    isLoadingMore,
    view,
    canLoadMore,
    innerRef,
    entityId,
    entityTypeId,
    tasksProps,
    scrollTop = true,
    dependencies = EMPTY_DEPS_ARRAY,
    tableIndent = TABLE_INDENT,
    loadMore,
    updateRecordTitle,
    updateResponsibleUser,
    onExpand,
    onUpdate,
    onBarClick,
    onRowClick,
    routeGenerator,
    renderGroupBar,
  } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_timeline.format',
  });

  const ganttStore = useMemo(
    () =>
      new GanttStore({
        activeView: view,
        boardId,
        type: entityTypeId ? 'project' : 'task',
        t,
      }),
    [boardId, entityTypeId, view, t]
  );

  useEffect(() => {
    ganttStore.setData(data);
  }, [data, ganttStore]);

  useEffect(() => {
    ganttStore.setDependencies(dependencies);
  }, [dependencies, ganttStore]);

  useEffect(() => {
    ganttStore.setOnUpdate(onUpdate);
  }, [ganttStore, onUpdate]);

  useImperativeHandle(innerRef, () => ({
    backToday: () => ganttStore.scrollToToday(),
    getWidthByDates: ganttStore.getWidthByDates,
  }));

  const ganttContextValue = useMemo<GanttContextValue>(
    () => ({
      entityId,
      scrollTop,
      tableIndent,
      canLoadMore,
      isLoadingMore,
      entityTypeId,
      tasksProps,
      store: ganttStore,
      barHeight: BAR_HEIGHT,
      loadMore,
      onExpand,
      onBarClick,
      onRowClick,
      routeGenerator,
      renderGroupBar,
      updateRecordTitle,
      updateResponsibleUser,
    }),
    [
      scrollTop,
      tableIndent,
      canLoadMore,
      entityId,
      entityTypeId,
      tasksProps,
      isLoadingMore,
      ganttStore,
      loadMore,
      updateRecordTitle,
      updateResponsibleUser,
      routeGenerator,
      onExpand,
      onRowClick,
      onBarClick,
      renderGroupBar,
    ]
  );

  return (
    <GanttContext.Provider value={ganttContextValue}>
      <GanttBody>
        <GanttHeader>
          <TableHeader />
          <TimeAxis />
        </GanttHeader>

        <GanttContent ref={ganttStore.mainElementRef} onScroll={ganttStore.handleScroll}>
          <RowSelectionIndicator />
          <TableBody />
          <GanttChart />
        </GanttContent>

        <RecordsContentDivider />

        <TimeAxisTodayIndicator />
        <GanttViewSelect />
      </GanttBody>
    </GanttContext.Provider>
  );
});

GanttViewComponent.displayName = 'GanttViewComponent';
export { GanttViewComponent };
