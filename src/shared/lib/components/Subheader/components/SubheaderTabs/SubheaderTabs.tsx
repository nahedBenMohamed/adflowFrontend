import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { areRoutesPathnamesEqual } from '../../../../helpers';
import type { TabModel } from '../../../../models';
import { SubheaderTab } from '../SubheaderTab/SubheaderTab';
import { SubheaderTabsSkeleton } from '../SubheaderTabsSkeleton/SubheaderTabsSkeleton';

const Root = styled.div`
  border: none;

  display: flex;
  gap: 16px;
`;

const IconWrapper = styled.span`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  // artificial padding to align icon with the text
  padding-top: 2px;
`;

interface Props {
  tabs: TabModel[];
}

const SubheaderTabs = memo((props: Props) => {
  const { tabs } = props;

  const { pathname } = useLocation();

  return tabs.length > 0 ? (
    <Root>
      {tabs.map(({ active, href, title, disabled, tooltip, Icon }) => (
        <SubheaderTab
          key={href}
          to={href}
          disabled={disabled}
          tooltip={tooltip}
          active={
            active !== undefined ? active : areRoutesPathnamesEqual({ p1: pathname, p2: href })
          }
        >
          {Icon && <IconWrapper>{Icon}</IconWrapper>}

          {title}
        </SubheaderTab>
      ))}
    </Root>
  ) : (
    <SubheaderTabsSkeleton />
  );
});

SubheaderTabs.displayName = 'SubheaderTabs';
export { SubheaderTabs };
