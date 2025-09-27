import { useWindowEvent } from '@mantine/hooks';
import type { CSSProperties, ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Portal } from '../Portal/Portal';

const content = keyframes`
		0% {
			opacity: 0;
			transform: scale(0.6);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
`;

const overlay = keyframes`
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
`;

const Root = styled.div<{ $zIndex?: CSSProperties['zIndex'] }>`
  inset: 0 0 0 0;
  position: fixed;

  z-index: ${p => (p.$zIndex ? p.$zIndex : 'var(--modal-z-index)')};

  display: flex;
  justify-content: center;

  padding: 16px;
`;

const Overlay = styled.div<{ $animation: boolean }>`
  position: fixed;
  inset: 0 0 0 0;

  background-color: #aab7d475;

  animation: ${p =>
    p.$animation
      ? css`
          ${overlay} 500ms
        `
      : 'none'};
`;

const Content = styled.div<{ $animation: boolean }>`
  height: 100%;
  width: 100%;

  z-index: 99;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${p =>
    p.$animation
      ? css`
          ${content} 500ms
        `
      : 'none'};
`;

interface Props {
  isOpened: boolean;
  children: ReactNode;
  animation?: boolean;
  zIndex?: CSSProperties['zIndex'];
  onClose: () => void;
}

const OverlayingModal = (props: Props) => {
  const { children, isOpened, animation = true, zIndex, onClose } = props;

  useWindowEvent('mousedown', e => {
    const target = e.target;

    if (target instanceof HTMLElement) {
      const hasClass = (cls: string): boolean => target.classList.contains(cls);

      if (
        hasClass('workspace__OverlayingModal--Overlay') ||
        hasClass('workspace__OverlayingModal--Content')
      )
        onClose();
    }
  });

  if (!isOpened) return null;

  return (
    <Portal>
      <Root role="dialog" $zIndex={zIndex}>
        <Overlay
          role="button"
          tabIndex={0}
          $animation={animation}
          className="workspace__OverlayingModal--Overlay"
        />
        <Content $animation={animation} className="workspace__OverlayingModal--Content">
          {children}
        </Content>
      </Root>
    </Portal>
  );
};

export { OverlayingModal };
