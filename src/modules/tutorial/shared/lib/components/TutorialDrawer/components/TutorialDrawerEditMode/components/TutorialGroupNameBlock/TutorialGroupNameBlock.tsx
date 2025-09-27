import { DeleteButton, DragFieldIcon, TruncateMixin, type InputModel } from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type Ref,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: 39px;

  display: flex;
  align-items: center;
  gap: 16px;
`;

const DragIconWrapper = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }
`;

const CommonStyles = css`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-element);
`;

const StyledInput = styled.input<{ $invalid: boolean }>`
  outline: none;
  background-color: transparent;

  width: 100%;

  transition: var(--transition-200);

  ${CommonStyles}

  border-color: ${p =>
    p.$invalid ? 'var(--button-text-red-hover)' : 'var(--graphite-graphite-120)'};

  ${p =>
    !p.$invalid &&
    css`
      &:not(:focus):hover {
        border-color: var(--button-text-graphite-secondary-text);
      }

      &:focus {
        border-color: var(--button-text-green-active);
        box-shadow: 1px 1px 6px 0px var(--button-text-green-default);
      }
    `}

  &:disabled {
    pointer-events: none;

    opacity: 0.6;
    border-color: var(--button-text-graphite-secondary-text);
  }

  &::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }
`;

const NameBlock = styled.div`
  width: 100%;

  &:hover {
    cursor: pointer;
  }

  ${CommonStyles}
  ${TruncateMixin};
`;

const DeleteButtonWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  ref?: Ref<HTMLInputElement>;
  model: InputModel;
  inputDisabled?: boolean;
  alwaysEditMode?: boolean;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  handleSaveOnEnter?: () => void;
  handleDeleteForm?: () => void;
  handleChangeName?: (name: string) => void;
}

const TutorialGroupNameBlock = observer((props: Props) => {
  const {
    ref,
    model,
    alwaysEditMode = false,
    inputDisabled,
    dragHandleProps,
    handleSaveOnEnter,
    handleDeleteForm,
    handleChangeName,
  } = props;

  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer.tutorial_group_name_block',
  });

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const [editMode, { open: openEditMode, close: closeEditMode }] = useDisclosure(false);

  const isEditMode = alwaysEditMode || editMode;

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const { value } = e.target;

      setValue(value);
      model.setValue(value);

      handleChangeName?.(value);
    },
    [model, handleChangeName]
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key === 'Enter') handleSaveOnEnter?.();
    },
    [handleSaveOnEnter]
  );

  const handleCloseEditMode = useCallback(() => {
    if (alwaysEditMode || !model.validate()) return;

    closeEditMode();
  }, [alwaysEditMode, model, closeEditMode]);

  return (
    <Root>
      <DragIconWrapper disabled={isEditMode} {...dragHandleProps}>
        <DragFieldIcon />
      </DragIconWrapper>

      {isEditMode ? (
        <StyledInput
          ref={ref}
          autoFocus
          value={value}
          disabled={inputDisabled}
          $invalid={!model.isValid()}
          placeholder={t('placeholders.group_name')}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleCloseEditMode}
        />
      ) : (
        <NameBlock onClick={openEditMode}>{value}</NameBlock>
      )}

      {!isEditMode && handleDeleteForm && (
        <DeleteButtonWrapper>
          <DeleteButton onClick={handleDeleteForm} />
        </DeleteButtonWrapper>
      )}
    </Root>
  );
});

TutorialGroupNameBlock.displayName = 'TutorialGroupNameBlock';
export { TutorialGroupNameBlock };
