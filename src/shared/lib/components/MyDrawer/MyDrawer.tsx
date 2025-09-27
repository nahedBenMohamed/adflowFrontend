import { Portal } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { CloseModalIcon } from '../../../assets';
import { DropdownScrollbarMixin } from '../../mixins';
import { MediaBreakpoints } from '../../models';

interface RootProps {
  $opened: boolean;
  $bgColor?: string;
  $paddingBottom?: boolean;
  $ensurePageSubheader?: boolean;
  $width?: CSSProperties['width'];
}

const Root = styled.article<RootProps>`
  position: fixed;
  top: ${p =>
    p.$ensurePageSubheader ? `var(--header-with-subheader-height)` : `var(--header-height)`};
  right: 0;

  width: ${p => p.$width ?? '460px'};
  height: ${p =>
    p.$ensurePageSubheader
      ? `calc(100dvh - var(--header-with-subheader-height))`
      : `calc(100dvh - var(--header-height))`};

  z-index: 500;

  display: flex;
  flex-direction: column;

  padding-bottom: ${p => p.$paddingBottom && 8}px;
  scale: 0.9;
  opacity: 0.6;
  visibility: hidden;
  transform: translateX(100%);
  transform-origin: top right;
  background: ${p => p.$bgColor || 'var(--primary-statuses-white-0)'};
  border-left: 1px solid var(--graphite-graphite-80);
  box-shadow:
    0px 36px 14px rgba(97, 108, 130, 0.01),
    0px 20px 12px rgba(97, 108, 130, 0.03),
    0px 9px 9px rgba(97, 108, 130, 0.05),
    0px 2px 5px rgba(97, 108, 130, 0.06),
    0px 0px 0px rgba(97, 108, 130, 0.06);
  transition: var(--transition-200);

  ${p =>
    p.$opened &&
    css`
      scale: 1;
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    `}

  ${p =>
    !p.$width &&
    css`
      @media ${MediaBreakpoints.SM} {
        width: 100vw;
      }
    `}
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 12px 16px;
  background: var(--primary-statuses-white-0);
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Content = styled.div`
  flex: 1;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const ControlsWrapper = styled.div`
  padding: 12px 16px;
  background: var(--primary-statuses-white-0);
  border-top: 1px solid var(--graphite-graphite-80);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -48px;
  right: 30px;

  width: 36px;
  height: 36px;

  display: none;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  background: var(--primary-statuses-white-0);
  border-radius: 50%;
  padding: 8px;
  box-shadow:
    0px 36px 14px rgba(97, 108, 130, 0.01),
    0px 20px 12px rgba(97, 108, 130, 0.03),
    0px 9px 9px rgba(97, 108, 130, 0.05),
    0px 2px 5px rgba(97, 108, 130, 0.06),
    0px 0px 0px rgba(97, 108, 130, 0.06);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
    background: var(--graphite-graphite-20);

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }

  @media ${MediaBreakpoints.SM} {
    display: flex;
  }
`;

const MobileOverlay = styled.div<{ $opened?: boolean }>`
  position: fixed;
  inset: 0 0 0 0;

  display: none;

  background-color: #aab7d475;
  pointer-events: none;
  z-index: 99;

  ${p =>
    p.$opened &&
    css`
      @media ${MediaBreakpoints.SM} {
        display: block;
      }
    `}
`;

interface Props {
  opened: boolean;
  children: ReactNode;
  Header?: ReactNode;
  Controls?: ReactNode;
  width?: CSSProperties['width'];
  buttonRef?: RefObject<HTMLElement | null>;
  bgColor?: string;
  paddingBottom?: boolean;
  ensurePageSubheader?: boolean;
  hide: () => void;
}

const MyDrawer = observer((props: Props) => {
  const {
    opened,
    Header,
    children,
    Controls,
    width,
    buttonRef,
    bgColor,
    paddingBottom,
    ensurePageSubheader,
    hide,
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(rootRef as RefObject<HTMLDivElement>, e => {
    if (!opened) return;

    const target = e.target as HTMLElement;

    // to prevent closing panel when clicking on overlaying modal (or button / its children)
    // we need this we're opening notifications settings modal from notifications panel
    if (
      target.closest('.workspace__MyDropdown--StyledDropdown') ||
      target.closest('.workspace__MyPopover--StyledDropdown') ||
      target.closest('.workspace__OverlayingModal--Overlay') ||
      target.closest('.workspace__OverlayingModal--Content') ||
      target.closest('.workspace__ToastContainer') ||
      buttonRef?.current?.contains(target) ||
      buttonRef?.current === target
    )
      return;

    hide();
  });

  return (
    <Portal>
      <MobileOverlay $opened={opened} />

      <Root
        ref={rootRef}
        $width={width}
        $opened={opened}
        $bgColor={bgColor}
        $paddingBottom={paddingBottom}
        $ensurePageSubheader={ensurePageSubheader}
      >
        <CloseButton onClick={hide}>
          <CloseModalIcon />
        </CloseButton>

        {Header && <HeaderWrapper>{Header}</HeaderWrapper>}

        <Content className="workspace__MyDrawer--Content">{children}</Content>

        {Controls && <ControlsWrapper>{Controls}</ControlsWrapper>}
      </Root>
    </Portal>
  );
});

MyDrawer.displayName = 'MyDrawer';
export { MyDrawer };
