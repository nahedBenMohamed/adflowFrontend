import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SkeletonAnimationMixin } from '../../../mixins';

export const Root = styled.div<{ $delay?: number }>`
  width: 32px;
  height: 32px;

  border-radius: 50%;

  ${SkeletonAnimationMixin}
`;

interface Props {
  delay?: number;
}

const RoundButtonSkeleton = (props: Props) => {
  const { delay } = props;

  const { t } = useTranslation();

  return <Root $delay={delay} title={t('loading_title')} />;
};

export { RoundButtonSkeleton };
