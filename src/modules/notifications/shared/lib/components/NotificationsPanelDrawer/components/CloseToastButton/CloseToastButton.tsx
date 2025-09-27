import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { CloseIcon } from '../../../../../assets';

const CloseIconWrapper = styled.button`
  width: 16px;
  height: 16px;

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

const CloseToastButton = (props: HTMLAttributes<HTMLButtonElement>) => {
  const { onClick, ...rest } = props;

  return (
    <CloseIconWrapper type="button" onClick={onClick} {...rest}>
      <CloseIcon />
    </CloseIconWrapper>
  );
};

export default CloseToastButton;
