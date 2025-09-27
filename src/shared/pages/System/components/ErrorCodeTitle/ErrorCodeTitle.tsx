import { type ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  color: var(--button-text-graphite-priory-text);
`;

const StatusCode = styled.h1`
  line-height: 48px;
  font-size: 24px;
  font-weight: 500;
  color: var(--button-text-graphite-priory-text);
`;

const Delimiter = styled.div`
  height: 42px;
  width: 1px;

  background: var(--graphite-graphite-200);
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 49px;
`;

interface Props {
  code: number;
  children: ReactNode;
}

const ErrorCodeTitle = (props: Props) => {
  const { code, children } = props;

  return (
    <Root>
      <StatusCode>{code}</StatusCode>
      <Delimiter />
      <Title>{children}</Title>
    </Root>
  );
};

export { ErrorCodeTitle };
