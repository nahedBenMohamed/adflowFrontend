import { Tabs } from '@mantine/core';
import type { ReactNode } from 'react';
import type { CSSProperties } from 'styled-components';
import { Subheader, useTypedParams, type TabModel } from '../../lib';
import { LeftNavTemplate } from '../LeftNavTemplate/LeftNavTemplate';

interface Props {
  tabs: TabModel[];
  Header: ReactNode;
  children: ReactNode;
  SubheaderContent?: ReactNode;
  SubheaderControls?: ReactNode;
  SubheaderCenterControls?: ReactNode;
  rootWidth?: CSSProperties['width'];
  pageMinWidth?: CSSProperties['minWidth'];
  marginLeft?: CSSProperties['marginLeft'];
  rootMinWidth?: CSSProperties['minWidth'];
  marginRight?: CSSProperties['marginRight'];
}

const PageTemplateWithSubheader = (props: Props) => {
  const {
    tabs,
    Header,
    children,
    rootWidth,
    marginLeft,
    marginRight,
    rootMinWidth,
    pageMinWidth,
    SubheaderContent,
    SubheaderControls,
    SubheaderCenterControls,
  } = props;

  const { tab } = useTypedParams<{ tab: string }>();

  return (
    <LeftNavTemplate
      Header={Header}
      rootWidth={rootWidth}
      rootMinWidth={rootMinWidth}
      pageMinWidth={pageMinWidth}
      contentMarginLeft={marginLeft}
      contentMarginRight={marginRight}
      contentMarginTop="var(--header-with-subheader-height)"
    >
      {/* String(tab) -> for specific cases where tab is number and it gets convert to a number, but value should always be of string type */}
      <Tabs value={String(tab)} keepMounted={false}>
        <Subheader
          tabs={tabs}
          Content={SubheaderContent}
          Controls={SubheaderControls}
          CenterControls={SubheaderCenterControls}
        />

        {children}
      </Tabs>
    </LeftNavTemplate>
  );
};

export { PageTemplateWithSubheader };
