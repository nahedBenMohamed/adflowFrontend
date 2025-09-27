import type { ReactNode } from 'react';
import styled from 'styled-components';
import { BuilderStepBox, BuilderStepSubtitle } from '../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Content = styled(BuilderStepBox)`
  width: 100%;

  display: flex;

  padding: 32px 48px;
`;

interface Props {
  title: string;
  children: ReactNode;
}

const BlockTemplate = (props: Props) => {
  const { title, children } = props;

  return (
    <Root>
      <BuilderStepSubtitle $withIndent>{title}</BuilderStepSubtitle>

      <Content>{children}</Content>
    </Root>
  );
};

export { BlockTemplate };
