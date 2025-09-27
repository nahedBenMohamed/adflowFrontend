import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SkeletonAnimationMixin } from '../../../mixins';

export const Root = styled.div<{ $delay?: number }>`
  width: 100px;
  height: 32px;

  border-radius: 32px;

  ${SkeletonAnimationMixin}
`;

interface Props {
  delay?: number;
}

const CreateButtonSkeleton = (props: Props) => {
  const { t } = useTranslation();

  return <Root {...props} title={t('loading_title')} />;
};

export { CreateButtonSkeleton };
