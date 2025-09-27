import type { ReactNode } from 'react';
import styled from 'styled-components';
import { HomeButtonIcon } from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;

  padding: 48px;
  border-radius: 24px;
  border: 1px solid var(--graphite-graphite-120);
  background: var(--primary-statuses-white-0);

  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;
`;

const Content = styled.div`
  width: 768px;
  height: 1000px;

  border-radius: 12px;
  border: 1px solid var(--graphite-graphite-80);
  background: var(--graphite-graphite-20);
`;

const HomeButtonWrapper = styled.div`
  width: 80px;
  height: 80px;

  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

interface Props {
  children: ReactNode;
}

const SiteFormTabletPreview = (props: Props) => {
  const { children } = props;

  return (
    <Root>
      <Content>{children}</Content>

      <HomeButtonWrapper>
        <HomeButtonIcon />
      </HomeButtonWrapper>
    </Root>
  );
};

export { SiteFormTabletPreview };
