import { ChevronLeftIcon } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type MouseEventHandler } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';
import { TableResizeEvent } from '../../models';

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
`;

const Toggler = styled.div`
  position: absolute;
  left: 0;
  top: 50%;

  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-left: 0;
  border-radius: 0 100px 100px 0;
  background: var(--primary-statuses-green-520);
  transform: translateY(-50%);
  transition: var(--transition-200);

  svg {
    path {
      fill: var(--primary-statuses-white-0);

      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    background: var(--button-text-green-hover);
  }

  &:active {
    background: var(--button-text-green-active);
  }
`;

const StyledChevronIcon = styled(ChevronLeftIcon)<{ $rotate?: boolean }>`
  transition: var(--transition-200);
  transform: rotate(${p => (p.$rotate ? '0deg' : '180deg')});
`;

const RecordsContentDivider = observer(() => {
  const { store } = useGanttContext();
  const { tableWidth, collapseStep } = store;

  const isChevronRotated = useMemo<boolean>(
    () => collapseStep === 0 || collapseStep === 1,
    [collapseStep]
  );

  const handleToggle = useCallback<MouseEventHandler<HTMLDivElement>>(
    e => {
      e.stopPropagation();

      store.toggleCollapse();

      document.dispatchEvent(new TableResizeEvent());
    },
    [store]
  );

  return (
    <Root style={{ left: tableWidth }}>
      <Toggler onClick={handleToggle}>
        <StyledChevronIcon $rotate={isChevronRotated} />
      </Toggler>
    </Root>
  );
});

RecordsContentDivider.displayName = 'RecordsContentDivider';
export { RecordsContentDivider };
