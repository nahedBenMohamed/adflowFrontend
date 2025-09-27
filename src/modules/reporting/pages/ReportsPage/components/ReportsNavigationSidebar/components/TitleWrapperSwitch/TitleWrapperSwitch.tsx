import { TruncateMixin } from '@/shared';
import type { MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';
import { StyledTab } from '../TabLists/components/StyledTab/StyledTab';

const TitleStyledTab = styled(StyledTab)`
  max-width: 100%;

  padding: 6px 8px;
`;

const TitleDiv = styled.div`
  border: none;

  width: 100%;

  display: block;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 6px 8px 6px 24px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-graphite-priory-text);
    background: var(--graphite-graphite-40);
    cursor: pointer;
  }

  &::after {
    display: none;
  }

  &:active,
  &[data-active] {
    outline: none;

    color: var(--button-text-graphite-priory-text);
    background: var(--graphite-graphite-80);
  }

  ${TruncateMixin}
`;

interface Props {
  children: ReactNode;
  value?: string;
  handleToggle: MouseEventHandler<HTMLDivElement>;
}

const TitleWrapperSwitch = (props: Props) => {
  const { children, value, handleToggle } = props;

  return typeof value === 'string' ? (
    <TitleStyledTab value={value as string}>{children}</TitleStyledTab>
  ) : (
    <TitleDiv onClick={handleToggle}>{children}</TitleDiv>
  );
};

export { TitleWrapperSwitch };
