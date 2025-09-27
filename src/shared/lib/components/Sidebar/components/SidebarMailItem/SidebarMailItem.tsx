import { iconStore, routes } from '@/app';
import { memo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { EnvelopeIcon, MultiMessengerIcon } from '../../../../../assets';
import { useToggleControl } from '../../../../hooks';
import { DropdownScrollbarMixin, TruncateMixin } from '../../../../mixins';
import { IconName, type Option } from '../../../../models';
import { SpanWithEllipsis } from '../../../SpanWithEllipsis/SpanWithEllipsis';
import { SidebarHoverCard } from '../SidebarHoverCard/SidebarHoverCard';
import { SidebarItem } from '../SidebarItem/SidebarItem';

export const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${DropdownScrollbarMixin}

  padding: 10px 12px 10px 4px;
`;

export const NavigatorIconWrapper = styled.div<{ $activeColor?: string }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg {
    width: 16px;
    height: 16px;
  }

  svg path,
  svg rect {
    transition: var(--transition-200);
  }
`;

export const NavigatorStyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-green-active);
  }

  &:active {
    color: var(--button-text-green-hover);
  }

  ${TruncateMixin}
`;

export const NavigatorItem = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;

  border-radius: var(--border-radius-element);
  padding: 4px 12px 4px 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    ${NavigatorIconWrapper} {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        background-color: #f3fded;

        ${NavigatorStyledLink} {
          color: var(--button-text-green-active);
        }

        ${NavigatorIconWrapper} {
          svg path,
          svg rect {
            fill: var(--button-text-green-active);
          }
        }
      }

      &:active {
        background-color: #e6fbda;

        ${NavigatorStyledLink} {
          color: var(--button-text-green-hover);
        }

        ${NavigatorIconWrapper} {
          svg path,
          svg rect {
            fill: var(--button-text-green-hover);
          }
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      background-color: #f3fded;

      ${NavigatorStyledLink} {
        color: var(--button-text-green-active);
      }

      ${NavigatorIconWrapper} {
        svg path,
        svg rect {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

const SidebarMailItem = memo(() => {
  const { pathname } = useLocation();

  const { t } = useTranslation('common', {
    keyPrefix: 'sidebar',
  });

  const rootControl = useToggleControl(false);

  const options: Option<string, ReactNode>[] = [
    { label: t('mail'), value: routes.mail, extra: <EnvelopeIcon /> },
    {
      label: t('multichat'),
      value: routes.multichat(),
      extra: <MultiMessengerIcon />,
    },
  ];

  return (
    <SidebarHoverCard
      target={
        <SidebarItem
          path={routes.mail}
          hovering={rootControl.active}
          active={
            (pathname.includes('mail') || pathname.includes('chat')) &&
            !pathname.includes('settings')
          }
          activeColor={iconStore.systemModuleColor}
        >
          {iconStore.getByName(IconName.MAIL).icon}
        </SidebarItem>
      }
      onOpen={rootControl.open}
      onClose={rootControl.close}
    >
      <Root>
        {options.map(o => (
          <NavigatorItem key={o.value} $active={pathname.includes(o.value)}>
            <NavigatorStyledLink to={o.value}>
              <NavigatorIconWrapper>{o.extra}</NavigatorIconWrapper>

              <SpanWithEllipsis text={o.label} />
            </NavigatorStyledLink>
          </NavigatorItem>
        ))}
      </Root>
    </SidebarHoverCard>
  );
});

SidebarMailItem.displayName = 'SidebarMailItem';
export { SidebarMailItem };
