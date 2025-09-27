import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  border-radius: 6px;
  padding: 16px 24px;
  border: 1px solid var(--graphite-graphite-80);
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  title: string;
  children: ReactNode;
}

const CallTypeGroup = (props: Props) => {
  const { title, children } = props;

  return (
    <Root>
      <Title>{title}</Title>

      {children}
    </Root>
  );
};

export { CallTypeGroup };
