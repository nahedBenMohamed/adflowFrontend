import type { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { BackspaceIcon } from '../../../../../../../assets';

const Root = styled.button`
  outline: none;

  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    svg {
      scale: 0.9;
    }
  }
`;

const BackspaceButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Root {...props}>
      <BackspaceIcon />
    </Root>
  );
};

export { BackspaceButton };
