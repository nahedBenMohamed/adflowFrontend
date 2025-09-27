import { boardApiUtil, entityTypeStore, iconStore } from '@/app';
import type { CreateTaskDto, TaskSettingsIdentifier, UserTimeAllocation } from '@/modules/tasks';
import {
  AddRoundButton,
  DefaultHeader,
  TruncateMixin,
  TutorialProductType,
  type DefaultHeaderModuleIconProps,
  type Entity,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CardTab, ORDER_NEW_PARAM_VALUE } from '../../models';
import { CardPageTasksProjectHeaderControls } from '../CardPageHeaderControls/CardPageTasksProjectHeaderControls';
import { RelocateCardButton } from '../RelocateCardButton/RelocateCardButton';

const EntityNameWrapper = styled.div`
  max-width: 100%;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EntityName = styled.span`
  max-width: 100%;

  font-size: 18px;
  font-weight: 600;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

export interface CardPageHeaderControlsProps {
  tab: CardTab;
  entityId: number;
  orderId: Nullable<string>;
  taskBoardId: Nullable<number>;
  timeAllocation: UserTimeAllocation[];
  identifier: Nullable<TaskSettingsIdentifier>;
  handleAddTask: (dto: CreateTaskDto) => Promise<void>;
  handleCreateNewOrder: () => void;
}

interface Props {
  entityTypeId: number;
  entity: Nullable<Entity>;
  entityStageId: Nullable<number>;
  controlsProps: CardPageHeaderControlsProps;
  changeEntityBoard: (boardId: number) => void;
}

const TAB_SALE_OR_RENTAL = [CardTab.SALE, CardTab.RENTAL];
const TAB_TASK_BOARD_LIST_OR_CALENDAR = [CardTab.BOARD, CardTab.LIST, CardTab.CALENDAR];

const CardPageHeader = observer((props: Props) => {
  const { entityTypeId, entity, entityStageId, controlsProps, changeEntityBoard } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui',
  });

  const { data: boards } = boardApiUtil.useGetBoardsByEntityTypeId({ entityTypeId });

  const entityType = entityTypeStore.getById(entityTypeId);

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () => ({
      icon: iconStore.getByName(entityType.section.icon).icon,
      color: iconStore.getEntityColorByEntityCategory(entityType.entityCategory),
    }),
    [entityType]
  );

  const CardPageHeaderControls = useMemo<ReactNode>(() => {
    const {
      tab,
      entityId,
      orderId,
      taskBoardId,
      timeAllocation,
      identifier,
      handleAddTask,
      handleCreateNewOrder,
    } = controlsProps;

    if (tab && taskBoardId && identifier && TAB_TASK_BOARD_LIST_OR_CALENDAR.includes(tab))
      return (
        <CardPageTasksProjectHeaderControls
          entityId={entityId}
          boardId={taskBoardId}
          identifier={identifier}
          timeAllocation={timeAllocation}
          handleAddTask={handleAddTask}
        />
      );

    if (tab && TAB_SALE_OR_RENTAL.some(t => tab.includes(t)) && orderId !== ORDER_NEW_PARAM_VALUE)
      return (
        <AddRoundButton
          label={t('card_page_header.create_new_order')}
          onClick={handleCreateNewOrder}
        />
      );

    return null;
  }, [controlsProps, t]);

  return (
    <DefaultHeader
      objectId={entityTypeId}
      unlimitedCentralContent
      moduleName={entityType.name}
      moduleIconProps={moduleIconProps}
      productType={TutorialProductType.ENTITY_TYPE}
      Controls={CardPageHeaderControls}
      CentralContent={
        entity && (
          <EntityNameWrapper>
            <EntityName>{entity.name}</EntityName>
          </EntityNameWrapper>
        )
      }
    >
      {Boolean(boards && boards.length > 1) && (
        <RelocateCardButton
          boards={boards!}
          entityStageId={entityStageId}
          changeEntityBoard={changeEntityBoard}
          activeBoardId={entity?.boardId ?? null}
        />
      )}
    </DefaultHeader>
  );
});

CardPageHeader.displayName = 'CardPageHeader';
export { CardPageHeader };
