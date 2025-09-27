import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { AddSquareIcon } from '../../../../assets';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  transition: var(--transition-200);

  svg rect {
    fill: var(--primary-blue);
    transition: var(--transition-200);
  }
`;

const Button = styled.button<{ $green?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${p => (p.$green ? 'var(--button-text-green-default)' : 'var(--primary-blue)')};
  transition: var(--transition-200);

  svg rect {
    fill: ${p => (p.$green ? 'var(--button-text-green-default)' : 'var(--primary-blue)')};
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    color: ${p => (p.$green ? 'var(--button-text-green-hover)' : 'var(--button-text-blue-hover)')};

    svg rect {
      fill: ${p => (p.$green ? 'var(--button-text-green-hover)' : 'var(--button-text-blue-hover)')};
    }
  }

  &:active {
    color: ${p =>
      p.$green ? 'var(--button-text-green-active)' : 'var(--button-text-blue-active)'};

    svg rect {
      fill: ${p =>
        p.$green ? 'var(--button-text-green-active)' : 'var(--button-text-blue-active)'};
    }
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }
`;

interface Props {
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  isGreen?: boolean;
  onClick: () => void;
}

const PlusIconButton = observer((props: Props) => {
  const { text, loading, disabled, isGreen, onClick } = props;

  return (
    <Button type="button" $green={isGreen} disabled={disabled} onClick={onClick}>
      {loading ? (
        <MiniLoader color={isGreen ? 'var(--button-text-green-default)' : 'var(--primary-blue)'} />
      ) : (
        <IconWrapper>
          <AddSquareIcon />
        </IconWrapper>
      )}

      {text}
    </Button>
  );
});

PlusIconButton.displayName = 'PlusIconButton';
export { PlusIconButton };
