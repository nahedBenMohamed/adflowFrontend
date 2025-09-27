import { Hint } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Title = styled.strong`
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--button-text-graphite-priory-text);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 16px 24px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;
`;

interface Props {
  title: string;
  children: ReactNode;
  hint?: string;
}

const CustomizationBlockTemplate = (props: Props) => {
  const { title, children, hint } = props;

  return (
    <Root>
      <TitleWrapper>
        <Title>{title}</Title>

        {hint && <Hint size="big" text={hint} />}
      </TitleWrapper>

      <Content>{children}</Content>
    </Root>
  );
};

export { CustomizationBlockTemplate };
