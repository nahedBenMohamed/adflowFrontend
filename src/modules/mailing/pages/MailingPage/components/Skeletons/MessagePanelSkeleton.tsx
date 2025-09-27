import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

const Block = styled.div<{ $delay: number }>`
  width: 309px;
  height: 87px;

  flex-shrink: 0;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const MessagePanelSkeleton = () => {
  return new Array(6).fill(0).map((_, idx) => <Block key={idx} $delay={idx * 300} />);
};

export { MessagePanelSkeleton };
