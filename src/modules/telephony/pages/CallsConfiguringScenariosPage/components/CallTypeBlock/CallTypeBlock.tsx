import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  border-radius: var(--border-radius-element);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  padding-left: 16px;
`;

interface Props {
  title: string;
  children: ReactNode;
}

const CallTypeBlock = (props: Props) => {
  const { title, children } = props;

  return (
    <Root>
      <Title>{title}</Title>

      {children}
    </Root>
  );
};

export { CallTypeBlock };
