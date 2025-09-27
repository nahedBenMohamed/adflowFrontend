import { generalSettingsStore, subscriptionStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  FadedHorizontalScrollMixin,
  type FadedHorizontalScrollMixinProps,
  useFadedHorizontalScroll,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { HideScrollbarMixin } from '../../mixins';
import { MediaBreakpoints, type TabModel } from '../../models';
import { DeleteDemoButton, HeaderDelimiter, TrialButton } from '../DefaultHeader/components';
import { SubheaderTabs } from './components';

export const SUBHEADER_HEIGHT = 40;

const Root = styled.div<FadedHorizontalScrollMixinProps>`
  position: fixed;
  top: var(--header-height);
  right: 0;
  left: var(--sidebar-width);

  height: var(--subheader-height);

  z-index: var(--subheader-z-index);

  background: var(--primary-statuses-white-0);
  border-bottom: 1px solid var(--graphite-graphite-80);

  overflow: auto hidden;

  ${HideScrollbarMixin}
  ${FadedHorizontalScrollMixin}
`;

const SubheaderContainer = styled.header`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 0 16px;

  @media ${MediaBreakpoints.SM} {
    min-width: max-content;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-left: auto;
`;

interface Props {
  tabs?: TabModel[];
  tabsNode?: ReactNode;
  Controls?: ReactNode;
  Content?: ReactNode;
  CenterControls?: ReactNode;
}

const Subheader = observer((props: Props) => {
  const { tabs, tabsNode, Controls, Content, CenterControls } = props;

  const { hasDemoData } = generalSettingsStore;

  const showDeleteDemoButton = hasDemoData && authStore.isAdmin();

  const { ref, showLeftFade, showRightFade } = useFadedHorizontalScroll();

  return (
    <Root ref={ref} $showLeftFade={showLeftFade} $showRightFade={showRightFade}>
      <SubheaderContainer>
        {Content}

        {Content && <HeaderDelimiter $subheader />}

        {tabs ? <SubheaderTabs tabs={tabs} /> : tabsNode}

        {CenterControls && (
          <>
            <HeaderDelimiter $subheader />

            {CenterControls}
          </>
        )}

        <ControlsWrapper>
          {Controls}

          {subscriptionStore.subscription?.isTrial && <TrialButton />}

          {showDeleteDemoButton && <DeleteDemoButton />}
        </ControlsWrapper>
      </SubheaderContainer>
    </Root>
  );
});

export { Subheader };
