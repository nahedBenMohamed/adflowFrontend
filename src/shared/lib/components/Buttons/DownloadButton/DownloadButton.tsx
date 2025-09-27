import type { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { DownloadMediumIcon, DownloadSmallIcon } from '../../../../assets';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';

const Root = styled.button<{ $size: DownloadButtonSize }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }

  ${p =>
    p.$size === 'small' &&
    css`
      width: 16px;
      height: 16px;
    `}
`;

type DownloadButtonSize = 'small' | 'medium';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: DownloadButtonSize;
  loaderColor?: string;
}

const DownloadButton = (props: Props) => {
  const {
    loading,
    disabled,
    size = 'medium',
    loaderColor = 'var(--button-text-graphite-secondary-text)',
    ...rest
  } = props;

  const DownloadIcon = size === 'small' ? <DownloadSmallIcon /> : <DownloadMediumIcon />;

  return (
    <Root
      type="button"
      {...rest}
      $size={size}
      disabled={loading || disabled}
      className="workspace__DownloadButton--Root"
    >
      {loading ? <MiniLoader size="small" color={loaderColor} /> : DownloadIcon}
    </Root>
  );
};

export { DownloadButton };
