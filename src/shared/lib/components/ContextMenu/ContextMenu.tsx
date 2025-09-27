import { useMultichatContext } from '@/modules/multichat';
import { Menu, Transition } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { type ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';
import { ContextMenuItem } from './components';

interface RootProps {
  $x: number;
  $y: number;
}

const Root = styled.div<RootProps>`
  position: fixed;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  top: ${p => p.$y}px;
  left: ${p => p.$x}px;
`;

const Wrapper = styled.div`
  width: 200px;

  display: flex;
  flex-direction: column;

  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-element);
  box-shadow: var(--dropdown-box-shadow);
  z-index: 10000;
`;

export interface ContextMenuItemModel {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

interface Props {
  children: ReactNode;
  items: ContextMenuItemModel[];
  topContent?: ReactNode;
}

const ContextMenu = (props: Props) => {
  const { children, items, topContent } = props;

  const { pageOpened } = useMultichatContext();

  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const ref = useClickOutside(() => setOpened(false));

  const handleContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      let x = event.clientX;
      let y = event.clientY;

      const modal = event.currentTarget.closest('.workspace__MultichatControl--Root');
      if (!pageOpened && modal) {
        const rect = modal.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
      }

      const menuHeightThreshold = 100;
      const viewportHeight = window.innerHeight;

      if (y + menuHeightThreshold > viewportHeight) {
        y -= menuHeightThreshold;
      }

      setPosition({ x, y });
      setOpened(true);
    },
    [pageOpened]
  );

  const handleItemClick = useCallback((item: ContextMenuItemModel) => {
    item.onClick();
    setOpened(false);
  }, []);

  return (
    <div onContextMenu={handleContextMenu}>
      {children}

      <Transition mounted={opened} transition="pop">
        {transitionStyles => (
          <Root
            ref={ref}
            $x={position.x}
            $y={position.y}
            style={transitionStyles}
            onClick={() => setOpened(false)}
          >
            {topContent}

            <Wrapper>
              <Menu withinPortal>
                {items.map((item, index) => (
                  <ContextMenuItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </Menu>
            </Wrapper>
          </Root>
        )}
      </Transition>
    </div>
  );
};

export { ContextMenu };
