import type { ReactNode } from 'react';
import styled from 'styled-components';
import { HomeButtonIcon } from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--graphite-graphite-120);
  background: var(--primary-statuses-white-0);

  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;
`;

const TopNotch = styled.div`
  display: flex;
  gap: 16px;
`;

const Camera = styled.div`
  width: 16px;
  height: 16px;

  border-radius: 50%;
  background: var(--graphite-graphite-40);
  border: 1px solid var(--graphite-graphite-120);
`;

const Speaker = styled.div`
  width: 75px;
  height: 16px;

  border-radius: 100px;
  background: var(--graphite-graphite-40);
  border: 1px solid var(--graphite-graphite-120);
`;

const Content = styled.div`
  width: 360px;
  height: 640px;

  border-radius: 12px;
  border: 1px solid var(--graphite-graphite-80);
  background: var(--graphite-graphite-20);
`;

const HomeButtonWrapper = styled.div`
  width: 64px;
  height: 64px;

  flex-shrink: 0;
`;

interface Props {
  children: ReactNode;
}

const SiteFormPhonePreview = (props: Props) => {
  const { children } = props;

  return (
    <Root>
      <TopNotch>
        <Camera />
        <Speaker />
      </TopNotch>

      <Content>{children}</Content>

      <HomeButtonWrapper>
        <HomeButtonIcon />
      </HomeButtonWrapper>
    </Root>
  );
};

export { SiteFormPhonePreview };
