import type { ReactNode } from 'react';
import styled from 'styled-components';

const PlugWrapper = styled.div`
  min-height: 68px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const PlugText = styled.span`
  width: 100%;
  min-height: 68px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 600;
  line-height: 23px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);

  padding: 0 19px;
`;

interface Props {
  icon: ReactNode;
  text: string;
}

const ChartPlug = (props: Props) => {
  const { icon, text } = props;

  return (
    <PlugWrapper>
      {icon}

      <PlugText>{text}</PlugText>
    </PlugWrapper>
  );
};

export { ChartPlug };
