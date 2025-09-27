import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SkeletonAnimationMixin } from '../../../mixins';

interface RootProps {
  $delay: number;
  $bigger?: boolean;
}

const Root = styled.div<RootProps>`
  width: ${p => (p.$bigger ? 20 : 16)}px;
  height: ${p => (p.$bigger ? 20 : 16)}px;

  flex-shrink: 0;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

interface Props {
  bigger?: boolean;
}

const MyCheckboxSkeleton = (props: Props) => {
  const { bigger } = props;

  const { t } = useTranslation();

  return <Root $delay={0} title={t('loading_title')} $bigger={bigger} />;
};

export { MyCheckboxSkeleton };
