import styled, { css } from 'styled-components';
import { TextareaSaveIcon } from '../../../../../../assets';
import { SentIconLegacy } from '../../../../Icons/SentIconLegacy/SentIconLegacy';
import { MiniLoader } from '../../../../Loaders/MiniLoader/MiniLoader';

const DisabledButton = css`
  &:disabled {
    svg path {
      opacity: 0.5;
    }

    pointer-events: none;
  }
`;

const SaveButtonWrapper = styled.button`
  position: absolute;
  right: 0;
  bottom: 2px;

  width: 16px;
  height: 16px;

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

  ${DisabledButton}
`;

const SendButtonWrapper = styled.button`
  position: absolute;
  right: 0;
  bottom: 1px;

  width: 22px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }

  ${DisabledButton}
`;

interface Props {
  type: RightButtonIconType;
  loading: boolean;
  visible: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export type RightButtonIconType = 'send' | 'save';

const MINI_LOADER_COLOR = 'var(--button-text-graphite-secondary-text)';

const RightButton = (props: Props) => {
  const { type, loading, visible, disabled = false, onClick } = props;

  if (!visible) return null;

  if (type === 'save') {
    return (
      <SaveButtonWrapper onClick={onClick} disabled={disabled}>
        {loading ? <MiniLoader color={MINI_LOADER_COLOR} /> : <TextareaSaveIcon />}
      </SaveButtonWrapper>
    );
  }

  if (type === 'send') {
    return (
      <SendButtonWrapper onClick={onClick} disabled={disabled}>
        {loading ? <MiniLoader color={MINI_LOADER_COLOR} /> : <SentIconLegacy />}
      </SendButtonWrapper>
    );
  }

  return null;
};

export { RightButton };
