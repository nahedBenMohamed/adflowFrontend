import { routes, userStore } from '@/app';
import { AvatarCircle, CardCopiedCountTag, SpanWithEllipsis, type Avatar } from '@/shared';
import { Draggable } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useMemo, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import type { CommonEntityCard, EntityBoardCard } from '../../../../models';
import { CardBlock, CardItemRoot, CardName } from '../CardItemCommon.styles';
import {
  CardDate,
  CardFooter,
  CardHeader,
  HeaderBottomWrapper,
  HeaderTopWrapper,
  LinkedEntitiesDelimiter,
  LinkedEntitiesWrapper,
  StatusCircle,
  TaskStatusWrapper,
} from './CommonEntityCardItem.styles';
import { CommonEntityCardItemPriceBlock } from './CommonEntityCardItemPriceBlock';

interface Props {
  entityBoardCard: EntityBoardCard;
  currentPathname: string;
  idx: number;
  handleMouseUp?: MouseEventHandler<HTMLAnchorElement>;
  handleMouseDown?: MouseEventHandler<HTMLAnchorElement>;
}

const CommonEntityCardItem = observer((props: Props) => {
  const { entityBoardCard, idx, currentPathname, handleMouseUp, handleMouseDown } = props;

  const { t } = useTranslation('component.entity-board', {
    keyPrefix: 'entity_board.ui.common_entity_card',
  });

  const { price } = entityBoardCard;

  const data = entityBoardCard.data as CommonEntityCard;
  const {
    id,
    name,
    userId,
    createdAt,
    copiedFrom,
    userRights,
    copiedCount,
    entityTypeId,
    linkedEntityNames,
    taskIndicatorColor,
  } = data;

  const owner = userStore.getById(userId);
  const avatar = useMemo<Avatar>(() => owner.getAvatar(), [owner]);

  const draggable = userRights.canEdit;
  const isOnSystemStage = entityBoardCard.closedAt !== null;

  const firstLinkedEntityName = linkedEntityNames[0];
  const secondLinkedEntityName = linkedEntityNames[1];

  return (
    <Draggable isDragDisabled={!draggable} key={id} draggableId={id.toString()} index={idx}>
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
            $gap={8}
          >
            <CardHeader>
              <HeaderTopWrapper>
                <TaskStatusWrapper $indicatorColor={taskIndicatorColor} $gray={isOnSystemStage}>
                  <StatusCircle $indicatorColor={taskIndicatorColor} $gray={isOnSystemStage} />

                  {data.getCardStatusTitle({ indicatorColor: taskIndicatorColor, t })}
                </TaskStatusWrapper>

                <CardDate $gray={isOnSystemStage}>{createdAt.displayShort()}</CardDate>
              </HeaderTopWrapper>

              <HeaderBottomWrapper>
                <CardName $gray={isOnSystemStage}>
                  <SpanWithEllipsis text={name} />

                  {copiedCount && copiedFrom && (
                    <CardCopiedCountTag
                      small
                      copiedCount={copiedCount}
                      entityTypeId={entityTypeId}
                    />
                  )}
                </CardName>

                {(firstLinkedEntityName || secondLinkedEntityName) && (
                  <LinkedEntitiesWrapper>
                    {firstLinkedEntityName && (
                      <SpanWithEllipsis showTitle={false} text={firstLinkedEntityName} />
                    )}

                    {secondLinkedEntityName && firstLinkedEntityName && <LinkedEntitiesDelimiter />}

                    {secondLinkedEntityName && (
                      <SpanWithEllipsis showTitle={false} text={secondLinkedEntityName} />
                    )}
                  </LinkedEntitiesWrapper>
                )}
              </HeaderBottomWrapper>
            </CardHeader>

            <CardFooter>
              <CommonEntityCardItemPriceBlock price={price} isOnSystemStage={isOnSystemStage} />

              <AvatarCircle avatar={avatar} size="small" />
            </CardFooter>
          </CardBlock>
        </CardItemRoot>
      )}
    </Draggable>
  );
});

CommonEntityCardItem.displayName = 'CommonEntityCardItem';
export { CommonEntityCardItem };
