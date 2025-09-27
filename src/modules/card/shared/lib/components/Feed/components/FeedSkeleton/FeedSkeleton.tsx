import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';
import { HeaderRightBlock } from '../FeedGroupList/FeedGroupList';
import { DateGroupHeaderLeftBlock, FeedHorizontalLine } from '../FeedItem';
import { FeedBlockSkeleton } from './FeedBlockSkeleton';

const DateGroupHeader = styled.div`
  display: flex;
  align-items: center;
`;

const DateGroupTitle = styled.div<{ $delay: number }>`
  width: 150px;
  height: 32px;

  border-radius: 16px;
  border: 1px solid var(--graphite-graphite-80);

  ${SkeletonAnimationMixin}
`;

const FeedSkeleton = () => {
  return (
    <>
      <DateGroupHeader>
        <DateGroupHeaderLeftBlock />

        <FeedHorizontalLine $width={16} $hasMarginBottom />

        <HeaderRightBlock>
          <FeedHorizontalLine />

          <DateGroupTitle $delay={0} />

          <FeedHorizontalLine />
        </HeaderRightBlock>
      </DateGroupHeader>

      <FeedBlockSkeleton small />
      <FeedBlockSkeleton small delay={600} />
    </>
  );
};

export { FeedSkeleton };
