import { SkeletonAnimationMixin } from '@/shared';
import type { CSSProperties } from 'react';
import styled from 'styled-components';

interface RootProps {
  $delay: number;
  $width: CSSProperties['width'];
}

export const ChatsHeaderProvidersTabSkeleton = styled.div<RootProps>`
  height: 36px;
  width: ${p => p.$width};

  flex-shrink: 0;

  border-radius: var(--border-radius-element) var(--border-radius-element) 0 0;
  margin-right: 8px;

  ${SkeletonAnimationMixin}
`;
