import { memo, type ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 8px;
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-element);
`;

const Title = styled.h4`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  title: string;
  children: ReactNode;
}

const AppointmentEventHoverCardBlock = memo((props: Props) => {
  const { title, children } = props;

  return (
    <Root>
      <Title>{title}</Title>

      {children}
    </Root>
  );
});

AppointmentEventHoverCardBlock.displayName = 'AppointmentEventHoverCardBlock';
export { AppointmentEventHoverCardBlock };
