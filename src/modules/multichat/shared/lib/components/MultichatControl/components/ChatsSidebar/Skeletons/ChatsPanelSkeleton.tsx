import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

export const ChatPanelBlockSkeleton = styled.div<{ $delay: number }>`
  height: var(--chats-panel-block-min-height);
  width: 100%;

  flex-shrink: 0;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;

const ChatsPanelSkeleton = () => {
  return new Array(12)
    .fill(0)
    .map((_, idx) => <ChatPanelBlockSkeleton key={idx} $delay={idx * 300} />);
};

export { ChatsPanelSkeleton };
