import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../mixins';

interface LinkedEntityTagProps {
  $small?: boolean;
  $disabled?: boolean;
  $inactive?: boolean;
  $noTransition?: boolean;
  $maxWidth?: CSSProperties['maxWidth'];
}

export const LinkedEntityTag = styled(Link)<LinkedEntityTagProps>`
  max-width: ${p => p.$maxWidth ?? 'fit-content'};
  height: ${p => (p.$small ? 18 : 24)}px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-weight: 400;
  color: var(--primary-statuses-white-0);
  background-color: var(--primary-statuses-fuchsia-400);

  padding: 1px 6px 2px;
  border-radius: var(--border-radius-element);
  transition: ${p => (p.$noTransition ? 'none' : 'var(--transition-200)')};

  &:hover {
    color: var(--primary-statuses-white-0);
  }

  &[data-gantt-table-hidden='true'] {
    opacity: 0;
    pointer-events: none;
  }

  ${p =>
    p.$small
      ? css`
          font-size: 12px;
          line-height: 14px;
        `
      : css`
          font-size: 14px;
          line-height: 20px;
        `}

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.5;
      background-color: var(--button-text-graphite-secondary-text);
    `}

    ${p =>
    p.$inactive &&
    css`
      opacity: 0.8;
      background-color: var(--button-text-graphite-secondary-text);
    `}

  ${TruncateMixin}
`;
