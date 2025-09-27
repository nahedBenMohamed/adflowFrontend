import { CheckDoneIcon, DeleteButton, MoreIcon, MyDropdown, type Nullable } from '@/shared';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CopyIcon } from '../../../../../../assets';

const MoreIconWrapper = styled.button<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-default);
      }
    `}
`;

const List = styled.div`
  display: flex;
  flex-direction: column;

  padding: 6px 0;
`;

const Option = styled.div<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 12px;
  white-space: nowrap;
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: #f3fded;

    ${p =>
      p.$danger &&
      css`
        color: var(--button-text-red-default);

        svg path {
          fill: var(--button-text-red-default);
        }
      `}
  }

  &:active {
    background-color: #e6fbda;
  }
`;

const OptionIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  taskId: number;
  canDelete?: boolean;
  onDelete: Nullable<(id: number) => void>;
  hideModal: () => void;
}

const TaskControlsBlock = (props: Props) => {
  const { taskId, onDelete, hideModal } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.task_item',
  });

  const [opened, { close: hide, open: show }] = useDisclosure(false);
  const clipboard = useClipboard({ timeout: 1500 });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(taskId);

      hide();
      hideModal();
    }
  };

  const handleCopy = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    clipboard.copy(window.location.href);
  };

  return (
    <MyDropdown
      position="bottom-end"
      opened={opened}
      Button={
        <MoreIconWrapper $active={opened}>
          <MoreIcon />
        </MoreIconWrapper>
      }
      hide={hide}
      show={show}
    >
      <List>
        <Option onClick={handleCopy}>
          <OptionIconWrapper>
            {clipboard.copied ? <CheckDoneIcon /> : <CopyIcon />}
          </OptionIconWrapper>

          {t('copy_link')}
        </Option>

        {onDelete && (
          <Option $danger>
            <DeleteButton text={t('delete_task')} fontWeight={400} onClick={handleDelete} />
          </Option>
        )}
      </List>
    </MyDropdown>
  );
};

export { TaskControlsBlock };
