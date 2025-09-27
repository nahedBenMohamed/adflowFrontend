import { SkeletonAnimationMixinLegacy } from '@/shared';
import styled from 'styled-components';

export const EditorApproveButtonSkeleton = styled.div`
  height: 32px;
  width: 64px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;
