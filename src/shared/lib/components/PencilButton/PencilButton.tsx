import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { PencilMediumIcon, PencilSmallIcon } from '../../../assets';
import { MiniLoader } from '../Loaders/MiniLoader/MiniLoader';

interface CommonStylesProps {
  $active: boolean;
  $disabled: boolean;
}

const commonStyles = css<CommonStylesProps>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
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

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-active);
      }
    `}

  ${p => p.$disabled && `pointer-events: none`};
`;

const RootButton = styled.button<CommonStylesProps>`
  ${commonStyles}
`;

const RootLink = styled(Link)<CommonStylesProps>`
  display: block;

  ${commonStyles}
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type PencilButtonSize = 'small' | 'medium';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  active?: boolean;
  loading?: boolean;
  linkProps?: LinkProps;
  size?: PencilButtonSize;
}

const PencilButton = (props: Props) => {
  const {
    text,
    active = false,
    loading,
    linkProps,
    size = 'medium',
    disabled = false,
    ...buttonProps
  } = props;

  const InnerComponent = loading ? (
    <MiniLoader color="var(--button-text-graphite-secondary-text)" />
  ) : (
    <>
      <IconWrapper>{size === 'medium' ? <PencilMediumIcon /> : <PencilSmallIcon />}</IconWrapper>

      {text}
    </>
  );

  const commonProps = {
    size,
    $active: active,
    $disabled: disabled,
    className: 'workspace__PencilButton--Root',
  } satisfies CommonStylesProps | Props;

  return linkProps ? (
    <RootLink {...linkProps} {...commonProps}>
      {InnerComponent}
    </RootLink>
  ) : (
    <RootButton {...buttonProps} {...commonProps}>
      {InnerComponent}
    </RootButton>
  );
};

export { PencilButton };
