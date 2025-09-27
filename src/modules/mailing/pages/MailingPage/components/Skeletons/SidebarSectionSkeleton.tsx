import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;

  margin: 12px 16px;
`;

const BlockSkeleton = styled.div<{ $delay: number }>`
  height: 20px;
  width: 70%;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const CountSkeleton = styled.div<{ $delay: number }>`
  height: 18px;
  width: 24px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const IconSkeletonWrapper = styled.div`
  padding: 12px 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IconSkeleton = styled.div<{ $delay: number }>`
  width: 20px;
  height: 20px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

interface Props {
  opened: boolean;
}

const SidebarSectionSkeleton = (props: Props) => {
  const { opened } = props;

  return opened ? (
    <Wrapper>
      <BlockSkeleton $delay={0} />
      <CountSkeleton $delay={300} />
    </Wrapper>
  ) : (
    <IconSkeletonWrapper>
      <IconSkeleton $delay={0} />
    </IconSkeletonWrapper>
  );
};

export { SidebarSectionSkeleton };
