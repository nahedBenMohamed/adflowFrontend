import type { TaskFieldCode } from '@/modules/tasks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TaskSettingsDropdown } from '../TaskSettingsDropdown/TaskSettingsDropdown';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  activeFields: TaskFieldCode[];
  onSelect: (activeFields: string[]) => void;
}

const AddTaskModalHeader = (props: Props) => {
  const { activeFields, onSelect } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.add_task_modal',
  });

  return (
    <Root>
      <ModalLabel>{t('new_task')}</ModalLabel>

      <TaskSettingsDropdown activeFields={activeFields} onSelect={onSelect} />
    </Root>
  );
};

export { AddTaskModalHeader };
