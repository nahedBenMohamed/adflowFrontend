import { Collapse } from '@mantine/core';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { FormElementBlockButton } from '../FormElementBlockButton/FormElementBlockButton';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding-top: 8px;
`;

interface Props {
  title: string;
  Icon: ReactNode;
  opened: boolean;
  children: ReactNode;
  onClick: () => void;
}

const FormElementCollapsibleBlock = (props: Props) => {
  const { title, Icon, opened, children, onClick } = props;

  return (
    <Root>
      <FormElementBlockButton active={opened} title={title} Icon={Icon} onClick={onClick} />

      <Collapse in={opened}>
        <Content>{children}</Content>
      </Collapse>
    </Root>
  );
};

export { FormElementCollapsibleBlock };
