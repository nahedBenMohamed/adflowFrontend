import { UpdateBoardDto, boardApiUtil, routes } from '@/app';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { DragFieldIcon } from '../../../../assets';
import { InputModel, type Board } from '../../../models';
import type { Nullable } from '../../../types';
import { BoardNameStyle } from '../../BoardList/components';
import { MyInput } from '../../Form/Input/MyInput/MyInput';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';
import { PencilButton } from '../../PencilButton/PencilButton';
import { SpanWithEllipsis } from '../../SpanWithEllipsis/SpanWithEllipsis';

interface RootProps {
  $draggable: boolean;
  $dragging?: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  display: flex;
  align-items: center;
  gap: 2px;

  transition: var(--transition-200);

  ${p => p.$dragging && `opacity: 0.5`};
  ${p => p.$draggable && `margin-left: -22px`};
`;

const DraggableIconWrapper = styled.div`
  opacity: 0;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  // to align with BoardItemWrapper
  margin-top: 2px;
  transition: var(--transition-200);
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg {
    width: 16px;
    height: 16px;
  }

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }
`;

export const BoardName = styled.div`
  ${BoardNameStyle}
`;

interface BoardItemWrapperProps {
  $active: boolean;
  $draggable: boolean;
  $pencilVisible: boolean;
  $padding?: CSSProperties['padding'];
}

const BoardItemWrapper = styled.div<BoardItemWrapperProps>`
  width: 100%;
  max-width: ${p => p.$draggable && `calc(100% - 22px)`};
  height: 25px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);

  border-radius: var(--border-radius-element);
  padding: ${p => p.$padding ?? '4px 12px 4px 8px'};
  transition: var(--transition-200);

  .workspace__PencilButton--Root {
    opacity: 0;
    scale: 0;

    will-change: opacity, scale;
    transition-delay: var(--transition-200);
    transition: var(--transition-200);
  }

  input {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    color: var(--button-text-graphite-priory-text);

    padding-bottom: 1px;
  }

  &:hover {
    cursor: pointer;

    .workspace__PencilButton--Root {
      scale: 1;
      opacity: 1;
    }
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        color: var(--button-text-green-active);
        background-color: #f3fded;

        ${BoardName} {
          color: var(--button-text-green-active);
        }

        ${IconWrapper} {
          svg path {
            fill: var(--button-text-green-active);
          }
        }
      }

      &:active {
        color: var(--button-text-green-hover);
        background-color: #e6fbda;

        ${BoardName} {
          color: var(--button-text-green-hover);
        }

        ${IconWrapper} {
          svg path {
            fill: var(--button-text-green-hover);
          }
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-green-active);
      background-color: #f3fded;

      ${BoardName} {
        color: var(--button-text-green-active);
      }

      ${IconWrapper} {
        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}

  ${p =>
    p.$pencilVisible &&
    css`
      .workspace__PencilButton--Root {
        display: flex;
      }
    `}
`;

const LoaderWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  board: Nullable<Board>;
  activeBoardId: Nullable<number>;
  hasEditMode: boolean;
  Icon?: ReactNode;
  etId?: number;
  templateLink?: string;
  padding?: CSSProperties['padding'];
  dragging?: boolean;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  onBoardChange?: (boardId: number) => void;
}

const BoardItemPrimary = observer((props: Props) => {
  const {
    board,
    etId,
    Icon,
    hasEditMode,
    templateLink,
    activeBoardId,
    padding,
    dragging,
    dragHandleProps,
    onBoardChange,
  } = props;

  const { t } = useTranslation();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isEditMode, { close: hideEditMode, open: showEditMode }] = useDisclosure(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const boardModel = useLocalObservable(() => InputModel.create(board?.name).required());

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputFocused, { open: onInputFocus, close: onInputBlur }] = useDisclosure(false);

  const onSave = async (): Promise<void> => {
    if (!boardModel.validate() || !board) return;

    const dto = new UpdateBoardDto({ name: boardModel.value, sortOrder: board.sortOrder });

    try {
      setIsUpdating(true);

      await boardApiUtil.updateBoard({ dto, boardId: board.id });
    } catch (e) {
      console.error(`Error while updating board ${board.id}: ${e}`);
    } finally {
      setIsUpdating(false);
    }

    hideEditMode();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSave();

    onInputBlur();
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

    onInputBlur();
  };

  const handleItemClick = () => {
    if (isEditMode) return;

    if (templateLink) {
      navigate(templateLink);

      return;
    }

    if (!board && etId) {
      navigate(routes.everything(etId));

      return;
    }

    if (!board) throw new Error(`Failed to navigate to Everything Page: etId is not specified`);

    onBoardChange?.(board.id);
  };

  return (
    <Root
      $dragging={dragging}
      $draggable={Boolean(dragHandleProps)}
      className="workspace__BoardItemPrimary--Root"
    >
      {dragHandleProps && (
        <DraggableIconWrapper
          className="workspace__BoardItemPrimary--DraggableIconWrapper"
          {...dragHandleProps}
        >
          <DragFieldIcon />
        </DraggableIconWrapper>
      )}

      <BoardItemWrapper
        $padding={padding}
        $pencilVisible={inputFocused}
        $draggable={Boolean(dragHandleProps)}
        $active={
          board?.id === activeBoardId ||
          pathname === templateLink ||
          Boolean(board === null && etId && pathname.includes(routes.everything(etId))) ||
          Boolean(
            etId &&
              pathname.includes(
                routes.entitiesSectionBase({ entityTypeId: etId, boardId: board?.id })
              )
          )
        }
        onClick={handleItemClick}
      >
        <IconWrapper>{Icon}</IconWrapper>

        {isEditMode ? (
          <MyInput
            ref={inputRef}
            hasBorderBottom
            fontSize="small"
            model={boardModel}
            hasBorderBottomLight
            onBlur={handleBlur}
            onFocus={onInputFocus}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <BoardName>
            <SpanWithEllipsis text={board?.name || t('all_cards')} />
          </BoardName>
        )}

        {hasEditMode &&
          (isUpdating ? (
            <LoaderWrapper>
              <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
            </LoaderWrapper>
          ) : (
            <PencilButton onClick={handlePencilButtonClick} />
          ))}
      </BoardItemWrapper>
    </Root>
  );
});

BoardItemPrimary.displayName = 'BoardItemPrimary';
export { BoardItemPrimary };
