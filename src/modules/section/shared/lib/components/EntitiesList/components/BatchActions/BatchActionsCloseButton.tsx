import styled from 'styled-components';
import { CloseIcon } from '../../../../../assets';

const Root = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

interface Props {
  onClick: () => void;
}

const BatchActionsCloseButton = (props: Props) => {
  const { onClick } = props;

  return (
    <Root onClick={onClick}>
      <CloseIcon />
    </Root>
  );
};

export { BatchActionsCloseButton };
