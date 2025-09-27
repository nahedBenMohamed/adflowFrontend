import { SkeletonAnimationMixin } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MetaInfoWrapper, Root } from '../../UpdateTaskDrawer.styles';

const CompleteButtonSkeleton = styled.div<{ $delay: number }>`
  width: 94px;
  height: 32px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const TitleBlockSkeleton = styled.div<{ $delay: number }>`
  width: 100%;
  height: 58px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const MetaInfoSkeleton = styled.div<{ $delay: number }>`
  width: 100%;
  height: 60px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const DescriptionBlockSkeleton = styled.div<{ $delay: number }>`
  width: 100%;
  height: 52px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const SubtasksBlockSkeleton = styled.div<{ $delay: number }>`
  width: 100%;
  height: 48px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const ReporterBlockSkeleton = styled.div<{ $delay: number }>`
  width: 50%;
  height: 20px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin};
`;

const UpdateTaskDrawerSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Root title={t('loading_title')}>
      <CompleteButtonSkeleton $delay={0} />
      <TitleBlockSkeleton $delay={300} />

      <MetaInfoWrapper>
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <MetaInfoSkeleton key={idx} $delay={idx * 300} />
          ))}
      </MetaInfoWrapper>

      <DescriptionBlockSkeleton $delay={0} />
      <SubtasksBlockSkeleton $delay={300} />

      <ReporterBlockSkeleton $delay={600} />
      <MetaInfoSkeleton $delay={900} />
      <MetaInfoSkeleton $delay={1200} />
    </Root>
  );
};

export { UpdateTaskDrawerSkeleton };
