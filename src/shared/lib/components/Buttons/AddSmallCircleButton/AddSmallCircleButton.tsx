import { memo, type HTMLAttributes } from 'react';
import styled from 'styled-components';
import { AddCircleIcon } from '../../../../assets';

const Root = styled.button<{ $bigger?: boolean }>`
  outline: none;

  width: ${p => (p.$bigger ? 20 : 16)}px;
  height: ${p => (p.$bigger ? 20 : 16)}px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;

    path {
      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    svg path {
      stroke: var(--button-text-graphite-primary-text);
    }
  }

  &:active {
    svg path {
      stroke: var(--button-text-graphite-secondary-text);
    }
  }
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  bigger?: boolean;
}

const AddSmallCircleButton = memo((props: Props) => {
  const { bigger, ...rest } = props;

  return (
    <Root $bigger={bigger} type="button" {...rest}>
      <AddCircleIcon />
    </Root>
  );
});

AddSmallCircleButton.displayName = 'AddSmallCircleButton';
export { AddSmallCircleButton };
