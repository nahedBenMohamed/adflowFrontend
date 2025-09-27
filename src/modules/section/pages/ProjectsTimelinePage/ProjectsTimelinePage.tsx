import { routes } from '@/app';
import { CardTab } from '@/modules/card';
import {
  type GanttProps,
  GanttRecord,
  type GanttView,
  GanttViewComponent,
  type TimelineRouteGenerator,
} from '@/modules/gantt';
import { NoSelectMixin, type Optional, UriCodingUtil, WholePageLoaderWithLogo } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { EntityBoardCardFilter } from '../../shared';
import type { ProjectsTimelinePageStore } from '../../store';

const Root = styled.div`
  width: 100%;
  height: calc(100dvh - var(--header-with-subheader-height));

  padding: 16px 0;
`;

const GanttWrapper = styled.div`
  height: 100%;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0 1px 2px 0 #d0daeb,
    0 0 2px 0 #eef4fe;

  ${NoSelectMixin}
`;

interface Props {
  view: GanttView;
  boardId: number;
  entityTypeId: number;
  filter: EntityBoardCardFilter;
  savedFilter: Optional<EntityBoardCardFilter>;
  projectsTimelinePageStore: ProjectsTimelinePageStore;
  routeGenerator: TimelineRouteGenerator;
}

const ProjectsTimelinePage = observer((props: Props) => {
  const {
    view,
    boardId,
    entityTypeId,
    filter,
    savedFilter,
    projectsTimelinePageStore,
    routeGenerator,
  } = props;

  const {
    projects,
    isLoaded,
    isLoadingMore,
    canLoadMore,
    updateProjectTitle,
    updateProjectResponsibleUser,
    updateProjectDates,
    loadData,
    loadMore,
    reset,
  } = projectsTimelinePageStore;

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  useEffect(() => {
    loadData(savedFilter ?? {});

    return () => reset();
  }, [savedFilter, loadData, reset]);

  // This class might remain from task bar dragging, so we need to get rid of it
  useEffect(() => {
    return () => document.body.classList.remove('no-selection');
  }, []);

  const getLoadMoreHandler = useCallback(() => () => loadMore(filter), [filter, loadMore]);

  const handleUpdateProject = useCallback<GanttProps['onUpdate']>(
    async (record, startDate, endDate): Promise<boolean> => {
      const id = record.id;

      return await updateProjectDates({
        id,
        startDate,
        endDate,
      });
    },
    [updateProjectDates]
  );

  const onRowClick = useCallback(
    (record: GanttRecord) => {
      navigate(
        routes.card({
          entityTypeId,
          entityId: record.id,
          from: currentPageEncodedUrl,
          tab: CardTab.OVERVIEW,
        })
      );
    },
    [currentPageEncodedUrl, entityTypeId, navigate]
  );

  return (
    <Root>
      <GanttWrapper>
        {isLoaded ? (
          <GanttViewComponent
            view={view}
            data={GanttRecord.fromProjects({ projects, boardId })}
            boardId={boardId}
            canLoadMore={canLoadMore}
            entityId={null}
            entityTypeId={entityTypeId}
            isLoadingMore={isLoadingMore}
            onUpdate={handleUpdateProject}
            loadMore={getLoadMoreHandler()}
            onRowClick={onRowClick}
            updateRecordTitle={updateProjectTitle}
            routeGenerator={routeGenerator}
            updateResponsibleUser={updateProjectResponsibleUser}
          />
        ) : (
          <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="32px" />
        )}
      </GanttWrapper>
    </Root>
  );
});

ProjectsTimelinePage.displayName = 'ProjectsTimelinePage';
export { ProjectsTimelinePage };
