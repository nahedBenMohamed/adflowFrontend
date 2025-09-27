import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

export const DocumentTemplateItemSkeleton = styled.div<{ $delay: number }>`
  height: 150px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin};
`;
