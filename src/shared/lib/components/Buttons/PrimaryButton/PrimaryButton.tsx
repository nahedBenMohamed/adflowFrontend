import type { ButtonHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { NoSelectMixin } from '../../../mixins';
import type { PrimaryButtonVariant } from '../../../models';
import { MiniLoader } from '../../Loaders/MiniLoader/MiniLoader';

const HighlightGradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

interface CommonRootProps {
  $svgPathFillHover?: string;
  $variant?: PrimaryButtonVariant;
  $height?: CSSProperties['height'];
  $padding?: CSSProperties['padding'];
}

const CommonStyles = css<CommonRootProps>`
  position: relative;

  height: ${p => p.$height ?? '32px'};
  width: fit-content;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  padding: 5px 16px 6px;
  border-radius: var(--border-radius-element);
  background-color: var(--button-text-green-default);

  transition-property: background-color, color, border-color, opacity;
  transition-duration: var(--transition-duration);
  transition-timing-function: var(--transition-timing-function);

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-green-hover);
    color: var(--primary-statuses-white-0);

    ${p =>
      p.$svgPathFillHover &&
      css`
        svg path {
          fill: ${p.$svgPathFillHover};
        }
      `}
  }

  &:active {
    background-color: var(--button-text-green-active);
    color: var(--primary-statuses-white-0);
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;

    ${NoSelectMixin}
  }

  ${p =>
    (p.$variant === 'outlined' || p.$variant === 'link-outlined') &&
    css`
      background-color: transparent;
      border: 1px solid
        ${p.$variant === 'link-outlined'
          ? 'var(--button-text-green-default)'
          : 'var(--button-text-graphite-secondary-text)'};
      color: ${p.$variant === 'link-outlined'
        ? 'var(--button-text-green-default)'
        : 'var(--button-text-graphite-secondary-text)'};

      &:hover {
        background-color: transparent;

        border-color: ${p.$variant === 'link-outlined'
          ? 'var(--button-text-green-hover)'
          : 'var(--button-text-graphite-primary-text)'};
        color: ${p.$variant === 'link-outlined'
          ? 'var(--button-text-green-hover)'
          : 'var(--button-text-graphite-primary-text)'};
      }

      &:active {
        background-color: transparent;

        border-color: ${p.$variant === 'link-outlined'
          ? 'var(--button-text-green-active)'
          : 'var(--button-text-graphite-secondary-text)'};
        color: ${p.$variant === 'link-outlined'
          ? 'var(--button-text-green-active)'
          : 'var(--button-text-graphite-secondary-text)'};
      }
    `}

  ${p =>
    p.$variant === 'danger' &&
    css`
      background-color: var(--button-text-red-default);

      &:hover {
        background-color: var(--button-text-red-hover);
      }

      &:active {
        background-color: var(--button-text-red-active);
      }
    `}

  ${p =>
    (p.$variant === 'empty' || p.$variant === 'empty-danger') &&
    css`
      background-color: transparent;
      color: ${p.$variant === 'empty-danger'
        ? 'var(--button-text-red-default)'
        : 'var(--button-text-graphite-secondary-text)'};

      &:hover {
        background-color: transparent;

        color: ${p.$variant === 'empty-danger'
          ? 'var(--button-text-red-hover)'
          : 'var(--button-text-graphite-primary-text)'};
      }

      &:active {
        background-color: transparent;

        color: ${p.$variant === 'empty-danger'
          ? 'var(--button-text-red-active)'
          : 'var(--button-text-graphite-secondary-text)'};
      }
    `}

  ${p =>
    p.$variant === 'link' &&
    css`
      background-color: transparent;
      color: var(--button-text-green-default);

      &:hover {
        background-color: transparent;

        color: var(--button-text-green-hover);
      }

      &:visited {
        color: var(--button-text-green-default);
      }

      &:active {
        background-color: transparent;

        color: var(--button-text-green-active);
      }
    `}

  ${p =>
    p.$variant === 'bigger' &&
    css`
      height: fit-content;

      font-size: 16px;
      line-height: 22px;

      padding: 16px 32px;
      border-radius: var(--border-radius-block);
    `}

  ${p =>
    p.$variant === 'highlighted' &&
    css`
      background: linear-gradient(
        45deg,
        var(--primary-statuses-fuchsia-400),
        var(--primary-statuses-noun-440)
      );
      background-size: 300% 300%;
      animation: ${HighlightGradientAnimation} 5s linear infinite;
    `}

  padding: ${p => p.$padding};
`;

const RootButton = styled.button<CommonRootProps>`
  ${CommonStyles}
`;

interface RootLinkProps extends CommonRootProps {
  $svgPathFillHover?: string;
}

const RootLink = styled(Link)<RootLinkProps>`
  display: block;

  text-decoration: none;

  ${CommonStyles}

  &:hover {
    ${p =>
      p.$svgPathFillHover &&
      css`
        svg path {
          fill: ${p.$svgPathFillHover};
        }
      `}
  }
`;

const IconWrapper = styled.div<{ $pathFill?: string }>`
  height: 20px;
  width: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    fill: ${p => p.$pathFill};
    transition: var(--transition-200);
  }
`;

interface IconProps {
  Icon: ReactNode;
  path?: {
    pathFill?: string;
    pathFillHover?: string;
  };
}

type OmittedButtonHTMLAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'height' | 'disabled'
>;

export interface PrimaryButtonProps extends OmittedButtonHTMLAttributes {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: PrimaryButtonVariant;
  iconProps?: IconProps;
  linkProps?: LinkProps;
  padding?: CSSProperties['padding'];
  height?: CSSProperties['height'];
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

const getLoaderColorByVariant = (variant: PrimaryButtonVariant): string => {
  switch (variant) {
    case 'filled':
      return 'var(--primary-statuses-white-0)';

    case 'outlined':
      return 'var(--button-text-graphite-secondary-text)';

    case 'danger':
      return 'var(--primary-statuses-white-0)';

    case 'empty':
      return 'var(--button-text-graphite-secondary-text)';

    case 'link':
      return 'var(--button-text-green-default)';

    case 'empty-danger':
      return 'var(--button-text-red-default)';

    default:
      return 'var(--primary-statuses-white-0)';
  }
};

const PrimaryButton = (props: PrimaryButtonProps) => {
  const {
    children,
    loading = false,
    variant = 'filled',
    iconProps,
    linkProps,
    padding,
    height,
    ...rest
  } = props;

  const ButtonContent: ReactNode = (
    <>
      {loading ? (
        <MiniLoader color={getLoaderColorByVariant(variant)} />
      ) : iconProps ? (
        <IconWrapper $pathFill={iconProps.path?.pathFill}>{iconProps.Icon}</IconWrapper>
      ) : null}

      {children}
    </>
  );

  const commonProps = {
    $variant: variant,
    $padding: padding,
    $height: height,
    className: 'workspace__PrimaryButton--Root',
  } satisfies CommonRootProps | ButtonHTMLAttributes<HTMLButtonElement>;

  return linkProps ? (
    <RootLink {...linkProps} {...commonProps} $svgPathFillHover={iconProps?.path?.pathFillHover}>
      {ButtonContent}
    </RootLink>
  ) : (
    <RootButton
      type="button"
      {...rest}
      {...commonProps}
      $svgPathFillHover={iconProps?.path?.pathFillHover}
    >
      {ButtonContent}
    </RootButton>
  );
};

export { PrimaryButton };
