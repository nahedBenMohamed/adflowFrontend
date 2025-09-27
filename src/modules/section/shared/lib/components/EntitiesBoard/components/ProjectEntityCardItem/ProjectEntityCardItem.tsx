import { routes, userStore } from '@/app';
import {
  AvatarCircle,
  CardCopiedCountTag,
  SpanWithEllipsis,
  type Avatar,
  type User,
} from '@/shared';
import { Draggable } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useMemo, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import type { EntityBoardCard, ProjectEntityCard } from '../../../../models';
import { CardBlock, CardItemRoot, CardName } from '../CardItemCommon.styles';
import {
  CardFooter,
  CardHeader,
  DateBlocksWrapper,
  TaskIndicatorsBlock,
} from './ProjectEntityCardItem.styles';
import { DateBlock, ParticipantsBlock, TaskIndicator } from './components';

interface Props {
  entityBoardCard: EntityBoardCard;
  currentPathname: string;
  idx: number;
  handleMouseUp?: MouseEventHandler<HTMLAnchorElement>;
  handleMouseDown?: MouseEventHandler<HTMLAnchorElement>;
}

const ProjectEntityCardItem = observer((props: Props) => {
  const { entityBoardCard, idx, currentPathname, handleMouseUp, handleMouseDown } = props;

  const { t } = useTranslation('component.entity-board', {
    keyPrefix: 'entity_board.ui.project_entity_card_item',
  });

  const {
    id,
    name,
    endDate,
    ownerId,
    startDate,
    tasksCount,
    userRights,
    copiedFrom,
    copiedCount,
    entityTypeId,
    participantIds,
  } = entityBoardCard.data as ProjectEntityCard;

  const draggable = userRights.canEdit;
  const isOnSystemStage = entityBoardCard.closedAt !== null;

  const owner = userStore.getById(ownerId);

  const avatar = useMemo<Avatar>(() => owner.getAvatar(), [owner]);

  const participants = useMemo<User[]>(
    () => participantIds.map<User>(userStore.getById),
    [participantIds]
  );

  return (
    <Draggable key={id} isDragDisabled={!draggable} draggableId={String(id)} index={idx}>
      {(dragProvided, dragSnapshot) => (
        <CardItemRoot
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          $dragging={dragSnapshot.isDragging}
          to={routes.card({ entityTypeId, entityId: id, from: currentPathname })}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          <CardBlock
            $dragging={dragSnapshot.isDragging}
            $draggable={draggable}
            $focused={entityBoardCard.focused}
            $gap={12}
          >
            <CardHeader>
              <CardName $gray={isOnSystemStage}>
                <SpanWithEllipsis text={name} />

                {copiedCount && copiedFrom && (
                  <CardCopiedCountTag small copiedCount={copiedCount} entityTypeId={entityTypeId} />
                )}
              </CardName>

              {startDate && endDate && (
                <DateBlocksWrapper>
                  {startDate && <DateBlock label={t('start_date')} date={startDate} />}

                  {endDate && <DateBlock label={t('end_date')} date={endDate} />}
                </DateBlocksWrapper>
              )}
            </CardHeader>

            <TaskIndicatorsBlock>
              <TaskIndicator
                count={tasksCount.notResolved}
                title={t('titles.not_resolved')}
                color="var(--button-text-graphite-primary-text)"
              />
              <TaskIndicator
                count={tasksCount.overdue}
                title={t('titles.overdue')}
                color="var(--button-text-red-default)"
              />
              <TaskIndicator
                count={tasksCount.today}
                title={t('titles.today')}
                color="var(--button-text-green-default)"
              />
              <TaskIndicator
                count={tasksCount.resolved}
                title={t('titles.resolved')}
                color="var(--button-text-graphite-secondary-text)"
              />
            </TaskIndicatorsBlock>

            <CardFooter>
              <ParticipantsBlock participants={participants} />

              <AvatarCircle size="small" avatar={avatar} />
            </CardFooter>
          </CardBlock>
        </CardItemRoot>
      )}
    </Draggable>
  );
});

ProjectEntityCardItem.displayName = 'ProjectEntityCardItem';
export { ProjectEntityCardItem };
