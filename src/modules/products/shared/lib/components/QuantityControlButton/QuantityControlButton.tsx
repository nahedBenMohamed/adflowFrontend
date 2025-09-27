import styled from 'styled-components';
import { DecrementIcon, IncrementIcon } from '../../../assets';

const Root = styled.button`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);
  background: var(--button-text-graphite-secondary-text);
  border-radius: var(--border-radius-element);

  &:hover {
    cursor: pointer;
  }

  &:active {
    background-color: var(--button-text-graphite-primary-text);
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }
`;

type QuantityControlButtonType = 'increment' | 'decrement';

interface Props {
  type: QuantityControlButtonType;
  disabled?: boolean;
  onClick?: () => void;
}

const QuantityControlButton = (props: Props) => {
  const { type, disabled, onClick } = props;

  return (
    <Root disabled={disabled} onClick={onClick}>
      {type === 'increment' ? <IncrementIcon /> : <DecrementIcon />}
    </Root>
  );
};

export { QuantityControlButton };
