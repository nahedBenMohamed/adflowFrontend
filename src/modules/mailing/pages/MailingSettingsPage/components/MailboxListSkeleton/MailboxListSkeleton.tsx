import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

const Block = styled.div<{ $delay: number }>`
  height: 67px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const MailboxListSkeleton = () => {
  return new Array(5).fill(0).map((_, idx) => <Block key={idx} $delay={idx * 300} />);
};

export { MailboxListSkeleton };
