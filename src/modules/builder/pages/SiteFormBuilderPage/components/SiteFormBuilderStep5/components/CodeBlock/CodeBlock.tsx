import { DropdownScrollbarMixin } from '@/shared';
import styled from 'styled-components';

export const CodeBlock = styled.code`
  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: var(--font-family-mono);
  color: var(--button-text-graphite-primary-text);

  border-radius: var(--border-radius-element);
  background-color: var(--background-noun-20);
  border: 1px solid var(--graphite-graphite-120);

  ${DropdownScrollbarMixin}

  padding: 12px;
`;
