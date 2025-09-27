import { BoardListWithButtons, MyDropdown, type Board, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ArrowsExchangeIcon } from '../../../assets';

const Button = styled.button<{ $active: boolean }>`
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px 12px 8px 8px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        color: var(--button-text-green-active);

        border-color: #f3fded;
        background-color: #f3fded;

        svg path {
          fill: var(--button-text-green-active);
        }
      }

      &:active {
        color: var(--button-text-green-hover);

        border-color: #e6fbda;
        background-color: #e6fbda;

        svg path {
          fill: var(--button-text-green-hover);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      color: var(--graphite-graphite-840);

      border-color: var(--primary-statuses-green-520);

      svg path {
        fill: var(--graphite-graphite-840);
      }
    `}
`;

interface Props {
  boards: Board[];
  activeBoardId: Nullable<number>;
  entityStageId: Nullable<number>;
  changeEntityBoard: (boardId: number) => void;
}

const RelocateCardButton = observer((props: Props) => {
  const { boards, activeBoardId, entityStageId, changeEntityBoard } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.card_page_header',
  });

  const [boardsDropdownOpened, { close, open }] = useDisclosure(false);

  const handleChangeBoard = useCallback(
    (boardId: number) => {
      changeEntityBoard(boardId);

      close();
    },
    [changeEntityBoard, close]
  );

  if (!entityStageId) return null;

  return (
    <MyDropdown
      withinPortal
      position="bottom-start"
      opened={boardsDropdownOpened}
      Button={
        <Button $active={boardsDropdownOpened}>
          <ArrowsExchangeIcon />

          {t('relocate_card_button')}
        </Button>
      }
      hide={close}
      show={open}
    >
      <BoardListWithButtons
        boards={boards}
        activeBoardId={activeBoardId}
        onBoardChange={handleChangeBoard}
      />
    </MyDropdown>
  );
});

RelocateCardButton.displayName = 'RelocateCardButton';
export { RelocateCardButton };
