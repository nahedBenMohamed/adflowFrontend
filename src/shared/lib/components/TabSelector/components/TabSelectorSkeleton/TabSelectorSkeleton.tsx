import styled from 'styled-components';
import { SkeletonAnimationMixinLegacy } from '../../../../mixins';

const TabSelectorSkeletonRoot = styled.div`
  height: 17px;
  width: 42px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

const TabSelectorSkeleton = () => {
  return <TabSelectorSkeletonRoot />;
};

export { TabSelectorSkeleton };
