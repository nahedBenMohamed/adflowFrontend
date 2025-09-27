import { CopyButton, TableScrollbarMixin } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Content = styled.div`
  width: 100%;

  padding: 8px;
  overflow-y: auto;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);

  ${TableScrollbarMixin}
`;

const CopyButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  width: 20px;
  height: 20px;
`;

interface Props {
  Title: ReactNode;
  copyText: string;
  children: ReactNode;
}

const OrderSectionExampleWrapper = (props: Props) => {
  const { copyText, Title, children } = props;

  return (
    <Root>
      {Title}

      <Content>{children}</Content>

      <CopyButtonWrapper>
        <CopyButton copyText={copyText} />
      </CopyButtonWrapper>
    </Root>
  );
};

export { OrderSectionExampleWrapper };
