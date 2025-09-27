import type { FeedGroup, Option } from '@/shared';
import { Fragment } from 'react';
import styled from 'styled-components';
import type { FeedStore } from '../../../../../../store';
import { FeedCalendarIcon } from '../../../../../assets';
import { DateGroupHeaderLeftBlock, FeedHorizontalLine } from '../FeedItem';
import { FeedItemList } from '../FeedItemList/FeedItemList';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderRightBlock = styled.div`
  width: 100%;

  display: flex;
  align-items: center;

  margin-bottom: 16px;
`;

const DateGroupTitle = styled.div`
  display: flex;
  height: 32px;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 4px 16px 4px 12px;
  border-radius: 16px;
  border: 1px solid var(--graphite-graphite-80);
  background: var(--graphite-graphite-40);
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

interface Props {
  feedGroups: FeedGroup[];
  feedStore: FeedStore;
  entityEmailOptions: Option<string>[];
}

const FeedGroupList = (props: Props) => {
  const { feedGroups, feedStore, entityEmailOptions } = props;

  return (
    <Root>
      {feedGroups.map(g => (
        <Fragment key={g.date.formatISO()}>
          <DateGroupHeader>
            <DateGroupHeaderLeftBlock />

            <FeedHorizontalLine $width={16} $hasMarginBottom />

            <HeaderRightBlock>
              <FeedHorizontalLine />

              <DateGroupTitle>
                <IconWrapper>
                  <FeedCalendarIcon />
                </IconWrapper>

                {g.date.displayLong()}
              </DateGroupTitle>

              <FeedHorizontalLine />
            </HeaderRightBlock>
          </DateGroupHeader>

          <FeedItemList feedStore={feedStore} group={g} entityEmailOptions={entityEmailOptions} />
        </Fragment>
      ))}
    </Root>
  );
};

export { FeedGroupList };
