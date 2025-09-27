import { BigPlusIcon } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid var(--button-text-graphite-secondary-text);

  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }
`;

const Root = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);

    ${IconWrapper} {
      border-color: var(--button-text-green-hover);

      svg path {
        fill: var(--button-text-green-hover);
      }
    }
  }

  &:active {
    color: var(--button-text-green-active);

    ${IconWrapper} {
      border-color: var(--button-text-green-active);

      svg path {
        fill: var(--button-text-green-active);
      }
    }
  }
`;

interface Props {
  children: ReactNode;
  onClick: () => void;
}

const AddButton = (props: Props) => {
  const { children, onClick } = props;

  return (
    <Root type="button" onClick={onClick}>
      <IconWrapper>
        <BigPlusIcon />
      </IconWrapper>

      {children}
    </Root>
  );
};

export { AddButton };
