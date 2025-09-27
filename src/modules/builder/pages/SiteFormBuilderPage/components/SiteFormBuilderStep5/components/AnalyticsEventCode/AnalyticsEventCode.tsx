import { CopyButton } from '@/shared';
import styled from 'styled-components';

const Root = styled.div`
  min-width: 400px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-family: var(--font-family-mono);
  color: var(--button-text-graphite-primary-text);

  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 12px 12px 12px 0;
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-graphite-priory-text);
  }
`;

interface Props {
  children: string;
}

const AnalyticsEventCode = (props: Props) => {
  const { children } = props;

  return (
    <Root>
      {children}

      <CopyButton copyText={children} />
    </Root>
  );
};

export { AnalyticsEventCode };
