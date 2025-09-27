import styled, { css } from 'styled-components';

interface Props {
  $danger?: boolean;
  $outlined?: boolean;
  $smallText?: boolean;
  $secondary?: boolean;
}

export const FormulaKeyButton = styled.button<Props>`
  outline: none;

  width: 136px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${p =>
    p.$smallText
      ? css`
          font-size: 14px;
          line-height: 20px;
        `
      : css`
          font-size: 20px;
          line-height: 24px;
        `}
  color: var(--button-text-graphite-priory-text);
  font-weight: ${p => (p.$smallText ? 500 : 400)};

  padding: 8px;
  border-radius: var(--border-radius-element);
  background-color: ${p =>
    p.$secondary ? 'var(--graphite-graphite-40)' : 'var(--graphite-graphite-20)'};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: ${p =>
      p.$secondary ? 'var(--graphite-graphite-80)' : 'var(--graphite-graphite-40)'};
  }

  &:active {
    scale: 0.95;

    background-color: ${p =>
      p.$secondary ? 'var(--graphite-graphite-120)' : 'var(--graphite-graphite-80)'};
  }

  ${p =>
    p.$danger &&
    css`
      svg path {
        transition: var(--transition-200);
      }

      &:hover {
        background-color: var(--background-red-20);

        svg path {
          stroke: var(--button-text-red-hover);
        }
      }

      &:active {
        background-color: var(--neutral-red-100);

        svg path {
          stroke: var(--button-text-red-active);
        }
      }
    `}

  ${p => p.$outlined && `border: 1px solid var(--graphite-graphite-120)`};
`;
