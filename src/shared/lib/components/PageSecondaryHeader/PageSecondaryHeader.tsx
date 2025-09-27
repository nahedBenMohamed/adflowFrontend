import { memo, type ReactNode } from 'react';
import styled from 'styled-components';
import { HideScrollbarMixin } from '../../mixins';
import { MediaBreakpoints } from '../../models';

const Root = styled.div<{ $pageHasSubheader?: boolean }>`
  position: fixed;
  top: ${p =>
    p.$pageHasSubheader ? `var(--header-with-subheader-height)` : `var(--header-height)`};
  left: var(--sidebar-width);

  height: var(--header-height);
  width: calc(100% - var(--sidebar-width));

  display: flex;
  align-items: center;
  gap: 16px;

  /** to avoid overlapping of the subheader content */
  z-index: calc(var(--header-z-index) - 2);

  padding: 16px 16px 8px;
  background-color: var(--graphite-graphite-20);

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width) - 16px);

    overflow-x: auto;

    ${HideScrollbarMixin};
  }
`;

interface Props {
  children: ReactNode;
  pageHasSubheader?: boolean;
}

const PageSecondaryHeader = memo((props: Props) => {
  const { children, pageHasSubheader } = props;

  return <Root $pageHasSubheader={pageHasSubheader}>{children}</Root>;
});

PageSecondaryHeader.displayName = 'PageSecondaryHeader';
export { PageSecondaryHeader };
