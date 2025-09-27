import { useSize } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';

const Root = styled.div`
  position: relative;

  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;

  border-radius: var(--border-radius-element);
  background: var(--primary-statuses-white-0);
`;

interface Props {
  children: ReactNode;
}

const GanttBody = observer((props: Props) => {
  const { children } = props;

  const { store } = useGanttContext();

  const rootRef = useRef<HTMLDivElement>(null);
  const rootSize = useSize(rootRef);

  useEffect(() => {
    store.syncSize(rootSize);
  }, [rootSize, store]);

  return <Root ref={rootRef}>{children}</Root>;
});

GanttBody.displayName = 'GanttBody';
export { GanttBody };
