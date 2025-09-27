import { boardApiUtil, entityTypeStore, routes } from '@/app';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import { ProjectBoardIcon } from '../../../../assets';
import { useTypedParams } from '../../../hooks';
import { EntityCategory, SectionView, type Board } from '../../../models';
import type { EntityBoardLinkType } from '../../../types';
import { BoardItemPrimary } from '../../BoardItem/BoardItemPrimary/BoardItemPrimary';
import { BoardList, BoardListItemWrapper, BoardListRoot } from '../components';

interface Props {
  boards: Board[];
  hasEditMode: boolean;
  linkType: EntityBoardLinkType;
  entityTypeId: number;
  isDraggable?: boolean;
  activeBoardId?: number;
  tabFromParams?: SectionView;
  maxHeight?: CSSProperties['maxHeight'];
  noPadding?: boolean;
  fromPageEncoded?: string;
}

const BoardListWithLinks = observer((props: Props) => {
  const {
    boards,
    hasEditMode,
    linkType,
    entityTypeId,
    isDraggable,
    maxHeight,
    activeBoardId,
    tabFromParams,
    noPadding,
    fromPageEncoded,
  } = props;

  const { entityId: entityIdFromParams } = useTypedParams<{ entityId?: number }>();

  const et = entityTypeStore.getById(entityTypeId);

  const getTemplateLink = ({
    entityTypeId,
    boardId,
  }: {
    entityTypeId: number;
    boardId: number;
  }): string => {
    // this means we are on card page and currentTab is no longer a valid param
    if (entityIdFromParams) return routes.boardSection({ entityTypeId, boardId });

    if (linkType === 'common') {
      if (tabFromParams && tabFromParams !== SectionView.DASHBOARD)
        return routes.entitiesSection({ entityTypeId, boardId, tab: tabFromParams });

      const hasDashboard = ![
        EntityCategory.PROJECT,
        EntityCategory.PARTNER,
        EntityCategory.UNIVERSAL,
      ].includes(et.entityCategory);

      if (tabFromParams && tabFromParams === SectionView.DASHBOARD && hasDashboard)
        return routes.entitiesSection({ entityTypeId, boardId, tab: tabFromParams });

      return routes.boardSection({ entityTypeId, boardId });
    }

    return routes.entityTypeBoardSettings({ entityTypeId, boardId, from: fromPageEncoded });
  };

  const onDragEnd = ({ source, destination }: DropResult, boards: Board[]) => {
    if (!destination || destination.index === source.index) return;

    const [moved] = boards.splice(source.index, 1);

    if (!moved) throw new Error('Failed to end drag, no board was moved');

    boards.splice(destination.index, 0, moved);

    boards.forEach((b, idx) => {
      b.sortOrder = idx + 1;

      boardApiUtil.changeBoardSortOrder({ boardId: b.id, newSortOrder: idx + 1 });
    });
  };

  const sortedBoards = boards.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <BoardListRoot $maxHeight={maxHeight} $noPadding={noPadding}>
      {isDraggable && boards.length > 1 ? (
        <DragDropContext onDragEnd={r => onDragEnd(r, boards)}>
          <Droppable droppableId="workspace__SelectBoard--DroppableList">
            {provided => (
              <BoardList ref={provided.innerRef} {...provided.droppableProps}>
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
                            key={b.id}
                            etId={et.id}
                            hasEditMode={hasEditMode}
                            Icon={<ProjectBoardIcon />}
                            dragging={dragSnapshot.isDragging}
                            activeBoardId={activeBoardId ?? null}
                            dragHandleProps={provided.dragHandleProps}
                            templateLink={getTemplateLink({ entityTypeId, boardId: b.id })}
                          />
                        </BoardListItemWrapper>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}

                <BoardListItemWrapper $margin>
                  <BoardItemPrimary
                    board={null}
                    etId={et.id}
                    hasEditMode={false}
                    activeBoardId={null}
                    Icon={<ProjectBoardIcon />}
                  />
                </BoardListItemWrapper>
              </BoardList>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        sortedBoards.map(b => (
          <BoardListItemWrapper key={b.id} $noPadding={noPadding}>
            <BoardItemPrimary
              board={b}
              etId={et.id}
              hasEditMode={hasEditMode}
              Icon={<ProjectBoardIcon />}
              activeBoardId={activeBoardId ?? null}
              templateLink={getTemplateLink({ entityTypeId, boardId: b.id })}
            />
          </BoardListItemWrapper>
        ))
      )}
    </BoardListRoot>
  );
});

BoardListWithLinks.displayName = 'BoardListWithLinks';
export { BoardListWithLinks };
