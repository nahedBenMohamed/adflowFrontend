import { generalSettingsStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  ColorUtil,
  ColumnCount,
  ColumnCountGhost,
  Currency,
  DoubleRightLegacy,
  EntityCategory,
  PencilButton,
  Scrollbar,
  currencyFormatterHelper,
  useTypedParams,
  type Nullable,
  type StageGroup,
} from '@/shared';
import { Droppable } from '@hello-pangea/dnd';
import { Transition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect, type MouseEventHandler } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { entitiesCardStore } from '../../../../../../store';
import { type EntityBoardCardFilter } from '../../../../models';
import { AddCardButton } from '../../../AddCardButton/AddCardButton';
import { CommonEntityCardItem } from '../EntityCardItem/CommonEntityCardItem';
import { ProjectEntityCardItem } from '../ProjectEntityCardItem/ProjectEntityCardItem';
import {
  CardList,
  CardListDroppableArea,
  ColumnHeader,
  ColumnHeaderDivider,
  ColumnHeaderRight,
  ColumnTitle,
  ColumnTop,
  IconWrapper,
  LoadMoreObserver,
  Root,
  TotalSum,
} from './EntitiesColumn.styles';

interface Props {
  stageGroup: StageGroup;
  createEntityPath: Nullable<string>;
  metaLoaded: boolean;
  priceHidden: boolean;
  currentPageEncodedUrl: string;
  filter: EntityBoardCardFilter;
  handleMouseUpOnCard?: MouseEventHandler<HTMLAnchorElement>;
  handleMouseDownOnCard?: MouseEventHandler<HTMLAnchorElement>;
}

const EntitiesColumn = observer((props: Props) => {
  const {
    stageGroup,
    createEntityPath,
    metaLoaded,
    priceHidden,
    filter,
    currentPageEncodedUrl,
    handleMouseUpOnCard,
    handleMouseDownOnCard,
  } = props;

  const { boardId, entityTypeId } = useTypedParams<{ entityTypeId: number; boardId: number }>();

  const { accountSettings } = generalSettingsStore;

  const { stage } = stageGroup;
  const entities = stageGroup.entities;

  const { isIntersecting, ref: lastElement } = useIntersectionObserver({});

  const isAdmin = authStore.isAdmin();

  const stageMeta = entitiesCardStore.getMetaByStageId(stage.id);
  const { hasPrice } = entitiesCardStore.meta;

  const color = ColorUtil.getProcessedBGColor(stage.color);

  useEffect(() => {
    if (isIntersecting)
      entitiesCardStore.loadMoreCards({ entityTypeId, boardId, stageId: stage.id, filter });
  }, [isIntersecting, boardId, stage.id, entityTypeId, filter]);

  return (
    <Root>
      <ColumnHeader>
        <ColumnTop $hoverable={isAdmin}>
          <ColumnTitle
            title={stage.name}
            $titleColor={stage.isSystem ? color : 'var(--button-text-graphite-priory-text)'}
          >
            {stage.name}
          </ColumnTitle>

          <ColumnHeaderRight>
            {isAdmin && (
              <PencilButton
                linkProps={{
                  to: routes.entityTypeBoardSettings({
                    boardId,
                    entityTypeId,
                    from: currentPageEncodedUrl,
                  }),
                }}
              />
            )}

            {metaLoaded ? (
              <ColumnCount count={stageMeta.totalCount} />
            ) : (
              <ColumnCountGhost $medium />
            )}

            <IconWrapper $color={color}>
              <DoubleRightLegacy />
            </IconWrapper>
          </ColumnHeaderRight>
        </ColumnTop>

        <ColumnHeaderDivider $bgColor={color} />

        <Transition transition="scale-y" mounted={metaLoaded && hasPrice && !priceHidden}>
          {transitionStyles => (
            <TotalSum style={transitionStyles}>
              {currencyFormatterHelper.format({
                value: stageMeta.totalPrice,
                currency: accountSettings?.currency || Currency.USD,
              })}
            </TotalSum>
          )}
        </Transition>
      </ColumnHeader>

      <Scrollbar>
        <Droppable droppableId={String(stage.id)}>
          {dropProvided => (
            <CardListDroppableArea ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              <CardList $empty={!entities.length && !createEntityPath}>
                {createEntityPath && <AddCardButton path={createEntityPath} />}

                {(createEntityPath || entities.length !== 0) &&
                  entities.map((e, idx) => {
                    if (e.entityCategory === EntityCategory.PROJECT)
                      return (
                        <ProjectEntityCardItem
                          key={e.id}
                          idx={idx}
                          entityBoardCard={e}
                          currentPathname={currentPageEncodedUrl}
                          handleMouseUp={handleMouseUpOnCard}
                          handleMouseDown={handleMouseDownOnCard}
                        />
                      );

                    return (
                      <CommonEntityCardItem
                        key={e.id}
                        idx={idx}
                        entityBoardCard={e}
                        currentPathname={currentPageEncodedUrl}
                        handleMouseUp={handleMouseUpOnCard}
                        handleMouseDown={handleMouseDownOnCard}
                      />
                    );
                  })}

                {dropProvided.placeholder}

                <LoadMoreObserver ref={lastElement} />
              </CardList>
            </CardListDroppableArea>
          )}
        </Droppable>
      </Scrollbar>
    </Root>
  );
});

EntitiesColumn.displayName = 'EntitiesColumn';
export { EntitiesColumn };
