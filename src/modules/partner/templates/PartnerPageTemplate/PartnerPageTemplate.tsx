/* eslint-disable i18next/no-literal-string */

import { authStore } from '@/modules/auth';
import { LogoLink, envUtil } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Container, Header, LogoutButton } from './components';

const Root = styled.div`
  width: 100%;
  height: 100dvh;

  display: flex;
  justify-content: center;

  padding-top: 88px;
  background-color: var(--graphite-graphite-20);
`;

const HeaderRoot = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

interface Props {
  children: ReactNode;
}

const PartnerPageTemplate = (props: Props) => {
  const { children } = props;

  return (
    <Root>
      <Header>
        <Container>
          <HeaderRoot>
            <LogoLink href={envUtil.appUrl} />

            <LogoutButton onClick={authStore.logout}>Log out</LogoutButton>
          </HeaderRoot>
        </Container>
      </Header>

      <Container>{children}</Container>
    </Root>
  );
};

export { PartnerPageTemplate };
