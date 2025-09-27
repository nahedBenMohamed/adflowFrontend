import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SkeletonAnimationMixin } from '../../../../mixins';

const TabsSkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: center;
`;

const TabSkeleton = styled.div<{ $delay: number }>`
  width: 70px;
  height: 20px;

  border-radius: 2px;

  ${SkeletonAnimationMixin}
`;

const SubheaderTabsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <TabsSkeletonWrapper title={t('loading_title')}>
      <TabSkeleton $delay={0} />
      <TabSkeleton $delay={300} />
    </TabsSkeletonWrapper>
  );
};

export { SubheaderTabsSkeleton };
