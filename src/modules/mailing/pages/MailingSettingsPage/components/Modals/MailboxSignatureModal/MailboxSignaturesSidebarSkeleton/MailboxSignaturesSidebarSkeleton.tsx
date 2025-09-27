import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

const Block = styled.div<{ $delay: number }>`
  height: 50px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;

const MailboxSignaturesSidebarSkeleton = () => {
  return new Array(6).fill(0).map((_, idx) => <Block key={idx} $delay={idx * 300} />);
};

export { MailboxSignaturesSidebarSkeleton };
