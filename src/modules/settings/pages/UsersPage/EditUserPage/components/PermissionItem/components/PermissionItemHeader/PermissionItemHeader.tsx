import { Hint } from '@/shared';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding-bottom: 8px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Title = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

interface Props {
  title: string;
  link: string;
  hintText?: string;
}

const PermissionItemHeader = memo((props: Props) => {
  const { title, link, hintText } = props;

  return (
    <Header>
      <Title to={link}>{title}</Title>

      {hintText && <Hint text={hintText} />}
    </Header>
  );
});

PermissionItemHeader.displayName = 'PermissionItemHeader';
export { PermissionItemHeader };
