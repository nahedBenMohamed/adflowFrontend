import type { ReactNode } from 'react';
import styled from 'styled-components';

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    fill: var(--primary-statuses-white-0);
    transition: var(--transition-200);
  }
`;

const Root = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  Icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}

const AvatarButton = (props: Props) => {
  const { children, Icon, onClick } = props;

  return (
    <Root onClick={onClick}>
      <IconWrapper>{Icon}</IconWrapper>
      {children}
    </Root>
  );
};

export { AvatarButton };
