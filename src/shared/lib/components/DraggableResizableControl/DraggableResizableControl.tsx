import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Rnd, type RndDragCallback, type RndResizeCallback } from 'react-rnd';
import styled from 'styled-components';
import type { DraggableResizableControlBounds } from '../../models';

// we use important to override react-rnd inline styles
const Root = styled(Rnd)`
  position: absolute !important;

  display: flex !important;

  pointer-events: all;
  flex-direction: column;
  overflow: hidden;

  border-radius: var(--border-radius-modal);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const Body = styled.article`
  height: 100%;

  display: flex;

  &:hover {
    cursor: default;
  }
`;

interface Props {
  modalBounds: DraggableResizableControlBounds;
  children: ReactNode;
  dragHandleClassName: string;
  setModalBounds: Dispatch<SetStateAction<DraggableResizableControlBounds>>;
}

const modalMinSizes = {
  width: 576,
  height: 400,
};

const DraggableResizableControl = (props: Props) => {
  const { modalBounds, children, dragHandleClassName, setModalBounds } = props;

  const handleDragStop: RndDragCallback = (_, d) => {
    setModalBounds(prev => ({ ...prev, position: { x: d.x, y: d.y } }));
  };

  const handleResizeStop: RndResizeCallback = (_, _i, ref, _j, pos) => {
    setModalBounds({
      size: {
        width: ref.style.width,
        height: ref.style.height,
      },
      position: { x: pos.x, y: pos.y },
    });
  };

  return (
    <Root
      dragHandleClassName={dragHandleClassName}
      minWidth={modalMinSizes.width}
      minHeight={modalMinSizes.height}
      default={{
        x: 0,
        y: 0,
        width: modalMinSizes.width,
        height: modalMinSizes.height,
      }}
      bounds="parent"
      size={{
        width: modalBounds.size.width,
        height: modalBounds.size.height,
        top: modalBounds.position.y,
        left: modalBounds.position.x,
      }}
      position={{ x: modalBounds.position.x, y: modalBounds.position.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      <Body>{children}</Body>
    </Root>
  );
};

DraggableResizableControl.displayName = 'DraggableResizableControl';
export { DraggableResizableControl };
