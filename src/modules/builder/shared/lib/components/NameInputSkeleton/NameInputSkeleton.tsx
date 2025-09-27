import { SkeletonAnimationMixin } from '@/shared';
import { type CSSProperties } from 'react';
import styled from 'styled-components';

interface Props {
  $delay: number;
  $width?: CSSProperties['width'];
}

export const NameInputSkeleton = styled.div<Props>`
  width: ${p => p.$width ?? '70%'};
  height: 28px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;
