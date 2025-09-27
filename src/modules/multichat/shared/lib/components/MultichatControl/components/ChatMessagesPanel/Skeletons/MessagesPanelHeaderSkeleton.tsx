import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

export const MessagesPanelHeaderSkeleton = styled.div`
  height: 61px;

  ${SkeletonAnimationMixin}
`;
