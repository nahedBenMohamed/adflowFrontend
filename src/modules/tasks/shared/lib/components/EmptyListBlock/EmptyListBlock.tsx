import type { Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CreateTaskDto, TaskSettingsIdentifier } from '../../../../api';
import { AddTaskButton } from '../AddTaskButton/AddTaskButton';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 40px 8px;
`;

const EmptyAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const EmptyAnnotationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  boardId: number;
  canCreate: boolean;
  entityId: Nullable<number>;
  identifier: Nullable<TaskSettingsIdentifier>;
  handleAddTask: (dto: CreateTaskDto) => Promise<void>;
}

const EmptyListBlock = (props: Props) => {
  const { boardId, canCreate, entityId, identifier, handleAddTask } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.empty_list_block',
  });

  return (
    <Root>
      <EmptyAnnotation>{t('annotation1')}</EmptyAnnotation>

      {canCreate && identifier && (
        <EmptyAnnotationWrapper>
          <EmptyAnnotation>{t('annotation2')}</EmptyAnnotation>

          <AddTaskButton
            identifier={identifier}
            boardId={boardId}
            entityId={entityId}
            handleAddTask={handleAddTask}
          />

          <EmptyAnnotation>{t('annotation3')}</EmptyAnnotation>
        </EmptyAnnotationWrapper>
      )}
    </Root>
  );
};

export { EmptyListBlock };
