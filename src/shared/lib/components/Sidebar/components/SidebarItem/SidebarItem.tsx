import { MiniLoader } from '@/shared';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { MyTooltip } from '../../../MyTooltip/MyTooltip/MyTooltip';

interface RootProps {
  $active: boolean;
  $activeColor: string;
  $hovering?: boolean;
  $disabled?: boolean;
}

const Root = styled(Link)<RootProps>`
  height: 32px;
  width: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-block);
  background-color: ${p => (p.$active ? p.$activeColor : 'transparent')};

  transition: var(--transition-200);

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p =>
      p.$active ? `var(--primary-statuses-white-0)` : `var(--button-text-graphite-primary-text)`};

    transition: var(--transition-200);
  }

  &:hover {
    svg rect,
    svg circle,
    svg ellipse,
    svg path {
      fill: ${p =>
        p.$active ? 'var(--primary-statuses-white-0)' : 'var(--graphite-graphite-200)'};
    }
  }

  ${p =>
    p.$hovering &&
    !p.$active &&
    css`
      svg rect,
      svg circle,
      svg ellipse,
      svg path {
        fill: ${p.$active ? 'var(--primary-statuses-white-0)' : 'var(--graphite-graphite-200)'};
      }
    `}

  &:active {
    background-color: ${p => p.$activeColor};

    svg rect,
    svg circle,
    svg ellipse,
    svg path {
      fill: ${p =>
        p.$active ? 'var(--primary-statuses-white-0)' : 'var(--graphite-graphite-200)'};
    }
  }

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.5;

      pointer-events: none;
    `}
`;

const LabelRoot = styled.div`
  display: flex;
  gap: 8px;

  padding: 2px 0;
`;

interface Props {
  path: string;
  children: React.ReactNode;
  activeColor: string;
  tooltip?: string;
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
  hovering?: boolean;
}

const SidebarItem = (props: Props) => {
  const { path, children, activeColor, tooltip, active, loading, disabled, hovering } = props;

  const location = useLocation();
  const pathname = location.pathname;

  const Label = tooltip ? (
    <LabelRoot>
      {tooltip}

      {loading && <MiniLoader size="small" />}
    </LabelRoot>
  ) : null;

  return (
    <MyTooltip offset={6} position="right" withinPortal label={Label}>
      <Root
        to={path}
        $active={active ?? pathname === path}
        $disabled={disabled}
        $hovering={hovering}
        $activeColor={activeColor}
      >
        {children}
      </Root>
    </MyTooltip>
  );
};

export { SidebarItem };
