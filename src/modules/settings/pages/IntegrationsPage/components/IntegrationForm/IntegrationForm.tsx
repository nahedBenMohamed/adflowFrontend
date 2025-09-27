import { FocusTrap } from '@mantine/core';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  children: ReactNode;
}

const IntegrationForm = (props: Props) => {
  const { children } = props;

  return (
    <FocusTrap>
      <Root>{children}</Root>
    </FocusTrap>
  );
};

export { IntegrationForm };
