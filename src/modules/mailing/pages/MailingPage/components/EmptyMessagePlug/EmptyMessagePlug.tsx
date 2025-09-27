import styled from 'styled-components';
import { NoEmailYetIcon } from '../../../../shared';

interface RootProps {
  $sidebarOpened: boolean;
  $pageHasMessagePanel: boolean;
}

const Root = styled.div<RootProps>`
  height: calc(100dvh - var(--header-with-subheader-height));

  display: flex;
  justify-content: center;
  flex: 1;

  padding-top: 10%;

  margin-left: ${p => {
    if (p.$pageHasMessagePanel) {
      return `calc(${
        p.$sidebarOpened
          ? 'var(--mailing-sidebar-width-opened)'
          : 'var(--mailing-sidebar-width-closed)'
      } + var(--mailing-message-panel-width))`;
    }

    return p.$sidebarOpened
      ? 'var(--mailing-sidebar-width-opened)'
      : 'var(--mailing-sidebar-width-closed)';
  }};

  transition: var(--transition-200);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Annotation = styled.span`
  font-weight: 500;
  font-size: 22px;
  line-height: 120%;

  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  caption: string;
  pageHasMessagePanel?: boolean;
  sidebarOpened?: boolean;
}

const EmptyMessagePlug = (props: Props) => {
  const { caption, pageHasMessagePanel = false, sidebarOpened = true } = props;

  return (
    <Root $pageHasMessagePanel={pageHasMessagePanel} $sidebarOpened={sidebarOpened}>
      <Content>
        <NoEmailYetIcon />
        <Annotation>{caption}</Annotation>
      </Content>
    </Root>
  );
};

export { EmptyMessagePlug };
