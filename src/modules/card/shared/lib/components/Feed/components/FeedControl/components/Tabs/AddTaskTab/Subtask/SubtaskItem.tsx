import { type Subtask } from '@/modules/tasks';
import { DragFieldIcon, InputModel, MyCheckbox, MyTextArea } from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, type KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CloseCrossIcon } from '../../../../../../../../../assets';

const CloseCrossIconWrapper = styled.button<{ $visible: boolean }>`
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  transform-origin: top;
  scale: ${p => (p.$visible ? 1 : 0)};
  opacity: ${p => (p.$visible ? 1 : 0)};

  // for proper vertical alignment
  padding-top: 3px;
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-default);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

const Root = styled.div`
  display: flex;
  gap: 8px;

  textarea {
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
  }

  &:hover {
    ${CloseCrossIconWrapper} {
      opacity: 1;
      scale: 1;
    }
  }
`;

const TextBlockWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 4px;
`;

const TextWrapper = styled.div<{ $resolved: boolean }>`
  flex: 1;

  // for proper vertical alignment
  padding-top: 3px;

  ${p =>
    p.$resolved &&
    css`
      textarea {
        text-decoration: line-through;
        color: var(--button-text-graphite-secondary-text);
      }
    `}
`;

const CheckboxWrapper = styled.div`
  // for proper vertical alignment
  padding-top: 2px;
`;

const DragIconWrapper = styled.div`
  width: 16px;
  height: 20px;

  flex-shrink: 0;
`;

interface Props {
  subtask: Subtask;
  autoFocus: boolean;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  onEnter: () => void;
  onDelete: () => void;
}

const SubtaskItem = observer((props: Props) => {
  const { subtask, autoFocus, dragHandleProps, onEnter, onDelete } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.add_task_modal',
  });

  const textModel = useLocalObservable(() => InputModel.create(subtask.text).required());

  const [isFocused, { open: handleFocus, close: handleBlur }] = useDisclosure(false);

  const handleCheckboxChange = useCallback(() => {
    if (!textModel.validate()) return;

    subtask.resolved = !subtask.resolved;
  }, [subtask, textModel]);

  const handleTextareaChange = useCallback((value: string) => (subtask.text = value), [subtask]);

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    e => {
      if (e.key === 'Enter') {
        e.preventDefault();

        onEnter();
      }
    },
    [onEnter]
  );

  return (
    <Root>
      <DragIconWrapper {...dragHandleProps}>
        <DragFieldIcon />
      </DragIconWrapper>

      <CheckboxWrapper>
        <MyCheckbox checked={subtask.resolved} onChange={handleCheckboxChange} />
      </CheckboxWrapper>

      <TextBlockWrapper>
        <TextWrapper $resolved={subtask.resolved}>
          <MyTextArea
            model={textModel}
            autoFocus={autoFocus}
            hiddenlyDisabled={subtask.resolved}
            placeholder={t('placeholders.subtask')}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            handleChange={handleTextareaChange}
          />
        </TextWrapper>

        <CloseCrossIconWrapper $visible={isFocused} onClick={onDelete}>
          <CloseCrossIcon />
        </CloseCrossIconWrapper>
      </TextBlockWrapper>
    </Root>
  );
});

SubtaskItem.displayName = 'SubtaskItem';
export { SubtaskItem };
