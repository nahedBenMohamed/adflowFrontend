import { boardApiUtil, entityTypeStore, routes } from '@/app';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ProjectBoardIcon } from '../../../../../../assets';
import { isPathnameOnEntitySection } from '../../../../../helpers';
import { useTypedParams } from '../../../../../hooks';
import { EntityCategory, SectionView, type Board, type EntityType } from '../../../../../models';
import type { EntityBoardLinkType, Nullable } from '../../../../../types';
import { SectionLinkUtil } from '../../../../../utils';
import { BoardItemPrimary } from '../../../../BoardItem/BoardItemPrimary/BoardItemPrimary';
import { BoardItemSecondary } from '../../../../BoardItem/BoardItemSecondary/BoardItemSecondary';
import { BoardList, BoardListItemWrapper, BoardListRoot } from '../../../../BoardList/components';

const Title = styled.div`
  font-size: 10px;
  line-height: 18px;
  font-weight: 600;
  color: var(--button-text-graphite-primary-text);

  margin-left: 16px;
`;

const BoardListWithTitle = styled.li`
  display: flex;
  flex-direction: column;
  gap: 4px;

  margin-top: 8px;
`;

interface Props {
  entityTypes: EntityType[];
  maxHeight: CSSProperties['maxHeight'];
  hasBoardNameEditMode: boolean;
  currentTab: Nullable<SectionView>;
  isDraggable?: boolean;
  activeBoardId?: number;
  noPadding?: boolean;
  linkType?: EntityBoardLinkType;
  fromPageEncoded?: string;
}

const EntitiesAndBoardsList = observer((props: Props) => {
  const {
    entityTypes,
    activeBoardId,
    maxHeight,
    hasBoardNameEditMode,
    currentTab,
    isDraggable,
    noPadding,
    linkType = 'common',
    fromPageEncoded,
  } = props;

  const { pathname } = useLocation();
  const { entityId: entityIdFromParams } = useTypedParams<{ entityId?: number }>();

  const isOnEntitiesSection = useCallback(
    (etId: number): boolean => isPathnameOnEntitySection({ pathname, entityTypeId: etId }),
    [pathname]
  );

  const boardsQueries = boardApiUtil.useGetBoardsByEntityTypeIds(entityTypes.map(et => et.id));

  const getLink = useCallback(
    ({ etId, boardId }: { etId: number; boardId?: number }): string => {
      // Tab is only used when we're changing boards from entities sections to preserve current active tab.
      // e.g. we're on entities board page -> list tab -> changing board -> we're on another board on the same list tab.
      // In other cases we don't need to pass tab to BoardListWithLinks, because it could lead to errors (such
      // as when we're on page which also has tab path param, let's say "Overview", and we don't want to pass it because
      // on entities section page it will lead to blank screen).

      // ... Or this means we are on card page and currentTab is no longer a valid param
      if (entityIdFromParams || !isOnEntitiesSection(etId))
        return SectionLinkUtil.getSectionLink(etId);

      if (boardId) {
        if (linkType === 'settings')
          return routes.entityTypeBoardSettings({
            boardId,
            entityTypeId: etId,
            from: fromPageEncoded,
          });

        if (currentTab && ![SectionView.DASHBOARD, SectionView.REPORTS].includes(currentTab))
          return routes.entitiesSection({ entityTypeId: etId, boardId, tab: currentTab });

        const et = entityTypeStore.getById(etId);

        const hasReports = ![
          EntityCategory.PROJECT,
          EntityCategory.PARTNER,
          EntityCategory.UNIVERSAL,
        ].includes(et.entityCategory);

        if (
          currentTab &&
          [SectionView.DASHBOARD, SectionView.REPORTS].includes(currentTab) &&
          hasReports
        )
          return routes.entitiesSection({ entityTypeId: etId, boardId, tab: currentTab });

        return routes.boardSection({ entityTypeId: etId, boardId });
      }

      return SectionLinkUtil.getSectionLink(etId);
    },
    [currentTab, linkType, entityIdFromParams, fromPageEncoded, isOnEntitiesSection]
  );

  const onDragEnd = ({ source, destination }: DropResult, boards: Board[]) => {
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

  return (
    <BoardListRoot $maxHeight={maxHeight} $noPadding={noPadding}>
      {entityTypes.map((et, idx) => {
        const boards = boardsQueries[idx]?.data;

        return (
          <Fragment key={et.id}>
            {boards && boards.length > 0 ? (
              <BoardListWithTitle>
                <Title>{et.section.name}</Title>

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
                                      etId={et.id}
                                      Icon={<ProjectBoardIcon />}
                                      hasEditMode={hasBoardNameEditMode}
                                      dragging={dragSnapshot.isDragging}
                                      activeBoardId={activeBoardId ?? null}
                                      dragHandleProps={provided.dragHandleProps}
                                      templateLink={getLink({ etId: et.id, boardId: b.id })}
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
                  boards
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map(b => (
                      <BoardListItemWrapper key={b.id} $noPadding={noPadding}>
                        <BoardItemPrimary
                          board={b}
                          etId={et.id}
                          Icon={<ProjectBoardIcon />}
                          hasEditMode={hasBoardNameEditMode}
                          activeBoardId={activeBoardId ?? null}
                          templateLink={getLink({ etId: et.id, boardId: b.id })}
                        />
                      </BoardListItemWrapper>
                    ))
                )}
              </BoardListWithTitle>
            ) : (
              linkType === 'common' && (
                <BoardListItemWrapper $noPadding={noPadding}>
                  <BoardItemSecondary
                    name={et.section.name}
                    Icon={<ProjectBoardIcon />}
                    link={getLink({ etId: et.id })}
                  />
                </BoardListItemWrapper>
              )
            )}
          </Fragment>
        );
      })}
    </BoardListRoot>
  );
});

EntitiesAndBoardsList.displayName = 'EntitiesAndBoardsList';
export { EntitiesAndBoardsList };
