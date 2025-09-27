import { findSavedTasksFilter } from '@/modules/tasks';
import { UriCodingUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { TaskBoardFilterDto, type TaskSettingsIdentifier } from '../../../../api';
import type { TasksListsPageStore } from '../../../../store';
import { SELECTED_TASK_ID_PARAM, TasksFilterType } from '../../models';
import { TasksList } from '../TasksList/TasksList';

interface Props {
  boardId: number;
  entityId: number;
  settingsDrawerOpened: boolean;
  tasksListPageStore: TasksListsPageStore;
  filterDto: TaskBoardFilterDto;
  identifier: TaskSettingsIdentifier;
  hideSettingsDrawer: () => void;
}

const EntityTasksList = observer((props: Props) => {
  const {
    boardId,
    entityId,
    settingsDrawerOpened,
    tasksListPageStore,
    filterDto,
    identifier,
    hideSettingsDrawer,
  } = props;

  const { loadData, reset } = tasksListPageStore;

  const [searchParams] = useSearchParams();
  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const selectedTaskIdFromParams = searchParams.get(SELECTED_TASK_ID_PARAM);
  const selectedTaskId = selectedTaskIdFromParams ? Number(selectedTaskIdFromParams) : null;

  useEffect(() => {
    const filter = findSavedTasksFilter({
      boardId,
      filterType: TasksFilterType.TASK_BOARD_FILTER,
    });

    loadData({
      boardId,
      filterDto: filter
        ? { ...TaskBoardFilterDto.fromModel(filter), entityIds: [entityId] }
        : { entityIds: [entityId] },
    });

    return () => reset();
  }, [boardId, entityId, loadData, reset]);

  return (
    <TasksList
      boardId={boardId}
      entityId={entityId}
      filterDto={filterDto}
      identifier={identifier}
      selectedTaskId={selectedTaskId}
      currentPathname={currentPageEncodedUrl}
      tasksListPageStore={tasksListPageStore}
      settingsDrawerOpened={settingsDrawerOpened}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
});

EntityTasksList.displayName = 'EntityTasksList';
export { EntityTasksList };
