import { TruncateMixin } from '@/shared';
import { Tabs } from '@mantine/core';
import styled from 'styled-components';

export const StyledTab = styled(Tabs.Tab)`
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

  &::after {
    display: none;
  }

  &:hover {
    color: var(--button-text-graphite-priory-text);
    background: var(--graphite-graphite-40);
  }

  &:active,
  &[data-active] {
    outline: none;

    color: var(--button-text-graphite-priory-text);
    background: var(--graphite-graphite-80);
  }

  ${TruncateMixin}
`;
