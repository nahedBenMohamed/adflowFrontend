import type { ReactNode } from 'react';
import styled from 'styled-components';
import { MyHoverCard } from '../../../MyHoverCard/MyHoverCard';

const TargetWrapper = styled.div`
  width: fit-content;
  height: fit-content;
`;

interface Props {
  target: ReactNode;
  children: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

const SidebarHoverCard = (props: Props) => {
  const { target, children, onOpen, onClose } = props;

  return (
    <MyHoverCard
      offset={20}
      withinPortal
      openDelay={150}
      exitDuration={100}
      transition="scale-x"
      position="right-start"
      transitionDuration={150}
      target={<TargetWrapper>{target}</TargetWrapper>}
      onOpen={onOpen}
      onClose={onClose}
    >
      {children}
    </MyHoverCard>
  );
};

export { SidebarHoverCard };
