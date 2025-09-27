import {
  DotsSmallIcon,
  DropdownListFunctional,
  MyDropdown,
  type FunctionalOptionWithComponent,
} from '@/shared';
import { memo, type MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';

interface MoreIconWrapperProps {
  $active: boolean;
  $resolved: boolean;
  $disabled: boolean;
}

const DotsIconWrapper = styled.button<MoreIconWrapperProps>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    fill: ${p => p.$resolved && 'var(--button-text-graphite-primary-text)'};
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: ${p =>
        p.$resolved
          ? 'var(--button-text-graphite-primary-text)'
          : 'var(--button-text-green-hover)'};
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

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      svg path {
        opacity: 0.5;
      }
    `}
`;

interface Props {
  options: FunctionalOptionWithComponent[];
  opened: boolean;
  resolved?: boolean;
  hide: () => void;
  show: () => void;
}

const HeaderControlsDropdown = memo((props: Props) => {
  const { options, opened, resolved = false, hide, show } = props;

  const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
  };

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-end"
      Button={
        <DotsIconWrapper
          $active={opened}
          $resolved={resolved}
          $disabled={!options.length}
          onClick={handleClick}
        >
          <DotsSmallIcon />
        </DotsIconWrapper>
      }
      hide={hide}
      show={show}
    >
      <DropdownListFunctional options={options} hideDropdown={hide} />
    </MyDropdown>
  );
});

HeaderControlsDropdown.displayName = 'HeaderControlsDropdown';
export { HeaderControlsDropdown };
