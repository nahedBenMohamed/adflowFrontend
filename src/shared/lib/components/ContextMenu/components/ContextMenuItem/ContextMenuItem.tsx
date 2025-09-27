import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--background-green-20);
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

interface Props {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

const ContextMenuItem = (props: Props) => {
  const { label, icon, onClick } = props;

  return (
    <Root onClick={onClick}>
      <IconWrapper>{icon}</IconWrapper>

      {label}
    </Root>
  );
};

export { ContextMenuItem };
