import { type MouseEvent, type ReactNode, type Ref } from 'react';
import styled from 'styled-components';

const Root = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 100%;
  left: -2px;

  width: calc(100% + 4px);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 10;
  overflow: hidden;

  padding: 0 2px 4px;

  pointer-events: ${p => (p.$active ? 'all' : 'none')};
  scale: ${p => (p.$active ? 1 : 0)};
`;

const Menu = styled.button<{ $active: boolean }>`
  width: 100%;

  display: block;

  overflow: hidden;

  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  background: var(--primary-statuses-white-0);
  border-bottom-left-radius: var(--border-radius-block);
  border-bottom-right-radius: var(--border-radius-block);

  transform: ${p => (p.$active ? 'translateY(0%)' : 'translateY(-102%)')};
  transition: 350ms ease-out;
`;

interface Props {
  ref?: Ref<HTMLButtonElement>;
  opened: boolean;
  children: ReactNode;
}

const HeaderDropdown = (props: Props) => {
  const { ref, opened, children } = props;

  const handleStopPropagation = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <Root $active={opened}>
      <Menu ref={ref} $active={opened} onClick={handleStopPropagation}>
        {children}
      </Menu>
    </Root>
  );
};

export { HeaderDropdown };
