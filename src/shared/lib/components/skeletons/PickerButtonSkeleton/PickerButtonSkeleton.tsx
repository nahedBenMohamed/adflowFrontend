import styled from 'styled-components';
import { SkeletonAnimationMixinLegacy } from '../../../mixins';

const PickerSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PickerCircleWrapper = styled.div`
  height: 32px;
  width: 32px;

  border-radius: 50%;

  ${SkeletonAnimationMixinLegacy}
`;

const LabelSkeleton = styled.div<{ $large?: boolean }>`
  height: 17px;
  width: ${p => (p.$large ? '65%' : '40%')};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy}
`;

interface Props {
  largeLabel?: boolean;
}

const PickerButtonSkeleton = (props: Props) => {
  const { largeLabel = false } = props;

  return (
    <PickerSkeletonWrapper>
      <PickerCircleWrapper />
      <LabelSkeleton $large={largeLabel} />
    </PickerSkeletonWrapper>
  );
};

export { PickerButtonSkeleton };
