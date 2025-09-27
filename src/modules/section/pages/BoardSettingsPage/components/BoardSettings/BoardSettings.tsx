import { AutomationSidebar, type AutomationStore } from '@/modules/automation';
import { BoardType, PlusIconSquareLegacy } from '@/shared';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { BoardSettingsStore } from '../../../../store';
import { StageColumn } from '../StageColumn/StageColumn';

const Root = styled.div`
  height: 100%;

  display: flex;
`;

const StagesWrapper = styled.div`
  height: 100%;

  display: flex;

  padding: 16px 0 16px;
`;

const StageColumnWrapper = styled.div`
  display: flex;
`;

interface PlusIconPositionProps {
  $hidden: boolean;
  $hasMarginLeft?: boolean;
}

const PlusIconPosition = styled.div<PlusIconPositionProps>`
  position: relative;

  display: ${p => (p.hidden ? 'none' : 'block')};

  margin-left: ${p => (p.$hasMarginLeft ? '32px' : '0')};
`;

const PlusIconWrapper = styled.div`
  position: absolute;
  top: 25px;
  left: -35px;

  width: 26px;
  height: 26px;

  z-index: 1;

  border-radius: var(--border-radius-block);
  background-color: var(--primary-statuses-white-0);
  transition: var(--transition-200);

  svg rect,
  path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg rect,
    path {
      stroke: var(--button-text-green-default);
    }
  }

  &:active {
    scale: 0.95;

    svg rect,
    path {
      stroke: var(--button-text-green-active);
    }
  }
`;

interface Props {
  boardType: BoardType;
  boardSettingsStore: BoardSettingsStore;
  automationStore?: AutomationStore;
}

const BoardSettings = observer((props: Props) => {
  const { boardType, boardSettingsStore, automationStore } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common',
  });

  const getAddGroupHandler = useCallback(
    (atIdx: number) => () => boardSettingsStore.addStage({ atIdx, name: t('new_stage') }),
    [boardSettingsStore, t]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || result.destination.index === result.source.index) return;

      const { destination, draggableId } = result;

      boardSettingsStore.moveGroup({ id: +draggableId, atIdx: destination.index });
    },
    [boardSettingsStore]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Root>
        <Droppable droppableId="workspace__BoardSettings--Wrapper" direction="horizontal">
          {provided => (
            <StagesWrapper ref={provided.innerRef} {...provided.droppableProps}>
              {boardType === BoardType.ENTITY_TYPE && automationStore && <AutomationSidebar />}

              {boardSettingsStore.ordinaryStages.length > 0 ? (
                boardSettingsStore.ordinaryStages
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((s, idx) => (
                    <Draggable
                      key={s.id}
                      index={idx}
                      draggableId={s.id.toString()}
                      isDragDisabled={s.isSystem}
                    >
                      {provided => (
                        <StageColumnWrapper ref={provided.innerRef} {...provided.draggableProps}>
                          <StageColumn
                            key={s.id}
                            stage={s}
                            boardType={boardType}
                            store={boardSettingsStore}
                            isSystem={s.isSystem}
                            automationStore={automationStore}
                            dragHandleProps={provided.dragHandleProps}
                          />

                          <PlusIconPosition $hidden={s.isSystem}>
                            <PlusIconWrapper onClick={getAddGroupHandler(s.sortOrder + 1)}>
                              <PlusIconSquareLegacy />
                            </PlusIconWrapper>
                          </PlusIconPosition>
                        </StageColumnWrapper>
                      )}
                    </Draggable>
                  ))
              ) : (
                <PlusIconPosition $hidden={false} $hasMarginLeft>
                  <PlusIconWrapper onClick={getAddGroupHandler(0)}>
                    <PlusIconSquareLegacy />
                  </PlusIconWrapper>
                </PlusIconPosition>
              )}

              {provided.placeholder}
            </StagesWrapper>
          )}
        </Droppable>

        <StagesWrapper>
          {boardSettingsStore.systemStages.map(s => (
            <StageColumn
              key={s.id}
              stage={s}
              boardType={boardType}
              store={boardSettingsStore}
              isSystem={s.isSystem}
              automationStore={automationStore}
            />
          ))}
        </StagesWrapper>
      </Root>
    </DragDropContext>
  );
});

BoardSettings.displayName = 'BoardSettings';
export { BoardSettings };
