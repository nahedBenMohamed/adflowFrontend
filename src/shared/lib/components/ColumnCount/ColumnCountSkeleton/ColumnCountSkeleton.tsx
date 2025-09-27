import styled from 'styled-components';
import { SkeletonAnimationMixinLegacy } from '../../../mixins';

export const ColumnCountSkeleton = styled.div<{ $medium?: boolean }>`
  height: 20px;
  width: ${p => (p.$medium ? '24px' : '32px')};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;
