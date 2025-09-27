import { DropdownScrollbarMixin, TruncateMixin } from '@/shared';
import type { ReactNode, Ref } from 'react';
import { Panel } from 'react-resizable-panels';
import styled from 'styled-components';

const StyledPanel = styled(Panel)`
  // so that shadows are not clipped
  padding: 2px;
`;

const Root = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: auto;

  border-radius: var(--border-radius-block);
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
  transition: var(--transition-200);
`;

const Header = styled.div`
  height: 53px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 8px;

  padding: 14px 32px;
  transition: var(--transition-200);
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-primary-text);
`;

const TitleWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}

  ${Title} {
    ${TruncateMixin}
  }
`;

const Body = styled.div`
  flex: 1;

  overflow-y: scroll;
  scrollbar-gutter: stable both-edges;

  ${DropdownScrollbarMixin}

  padding: 0 12px 8px 22px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 12px 32px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  id: string;
  order: number;
  title: ReactNode;
  children: ReactNode;
  Controls: ReactNode;
  HeaderContent?: ReactNode;
}

const ProductsOrderPanelTemplate = (props: Props) => {
  const { ref, id, order, title, children, Controls, HeaderContent } = props;

  return (
    <StyledPanel id={id} order={order} maxSize={75}>
      <Root>
        <Header>
          <TitleWrapper>
            <Title>{title}</Title>
          </TitleWrapper>

          {HeaderContent}
        </Header>

        <Body ref={ref}>{children}</Body>

        <Footer>{Controls}</Footer>
      </Root>
    </StyledPanel>
  );
};

export { ProductsOrderPanelTemplate };
