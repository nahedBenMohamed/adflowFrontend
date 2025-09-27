import {
  EntityApiUtil,
  ErrorCode,
  MediaBreakpoints,
  SpanWithEllipsis,
  type EntityTypeLink,
  type Nullable,
  type Optional,
  type ServiceError,
} from '@/shared';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DeleteEntitiesBatchDto, UpdateEntitiesBatchDto } from '../../../../../../api';
import type { EntityBoardCardFilter } from '../../../../models';
import { BatchActionsCloseButton } from './BatchActionsCloseButton';
import { ChangeResponsibleAction } from './ChangeResponsibleAction';
import { ChangeStageAction } from './ChangeStageAction';
import { DeleteAction } from './DeleteAction';

const Root = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 32px;
  left: 0;

  width: 100%;

  display: flex;
  justify-content: center;

  z-index: 10;

  transition: var(--transition-200);
  scale: ${p => (p.$visible ? 1 : 0)};
  opacity: ${p => (p.$visible ? 1 : 0.5)};
`;

const Block = styled.div`
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  padding: 16px 24px;
  border-radius: 32px;
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    1px 1px 1px 2px rgba(146, 151, 176, 0.1),
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  @media ${MediaBreakpoints.SM} {
    flex-direction: column;
    gap: 20px;

    padding: 16px 20px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media ${MediaBreakpoints.SM} {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
`;

const SelectedAnnotation = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const SelectedAnnotationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const CloseButtonMobileWrapper = styled.div`
  display: none;

  @media ${MediaBreakpoints.SM} {
    display: flex;
  }
`;

const CloseButtonDesktopWrapper = styled.div`
  display: flex;

  @media ${MediaBreakpoints.SM} {
    display: none;
  }
`;

interface Props {
  totalCount: number;
  entityTypeId: number;
  selectedIds: number[];
  hideStageAction: boolean;
  boardId: Nullable<number>;
  filter: EntityBoardCardFilter;
  areAllEntitiesSelected: boolean;
  linkedEntityTypes: EntityTypeLink[];
  reload: () => void;
  handleClearSelected: () => void;
  showMutationWarning: Nullable<() => void>;
}

const BatchActions = (props: Props) => {
  const {
    totalCount,
    selectedIds,
    filter,
    entityTypeId,
    boardId,
    linkedEntityTypes,
    hideStageAction,
    areAllEntitiesSelected,
    reload,
    handleClearSelected,
    showMutationWarning,
  } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table.batch_actions',
  });

  const selectedCount = areAllEntitiesSelected ? totalCount : selectedIds.length;

  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleBatchDelete = async (): Promise<void> => {
    const dto = new DeleteEntitiesBatchDto({
      entityIds: areAllEntitiesSelected ? undefined : selectedIds,
      ...filter,
    });

    try {
      setDeleting(true);

      await EntityApiUtil.batchDeleteEntities({ entityTypeId, boardId, dto });

      handleClearSelected();
      reload();
    } finally {
      setDeleting(false);
    }
  };

  const handleBatchUpdate = async ({
    stageId,
    responsibleId,
    responsibleEntityTypeIds,
  }: {
    stageId?: number;
    responsibleId?: number;
    responsibleEntityTypeIds?: number[];
  }): Promise<void> => {
    const dto = new UpdateEntitiesBatchDto({
      entityIds: areAllEntitiesSelected ? undefined : selectedIds,
      stageId,
      responsibleUserId: responsibleId,
      responsibleEntityTypeIds,
      ...filter,
    });

    try {
      setUpdating(true);

      await EntityApiUtil.batchUpdateEntities({ entityTypeId, boardId, dto });

      handleClearSelected();
      reload();
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY) showMutationWarning?.();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Root $visible={selectedCount > 0}>
      <Block>
        <SelectedAnnotationWrapper>
          <SelectedAnnotation>
            <SpanWithEllipsis text={t('cards_selected', { count: selectedCount })} />
          </SelectedAnnotation>

          <CloseButtonMobileWrapper>
            <BatchActionsCloseButton onClick={handleClearSelected} />
          </CloseButtonMobileWrapper>
        </SelectedAnnotationWrapper>

        <ActionsWrapper>
          <ChangeResponsibleAction
            updating={updating}
            linkedEntityTypesLinks={linkedEntityTypes}
            handleBatchUpdate={handleBatchUpdate}
          />

          {!hideStageAction && (
            <ChangeStageAction
              updating={updating}
              entityTypeId={entityTypeId}
              handleBatchUpdate={handleBatchUpdate}
            />
          )}

          <DeleteAction deleting={deleting} handleBatchDelete={handleBatchDelete} />
        </ActionsWrapper>

        <CloseButtonDesktopWrapper>
          <BatchActionsCloseButton onClick={handleClearSelected} />
        </CloseButtonDesktopWrapper>
      </Block>
    </Root>
  );
};

export { BatchActions };
