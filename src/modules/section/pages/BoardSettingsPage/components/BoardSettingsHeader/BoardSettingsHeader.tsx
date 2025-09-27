import { boardApiUtil, entityTypeStore, iconStore } from '@/app';
import {
  DefaultHeader,
  EntitiesAndBoardsPicker,
  EntitiesBoardPicker,
  EntityCategory,
  IconName,
  PrimaryButton,
  TasksBoardPicker,
  TutorialProductType,
  WarningModal,
  type Board,
  type DefaultHeaderModuleIconProps,
  type EntityType,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  boardId: number;
  boards?: Optional<Board[]>;
  deleteLastWarningTitle: string;
  deleteLastWarningAnnotation: string;
  canDelete?: boolean;
  entityTypeId?: number;
  onDelete: () => void;
  onCancel: () => void;
}

const BoardSettingsHeader = observer((props: Props) => {
  const {
    boardId,
    boards,
    deleteLastWarningTitle,
    deleteLastWarningAnnotation,
    canDelete,
    entityTypeId,
    onDelete,
    onCancel,
  } = props;

  const { t: t1 } = useTranslation('common', {
    keyPrefix: 'buttons',
  });
  const { t: t2 } = useTranslation('page.board-settings', {
    keyPrefix: 'board_settings.ui.board_settings_header',
  });

  const { data: tasksBoards } = boardApiUtil.useGetTasksBoards();

  const [isModalOpened, { close: hideModal, open: showModal }] = useDisclosure(false);

  const et = entityTypeId ? entityTypeStore.getById(entityTypeId) : null;

  const getEntitiesBoardPicker = useCallback(
    (et: EntityType): ReactNode => {
      const contactOrCompanySection = Boolean(
        et && [EntityCategory.COMPANY, EntityCategory.CONTACT].includes(et.entityCategory)
      );

      return contactOrCompanySection ? (
        <EntitiesAndBoardsPicker et={et} tab={null} activeBoardId={boardId} linkType="settings" />
      ) : boards ? (
        <EntitiesBoardPicker
          linkType="settings"
          boards={boards}
          activeBoardId={boardId}
          entityTypeId={et.id}
        />
      ) : null;
    },
    [boardId, boards]
  );

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () =>
      et
        ? {
            icon: iconStore.getByName(et.section.icon).icon,
            color: iconStore.getEntityColorByEntityCategory(et.entityCategory),
          }
        : {
            color: iconStore.systemModuleColor,
            icon: iconStore.getByName(IconName.TICK_1).icon,
          },
    [et]
  );

  return (
    <DefaultHeader
      objectId={entityTypeId}
      moduleName={t2('header')}
      moduleIconProps={moduleIconProps}
      productType={TutorialProductType.ENTITY_TYPE}
      Controls={
        <>
          <PrimaryButton variant="empty-danger" onClick={showModal}>
            {t2('delete_board')}
          </PrimaryButton>

          <PrimaryButton variant="outlined" onClick={onCancel}>
            {t2('leave')}
          </PrimaryButton>
        </>
      }
    >
      {entityTypeId && et ? (
        getEntitiesBoardPicker(et)
      ) : tasksBoards ? (
        <TasksBoardPicker linkOnSettings activeBoardId={boardId} boards={tasksBoards} />
      ) : null}

      {canDelete ? (
        <WarningModal
          title={t2('title')}
          height="fit-content"
          maxHeight="fit-content"
          isOpened={isModalOpened}
          annotation={t2('annotation')}
          onClose={hideModal}
          onApprove={onDelete}
        />
      ) : (
        <WarningModal
          hideApprove
          icon="warning"
          height="fit-content"
          maxHeight="fit-content"
          isOpened={isModalOpened}
          cancelTitle={t1('continue')}
          title={deleteLastWarningTitle}
          annotation={deleteLastWarningAnnotation}
          onClose={hideModal}
        />
      )}
    </DefaultHeader>
  );
});

BoardSettingsHeader.displayName = 'BoardSettingsHeader';
export { BoardSettingsHeader };
