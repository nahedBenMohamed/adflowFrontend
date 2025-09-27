import { useConditionalWindowScroll } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import type { BuilderNavStore } from '../../../../../store';
import { NavStepItem } from '../NavStepItem/NavStepItem';

interface RootProps {
  $horizontal?: boolean;
  $hasBorderBottom?: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  flex-direction: ${p => (p.$horizontal ? 'row' : 'column')};
  gap: 8px;

  ${p =>
    p.$horizontal &&
    css`
      position: sticky;
      top: var(--header-with-subheader-height);

      width: 100%;

      z-index: 10;

      padding: 16px;
      border-bottom: 1px solid transparent;
      background-color: var(--graphite-graphite-20);
      transition: var(--transition-200);

      ${p.$hasBorderBottom && `border-color: var(--graphite-graphite-80)`};
    `};
`;

interface Props {
  store: BuilderNavStore;
  horizontal?: boolean;
  alwaysShowBorderBottom?: boolean;
}

const NavStepsList = observer((props: Props) => {
  const { store, horizontal, alwaysShowBorderBottom } = props;

  const { steps, stepOrder, setStepOrder } = store;

  const getSetStepOrderHandler = useCallback(
    (order: number) => () => setStepOrder(order),
    [setStepOrder]
  );

  const { y: windowScrolledY } = useConditionalWindowScroll(horizontal);

  return (
    <Root
      id="workspace__NavStepsList--Root"
      role="tablist"
      $horizontal={horizontal}
      $hasBorderBottom={(horizontal && windowScrolledY > 0) || alwaysShowBorderBottom}
    >
      {steps.map(s => (
        <NavStepItem
          key={s.order}
          step={s}
          secondary={horizontal}
          active={stepOrder === s.order}
          onSelect={getSetStepOrderHandler(s.order)}
        />
      ))}
    </Root>
  );
});

export { NavStepsList };
