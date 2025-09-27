import { PlusSecondaryIcon } from '@/shared';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-secondary-text);

    transition: var(--transition-200);
  }
`;

const Root = styled(Link)`
  width: 100%;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px;
  margin-bottom: 8px;
  border-radius: var(--border-radius-block);
  background-color: var(--primary-statuses-white-0);

  &:nth-last-child(2) {
    margin-bottom: 0;
  }

  &:hover {
    ${IconWrapper} {
      border-color: var(--button-text-green-hover);

      svg path {
        fill: var(--button-text-green-hover);
      }
    }
  }

  &:active {
    ${IconWrapper} {
      border-color: var(--button-text-green-active);

      svg path {
        fill: var(--button-text-green-active);
      }
    }
  }
`;

interface Props {
  path: string;
}

const AddCardButton = memo((props: Props) => {
  const { path } = props;

  return (
    <Root to={path}>
      <IconWrapper>
        <PlusSecondaryIcon />
      </IconWrapper>
    </Root>
  );
});

AddCardButton.displayName = 'AddCardButton';
export { AddCardButton };
