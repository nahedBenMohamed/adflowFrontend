import { authStore } from '@/modules/auth';
import { activityTypeStore, UpdateActivityTypeDto } from '@/modules/tasks';
import {
  DeleteButton,
  InputModel,
  MiniLoader,
  MyDropdownItemRoot,
  MyInput,
  PencilButton,
  SpanWithEllipsis,
  TruncateMixin,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';

const StyledMyDropdownItemRoot = styled(MyDropdownItemRoot)`
  gap: 8px;

  ${TruncateMixin}

  .workspace__DeleteButton--Root, .workspace__PencilButton--Root {
    scale: 0;
    opacity: 0;
    transition: var(--transition-200);
  }

  &:hover {
    .workspace__DeleteButton--Root,
    .workspace__PencilButton--Root {
      opacity: 1;
      scale: 1;
    }
  }
`;

const LoaderWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  id: number;
  label: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ActivityTypeItem = observer((props: Props) => {
  const { id, label, isActive, onSelect, onDelete } = props;

  const [isEditMode, { close: hideEditMode, open: showEditMode }] = useDisclosure(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = authStore.isAdmin();

  const model = useLocalObservable(() => InputModel.create(label).required());

  const onSave = async (): Promise<void> => {
    if (!model.validate()) return;

    const dto: UpdateActivityTypeDto = { name: model.trimmedValue };

    try {
      setIsUpdating(true);

      await activityTypeStore.update({ id, dto });
    } catch (e) {
      console.error(`Error while updating activity type ${id}: ${e}`);
    } finally {
      setIsUpdating(false);
    }

    hideEditMode();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSave();
  };

  const handlePencilButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isEditMode) {
      onSave();

      return;
    }

    flushSync(() => {
      showEditMode();
    });

    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (isEditMode) onSave();
  };

  return (
    <StyledMyDropdownItemRoot $active={isActive} onClick={onSelect}>
      {isEditMode ? (
        <MyInput
          ref={inputRef}
          hasBorderBottom
          fontSize="small"
          model={model}
          hasBorderBottomLight
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <SpanWithEllipsis text={label} />
      )}

      <ButtonsWrapper>
        {isAdmin &&
          (isUpdating ? (
            <LoaderWrapper>
              <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
            </LoaderWrapper>
          ) : (
            <PencilButton onClick={handlePencilButtonClick} />
          ))}

        <DeleteButton size="small" onClick={onDelete} />
      </ButtonsWrapper>
    </StyledMyDropdownItemRoot>
  );
});

ActivityTypeItem.displayName = 'ActivityTypeItem';
export { ActivityTypeItem };
