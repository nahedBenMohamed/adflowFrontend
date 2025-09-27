import { truncateNumber } from '@/shared';
import { Tabs } from '@mantine/core';
import styled from 'styled-components';
import { UnseenCountTag } from '../UnseenCountTag/UnseenCountTag';

const StyledTab = styled(Tabs.Tab)`
  border: none;
  margin: 0;

  position: relative;

  height: 30px;

  .mantine-Tabs-tabLabel {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);

  padding: 4px;
  border-radius: var(--border-radius-element);

  &::after {
    content: '';

    position: absolute;
    left: 0;
    bottom: -5px;

    height: 2px;
    width: 100%;

    background: transparent;
    border-radius: 2px 2px 0 0;
    transition: var(--transition-200);
  }

  &:hover {
    border: none;

    color: var(--graphite-graphite-840);

    background: var(--graphite-graphite-40);
  }

  &:active {
    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    &::after {
      background: var(--button-text-green-default);
    }
  }

  &[data-active] {
    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    &::after {
      background: var(--button-text-green-default);
    }
  }

  &:focus {
    outline: none;

    border: none;

    color: var(--graphite-graphite-840);

    background-color: transparent;

    &::after {
      background: var(--button-text-green-default);
    }
  }
`;

const TabContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

interface Props {
  value: string;
  title: string;
  unseenCount: number;
}

const ChatHeaderProviderTab = (props: Props) => {
  const { value, title, unseenCount } = props;

  return (
    <StyledTab value={value} className="workspace__ChatHeaderProviderTab--StyledTab">
      <TabContent>
        {title}

        {unseenCount > 0 && (
          <UnseenCountTag>{truncateNumber({ num: unseenCount, precision: 3 })}</UnseenCountTag>
        )}
      </TabContent>
    </StyledTab>
  );
};

export { ChatHeaderProviderTab };
