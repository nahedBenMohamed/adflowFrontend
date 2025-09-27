import { SkeletonAnimationMixin } from '@/shared/lib/mixins/SkeletonAnimation.mixin';
import styled from 'styled-components';

interface NotificationBlockSkeletonProps {
  $delay: number;
  $small?: boolean;
}

export const NotificationBlockSkeleton = styled.li<NotificationBlockSkeletonProps>`
  height: ${p => (p.$small ? 80 : 112)}px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;
