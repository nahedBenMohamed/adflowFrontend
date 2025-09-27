import { appStore, boardApiUtil, entityTypeStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ActivitiesBoardIcon, TasksBoardIcon, TimeBoardIcon } from '../../../../assets';
import { FeatureCode, type Board } from '../../../models';
import type { Nullable } from '../../../types';
import { BoardItemPrimary } from '../../BoardItem/BoardItemPrimary/BoardItemPrimary';
import { BoardItemSecondary } from '../../BoardItem/BoardItemSecondary/BoardItemSecondary';
import { BoardList, BoardListItemWrapper, BoardListRoot } from '../components';

interface Props {
  boards: Board[];
  hasEditMode: boolean;
  activeBoardId: Nullable<number>;
  entityId?: number;
  entityTypeId?: number;
  maxHeight?: string;
  linkOnSettings?: boolean;
  fromPageEncoded?: string;
}

const TasksBoardList = observer((props: Props) => {
  const {
    boards,
    activeBoardId,
    hasEditMode,
    entityId,
    entityTypeId,
    maxHeight,
    linkOnSettings,
    fromPageEncoded,
  } = props;

  const { t } = useTranslation();
  const { pathname } = useLocation();

  const [hasActivitiesBoard, setHasActivitiesBoard] = useState(false);

  // we want to hide activities board if there is no entity type with activity feature
  useEffect(() => {
    if (!appStore.isLoaded) return;

    const entityTypeWithActivityFeature = entityTypeStore.entityTypes.find(et =>
      et.featureCodes.includes(FeatureCode.ACTIVITY)
    );

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    if (entityTypeWithActivityFeature) setHasActivitiesBoard(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore.isLoaded]);

  const getLink = useCallback(
    (boardId: number): string => {
      if (linkOnSettings)
        // entityId and entityTypeId should be provided if this is a project board,
        // so that after deletion we can navigate back to project overview
        return routes.taskBoardSettings({ boardId, from: fromPageEncoded, entityId, entityTypeId });

      return routes.tasksBoard(boardId);
    },
    [linkOnSettings, fromPageEncoded, entityId, entityTypeId]
  );

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || destination.index === source.index) return;

    const [moved] = boards.splice(source.index, 1);

    if (!moved) throw new Error('Failed to end drag, no board was moved');

    boards.splice(destination.index, 0, moved);

    boards.forEach((b, idx) => {
      b.sortOrder = idx + 1;

      boardApiUtil.changeBoardSortOrder({
        boardId: b.id,
        newSortOrder: idx + 1,
      });
    });
  };

  const isActivitiesActive = useMemo<boolean>(
    () => pathname.includes(routes.activitiesBase),
    [pathname]
  );
  const isTimeBoardActive = useMemo<boolean>(
    () => pathname.includes(routes.timeBoardBase()),
    [pathname]
  );

  const isAdmin = authStore.isAdmin();

  const sortedBoards = boards.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <BoardListRoot $maxHeight={maxHeight}>
      {hasActivitiesBoard && !linkOnSettings && (
        <BoardListItemWrapper>
          <BoardItemSecondary
            name={t('activities')}
            link={routes.activities}
            Icon={<ActivitiesBoardIcon />}
            active={isActivitiesActive}
          />
        </BoardListItemWrapper>
      )}

      {!linkOnSettings && (
        <BoardListItemWrapper>
          <BoardItemSecondary
            name={t('time_board')}
            Icon={<TimeBoardIcon />}
            link={routes.timeBoard()}
            active={isTimeBoardActive}
          />
        </BoardListItemWrapper>
      )}

      {isAdmin && sortedBoards.length > 1 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="workspace__SelectTask--DroppableList">
            {provided => (
              <BoardList ref={provided.innerRef} {...provided.droppableProps}>
                {/* Sorting in JSX made intentionally because otherwise DND lags */}
                {boards
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((b, idx) => (
                    <Draggable key={b.id} draggableId={String(b.id)} index={idx}>
                      {(provided, dragSnapshot) => (
                        <BoardListItemWrapper
                          ref={provided.innerRef}
                          $margin
                          {...provided.draggableProps}
                        >
                          <BoardItemPrimary
                            board={b}
                            hasEditMode={hasEditMode}
                            Icon={<TasksBoardIcon />}
                            templateLink={getLink(b.id)}
                            activeBoardId={activeBoardId}
                            dragging={dragSnapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </BoardListItemWrapper>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </BoardList>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        sortedBoards.map(b => (
          <BoardListItemWrapper key={b.id}>
            <BoardItemPrimary
              board={b}
              Icon={<TasksBoardIcon />}
              hasEditMode={hasEditMode}
              templateLink={getLink(b.id)}
              activeBoardId={activeBoardId}
            />
          </BoardListItemWrapper>
        ))
      )}
    </BoardListRoot>
  );
});

export { TasksBoardList };
