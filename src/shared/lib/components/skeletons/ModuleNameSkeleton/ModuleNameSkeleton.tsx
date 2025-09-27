import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SkeletonAnimationMixin } from '../../../mixins';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconSkeleton = styled.div<{ $delay: number }>`
  width: 24px;
  height: 24px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const NameSkeleton = styled.div<{ $delay: number }>`
  width: 160px;
  height: 24px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const ModuleNameSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Root title={t('loading_title')}>
      <IconSkeleton $delay={0} />
      <NameSkeleton $delay={300} />
    </Root>
  );
};

export { ModuleNameSkeleton };
