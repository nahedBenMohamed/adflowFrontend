import { SkeletonAnimationMixin } from '@/shared/lib/mixins/SkeletonAnimation.mixin';
import styled from 'styled-components';

interface BlockSkeletonProps {
  $delay: number;
  $small?: boolean;
}

export const BlockSkeleton = styled.div<BlockSkeletonProps>`
  height: ${p => (p.$small ? 104 : 238)}px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;
