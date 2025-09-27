import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.h3`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--button-text-graphite-primary-text);
`;

const IntegrationsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

interface Props {
  label: string;
  children: ReactNode;
  id?: string;
  Controls?: ReactNode;
}

const IntegrationsGroup = (props: Props) => {
  const { label, children, id, Controls } = props;

  return (
    <Root id={id}>
      <LabelWrapper>
        <Label>{label}</Label>

        {Controls}
      </LabelWrapper>

      <IntegrationsList>{children}</IntegrationsList>
    </Root>
  );
};

export { IntegrationsGroup };
