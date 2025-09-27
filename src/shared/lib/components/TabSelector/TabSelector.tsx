import { Children, isValidElement, type ReactElement } from 'react';
import styled from 'styled-components';
import { Tab, TabSelectorSkeleton, type TabProps } from './components';

const TabSelectorRoot = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding-top: 4px;
`;

interface TabSelectorProps {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
}

const TabSelector = (props: TabSelectorProps) => {
  const { children } = props;

  const renderedChildren = Children.map(children, child => {
    if (isValidElement<TabProps>(child)) {
      return child;
    }

    return null;
  });

  return <TabSelectorRoot role="tablist">{renderedChildren}</TabSelectorRoot>;
};

TabSelector.Tab = Tab;
TabSelector.Skeleton = TabSelectorSkeleton;

export { TabSelector };
