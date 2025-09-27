import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';

const Root = styled.button<{ $variant: ControlButtonVariant }>`
  height: 25px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  padding: 2px 8px 3px;
  border-radius: var(--border-radius-element);
  background: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--button-text-green-active);
  }

  &:active {
    background: var(--button-text-green-hover);
  }

  &:disabled {
    opacity: 0.5;

    pointer-events: none;
  }

  ${p =>
    p.$variant === 'cancel' &&
    css`
      color: var(--button-text-graphite-secondary-text);

      background: transparent;

      &:hover {
        color: var(--button-text-graphite-primary-text);

        background: transparent;
      }

      &:active {
        color: var(--button-text-graphite-secondary-text);

        background: transparent;
      }
    `}

  ${p =>
    p.$variant === 'outlined' &&
    css`
      color: var(--button-text-graphite-secondary-text);

      background-color: transparent;
      border: 1px solid var(--button-text-graphite-secondary-text);

      &:hover {
        color: var(--button-text-graphite-primary-text);

        background-color: transparent;
        border-color: var(--button-text-graphite-primary-text);
      }

      &:active {
        color: var(--button-text-graphite-secondary-text);

        background-color: transparent;
        border-color: var(--button-text-graphite-secondary-text);
      }
    `}
`;

type ControlButtonVariant = 'save' | 'cancel' | 'outlined';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: ControlButtonVariant;
}

const ControlButton = (props: Props) => {
  const { children, loading = false, variant = 'save', ...rest } = props;

  return (
    <Root type="button" {...rest} $variant={variant}>
      {loading && (
        <MiniLoader
          size="small"
          color={
            variant === 'save'
              ? 'var(--primary-statuses-white-0)'
              : 'var(--button-text-graphite-secondary-text)'
          }
        />
      )}
      {children}
    </Root>
  );
};

export { ControlButton };
