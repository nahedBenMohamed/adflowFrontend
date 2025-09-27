import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const FieldLinkWrapper = styled(Link)<{ $primaryActive?: boolean }>`
  width: var(--field-component-height);
  height: var(--field-component-height);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  border: 1px solid var(--graphite-graphite-80);

  &,
  svg path {
    transition: var(--transition-200);
  }

  &:not(:disabled):hover {
    cursor: pointer;

    border-color: var(--button-text-green-default);

    svg path {
      fill: var(--graphite-graphite-840);
    }
  }

  &:not(:disabled):active {
    border-color: #eaf1e4;
    background-color: #eaf1e4;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:disabled {
    cursor: not-allowed;

    opacity: 0.8;
  }

  ${p =>
    p.$primaryActive &&
    css`
      border-color: var(--button-text-green-active);

      svg path {
        fill: var(--graphite-graphite-840);
      }
    `};
`;
