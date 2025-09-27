import { TruncateMixin } from '@/shared/lib/mixins/Truncate.mixin';
import type { ReactNode } from 'react';
import { Link, useLocation, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface SettingsSidebarItemProps {
  $active?: boolean;
  $contrast?: boolean;
  $asElement?: SidebarItemElementType;
}

const Root = styled(Link)<SettingsSidebarItemProps>`
  width: 100%;

  flex-shrink: 0;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  color: ${p =>
    p.$active
      ? 'var(--button-text-graphite-priory-text)'
      : 'var(--button-text-graphite-primary-text)'};

  border-radius: var(--border-radius-element);
  padding: ${p => (p.$asElement === 'group-member' ? '8px 12px 8px 36px' : '8px 12px')};
  background-color: ${p => p.$active && 'var(--graphite-graphite-80)'};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.$active
      ? css`
          &:hover {
            color: var(--button-text-graphite-priory-text);
          }
        `
      : css`
          &:hover {
            color: var(--button-text-graphite-priory-text);

            background: var(--graphite-graphite-40);
          }
        `}

  ${p => p.$asElement === 'group-title' && `pointer-events: none`};

  ${p =>
    p.$contrast &&
    css`
      font-weight: 700;
      color: var(--button-text-green-active);

      background-color: ${p.$active && 'var(--background-green-20)'};

      &:hover {
        color: var(--button-text-green-hover);

        background-color: var(--background-green-20);
      }

      &:active {
        color: var(--button-text-green-active);
      }
    `};

  ${TruncateMixin}
`;

type SidebarItemElementType = 'group-title' | 'group-member';

interface Props extends Omit<LinkProps, 'to'> {
  children: ReactNode;
  to?: string;
  active?: boolean;
  contrast?: boolean;
  asElement?: SidebarItemElementType;
}

const SettingsSidebarItem = (props: Props) => {
  const { children, active, asElement, to, contrast, ...rest } = props;

  const { pathname } = useLocation();

  const commonProps = {
    $contrast: contrast,
    $asElement: asElement,
    $active: pathname === to || active,
  } satisfies SettingsSidebarItemProps;

  return to ? (
    <Root to={to} {...rest} {...commonProps}>
      {children}
    </Root>
  ) : (
    <Root as="button" {...commonProps}>
      {children}
    </Root>
  );
};

export { SettingsSidebarItem };
