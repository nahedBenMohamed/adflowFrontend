import styled from 'styled-components';
import { SkeletonAnimationMixinLegacy } from '../../../mixins';

export const LabelSkeleton = styled.div<{ $small?: boolean }>`
  height: 17px;
  width: ${p => (p.$small ? '60px' : '100px')};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;
