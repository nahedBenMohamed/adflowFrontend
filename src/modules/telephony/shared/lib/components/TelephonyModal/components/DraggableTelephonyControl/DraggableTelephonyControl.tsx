import { TruncateMixin } from '@/shared';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Rnd, type RndDragCallback } from 'react-rnd';
import styled, { css } from 'styled-components';
import type { TelephonyModalPosition, TelephonyModalSize } from '../../../../models';

interface RootProps {
  $folded: boolean;
  $transitionable: boolean;
  $transitionDurationMs: number;
}

// we use important to override react-rnd inline styles
const Root = styled(Rnd)<RootProps>`
  position: absolute !important;

  display: flex !important;

  pointer-events: all;
  flex-direction: column;
  overflow: hidden;

  background-color: var(--primary-statuses-white-0);
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-modal);
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);

  ${p =>
    p.$folded &&
    css`
      border-radius: 7px;
      background-color: rgba(61, 61, 61, 0.95);
      box-shadow:
        0px 0px 0px 0px rgba(146, 151, 176, 0.1),
        0px 6px 14px 0px rgba(146, 151, 176, 0.1),
        0px 25px 25px 0px rgba(146, 151, 176, 0.09),
        0px 57px 34px 0px rgba(146, 151, 176, 0.05),
        0px 101px 40px 0px rgba(146, 151, 176, 0.01),
        0px 157px 44px 0px rgba(146, 151, 176, 0);
    `}

  ${p => p.$transitionable && `transition: all ${p.$transitionDurationMs}ms ease`};

  ${TruncateMixin}
`;

const Body = styled.article`
  height: 100%;

  display: flex;

  &:hover {
    cursor: default;
  }
`;

interface Props {
  folded: boolean;
  children: ReactNode;
  transitionable: boolean;
  transitionDurationMs: number;
  modalSize: TelephonyModalSize;
  modalPosition: TelephonyModalPosition;
  setModalPosition: Dispatch<SetStateAction<TelephonyModalPosition>>;
}

const DraggableTelephonyControl = (props: Props) => {
  const {
    folded,
    children,
    transitionable,
    transitionDurationMs,
    modalSize,
    modalPosition,
    setModalPosition,
  } = props;

  const handleDragStop: RndDragCallback = (_, d) => {
    setModalPosition({ x: d.x, y: d.y });
  };

  return (
    <Root
      bounds="parent"
      $folded={folded}
      enableResizing={false}
      size={{
        top: modalPosition.y,
        left: modalPosition.x,
        width: modalSize.width,
        height: modalSize.height,
      }}
      $transitionable={transitionable}
      $transitionDurationMs={transitionDurationMs}
      position={{ x: modalPosition.x, y: modalPosition.y }}
      dragHandleClassName="workspace__TelephonyModalHeader--Root"
      onDragStop={handleDragStop}
    >
      <Body>{children}</Body>
    </Root>
  );
};

export { DraggableTelephonyControl };
