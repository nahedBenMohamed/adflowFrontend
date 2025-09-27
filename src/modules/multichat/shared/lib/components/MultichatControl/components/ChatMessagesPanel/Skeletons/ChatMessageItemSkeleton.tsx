import { SkeletonAnimationMixin } from '@/shared';
import styled, { css } from 'styled-components';
import { ChatMessageItemContent, ChatMessageItemRoot } from '../ChatMessageItem/ChatMessageItem';

const AvatarSkeleton = styled.div<{ $delay: number }>`
  width: 32px;
  height: 32px;

  border-radius: 50%;

  ${SkeletonAnimationMixin}
`;

interface NameSkeletonProps {
  $delay: number;
  $large?: boolean;
}

const NameSkeleton = styled.div<NameSkeletonProps>`
  width: ${p => (p.$large ? '88px' : '48px')};
  height: 16px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

type BubbleSkeletonSize = 'small' | 'medium' | 'large';

interface BubbleSkeletonProps {
  $delay: number;
  $size: BubbleSkeletonSize;
}

const BubbleSkeleton = styled.div<BubbleSkeletonProps>`
  ${p => {
    switch (p.$size) {
      case 'small':
        return css`
          width: 104px;
          height: 46px;
        `;

      case 'medium':
        return css`
          width: 160px;
          height: 62px;
        `;

      case 'large':
        return css`
          width: 288px;
          height: 96px;
        `;
    }
  }}

  border-radius: 0px 12px 12px;

  ${SkeletonAnimationMixin}
`;

interface Props {
  delay: number;
  bubbleSize: BubbleSkeletonSize;
  largeName?: boolean;
}

const ChatMessageItemSkeleton = (props: Props) => {
  const { delay, largeName, bubbleSize } = props;

  return (
    <ChatMessageItemRoot>
      <AvatarSkeleton $delay={delay} />

      <ChatMessageItemContent>
        <NameSkeleton $delay={delay} $large={largeName} />
        <BubbleSkeleton $delay={delay} $size={bubbleSize} />
      </ChatMessageItemContent>
    </ChatMessageItemRoot>
  );
};

export { ChatMessageItemSkeleton };
