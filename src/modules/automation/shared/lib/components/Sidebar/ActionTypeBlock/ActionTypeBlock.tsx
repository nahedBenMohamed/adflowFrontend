import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Block } from '../../Block/Block';

const Root = styled(Block)`
  height: 63px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 8px 12px;
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  margin-top: 6px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

interface Props {
  children: ReactNode;
  small?: boolean;
  Icon?: ReactNode;
}

const ActionTypeBlock = (props: Props) => {
  const { children, Icon } = props;

  return (
    <Root>
      {Icon && <IconWrapper>{Icon}</IconWrapper>}

      {children}
    </Root>
  );
};

export { ActionTypeBlock };
