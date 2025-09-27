import { SkeletonAnimationMixinLegacy } from '@/shared/lib/mixins/SkeletonAnimationLegacy.mixin';
import styled from 'styled-components';
import { RadioWrapper } from '../RadioWrapper/RadioWrapper';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RadioSkeleton = styled.div`
  width: 16px;
  height: 16px;

  border-radius: 50%;

  ${SkeletonAnimationMixinLegacy}
`;

const LabelSkeleton = styled.div<{ small: boolean }>`
  height: 20px;
  width: ${p => (p.small ? '120px' : '160px')};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixinLegacy};
`;

const RadiosSkeleton = () => {
  return (
    <Root>
      {new Array(5).fill(0).map((_, idx) => (
        <RadioWrapper key={idx}>
          <RadioSkeleton />

          <LabelSkeleton small={idx % 3 === 0} />
        </RadioWrapper>
      ))}
    </Root>
  );
};

export { RadiosSkeleton };
