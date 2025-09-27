import { GlobalScrollbar } from 'mac-scrollbar';
import type { CSSProperties, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Sidebar } from '../../lib';

interface RootProps {
  $backgroundColor?: string;
  $width?: CSSProperties['width'];
  $minWidth?: CSSProperties['minWidth'];
}

const Root = styled.div<RootProps>`
  min-height: 100dvh;
  width: ${p => (p.$width ? p.$width : 'fit-content')};
  min-width: ${p => (p.$minWidth ? p.$minWidth : '100%')};

  display: flex;

  ${p => p.$backgroundColor && `background-color: ${p.$backgroundColor}`};
`;

const Page = styled.div<{ $minWidth?: CSSProperties['width'] }>`
  width: 100%;
  min-width: ${p => p.$minWidth ?? 'calc(var(--base-page-min-width) - var(--sidebar-width))'};

  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
`;

interface ContentProps {
  $centered: boolean;
  $marginTop: CSSProperties['marginTop'];
  $marginLeft: CSSProperties['marginLeft'];
  $marginRight: CSSProperties['marginRight'];
}

const Content = styled.div<ContentProps>`
  margin-top: ${p => p.$marginTop};
  margin-left: ${p => p.$marginLeft};
  margin-right: ${p => p.$marginRight};

  ${p =>
    p.$centered &&
    css`
      display: flex;
      justify-content: center;
    `}
`;

interface Props {
  children: ReactNode;
  Header?: ReactNode;
  background?: string;
  isContentCentered?: boolean;
  rootWidth?: CSSProperties['width'];
  pageMinWidth?: CSSProperties['width'];
  rootMinWidth?: CSSProperties['minWidth'];
  contentMarginTop?: CSSProperties['marginTop'];
  contentMarginLeft?: CSSProperties['marginLeft'];
  contentMarginRight?: CSSProperties['marginRight'];
}

const LeftNavTemplate = (props: Props) => {
  const {
    children,
    Header,
    rootWidth,
    rootMinWidth,
    pageMinWidth,
    isContentCentered = false,
    contentMarginLeft = '16px',
    contentMarginRight = '16px',
    contentMarginTop = Header ? 'var(--header-height)' : '16px',
  } = props;

  return (
    <Root
      $width={rootWidth}
      $minWidth={rootMinWidth}
      $backgroundColor="var(--graphite-graphite-20)"
    >
      <Sidebar />

      <Page $minWidth={pageMinWidth}>
        {Header}

        <Content
          $centered={isContentCentered}
          $marginTop={contentMarginTop}
          $marginLeft={contentMarginLeft}
          $marginRight={contentMarginRight}
        >
          {children}
        </Content>
      </Page>
      <GlobalScrollbar />
    </Root>
  );
};

export { LeftNavTemplate };
