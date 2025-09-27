import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

export const WarehousePageBlockSkeleton = styled.div<{ $delay: number }>`
  height: 55px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;
