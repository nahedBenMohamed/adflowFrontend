import type { CSSProperties } from 'react';
import styled from 'styled-components';

interface HeaderButtonProps {
  $inversed?: boolean;
  $padding?: CSSProperties['padding'];
}

export const HeaderButton = styled.button<HeaderButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${p =>
    p.$inversed ? 'var(--button-text-green-default)' : 'var(--primary-statuses-white-0)'};

  border-radius: var(--border-radius-element);
  padding: ${p => p.$padding || '7px 16px 8px 16px'};
  background: ${p => (p.$inversed ? 'transparent' : 'var(--button-text-green-default)')};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: ${p => p.$inversed && 'var(--button-text-green-hover)'};

    background: ${p => !p.$inversed && 'var(--button-text-green-hover)'};
  }

  &:active {
    color: ${p => p.$inversed && 'var(--button-text-green-active)'};
    background: ${p => !p.$inversed && 'var(--button-text-green-active)'};
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.6;
  }
`;
