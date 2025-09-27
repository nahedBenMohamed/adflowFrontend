import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';
import { FeedItemLeftBlock, FeedItemWrapper } from '../FeedItem';

export const LeftIconSkeleton = styled.div<{ $delay: number }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;

  ${SkeletonAnimationMixin}
`;

interface ItemProps {
  $small: boolean;
  $delay: number;
}

const Item = styled.div<ItemProps>`
  width: 100%;
  height: ${p => (p.$small ? '200px' : '330px')};

  margin-bottom: 16px;
  border-radius: var(--border-radius-block);
  border: 1px solid transparent;
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${SkeletonAnimationMixin}
`;

interface Props {
  small?: boolean;
  delay?: number;
}

const FeedBlockSkeleton = (props: Props) => {
  const { small = false, delay = 0 } = props;

  return (
    <FeedItemWrapper>
      <FeedItemLeftBlock Icon={<LeftIconSkeleton $delay={delay} />} />

      <Item $small={small} $delay={delay} />
    </FeedItemWrapper>
  );
};

export { FeedBlockSkeleton };
