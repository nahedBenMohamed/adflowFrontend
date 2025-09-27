import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

const Root = styled.div`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const loading = keyframes`
  0% {
    background-color: var(--graphite-graphite-680);
  }

  50% {
    background-color: #343B47;
  }

  100% {
    background-color: var(--graphite-graphite-680);
  }
`;

const Skeleton = styled.div<{ $delay?: number }>`
  width: 20px;
  height: 20px;

  border-radius: var(--border-radius-element);
  background-color: var(--graphite-graphite-680);

  animation: ${loading} 2000ms linear infinite alternate;
  animation-delay: ${p => p.$delay}ms;
`;

interface Props {
  delay?: number;
}

const SidebarItemSkeleton = (props: Props) => {
  const { delay } = props;

  const { t } = useTranslation();

  return (
    <Root title={t('loading_title')}>
      <Skeleton $delay={delay} />
    </Root>
  );
};

export { SidebarItemSkeleton };
