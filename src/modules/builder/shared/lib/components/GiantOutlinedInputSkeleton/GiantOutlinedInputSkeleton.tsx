import { SkeletonAnimationMixin } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div<{ $delay: number }>`
  width: 100%;
  height: 78px;

  border-radius: var(--border-radius-block);

  ${SkeletonAnimationMixin}
`;

const GiantOutlinedInputSkeleton = () => {
  const { t } = useTranslation();

  return <Root $delay={0} title={t('loading_title')} />;
};

export { GiantOutlinedInputSkeleton };
