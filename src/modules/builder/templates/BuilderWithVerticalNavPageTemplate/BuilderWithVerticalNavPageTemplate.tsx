import { useTypedParams, type Optional } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styled from 'styled-components';
import { NavStepsList } from '../../shared';
import type { BuilderNavStore } from '../../store';
import {
  BuilderPageTemplate,
  type BuilderPageTemplateProps,
} from '../BuilderPageTemplate/BuilderPageTemplate';
import { STEP_ORDER_DATA_ATTRIBUTE } from '../BuilderStepTemplate/BuilderStepTemplate';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 0 0 60% calc(var(--builder-nav-width) - 8px);
`;

const NavWrapper = styled.div`
  position: fixed;
  top: var(--header-with-subheader-height);
  left: var(--sidebar-width);

  width: var(--builder-nav-width);
  height: 100%;

  z-index: 10;

  padding: 16px 8px 16px 16px;
  background-color: var(--graphite-graphite-20);
`;

interface Props extends BuilderPageTemplateProps {
  navStore: BuilderNavStore;
}

const BuilderWithVerticalNavPageTemplate = observer((props: Props) => {
  const { navStore, children, ...rest } = props;

  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const { stepOrder, getStepByOrder, unlockAllSteps } = navStore;

  useEffect(() => {
    if (moduleId) unlockAllSteps();
  }, [moduleId, unlockAllSteps]);

  useEffect(() => {
    if (stepOrder) {
      const nextStepElement = document.querySelector(
        `[${STEP_ORDER_DATA_ATTRIBUTE}="${stepOrder}"]`
      );

      const padding = 16;
      const headerHeight = 96;
      const offset = headerHeight + padding;

      if (nextStepElement)
        window.scrollTo({
          behavior: 'smooth',
          top: nextStepElement.getBoundingClientRect().top + window.scrollY - offset,
        });
    }
  }, [stepOrder, getStepByOrder]);

  return (
    <BuilderPageTemplate {...rest}>
      <NavWrapper>
        <NavStepsList store={navStore} />
      </NavWrapper>

      <Root>{children}</Root>
    </BuilderPageTemplate>
  );
});

export { BuilderWithVerticalNavPageTemplate };
