import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

export const CategoryBlockSkeleton = styled.div<{ $delay: number }>`
  height: 87px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;
