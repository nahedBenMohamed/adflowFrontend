import { MiniLoader } from '@/shared';
import styled from 'styled-components';

const Button = styled.button<{ $loading?: boolean }>`
  width: 100%;

  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  text-align: center;
  line-height: normal;
  font-family: Nunito SemiBold;
  color: var(--primary-statuses-white-0);

  padding: 14px 22px;
  border-radius: 8px;
  background-color: var(--button-text-green-default);
  border: 2px solid var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-green-hover);
    border: 2px solid var(--button-text-green-hover);
  }

  &:active {
    background-color: var(--button-text-green-active);
    border: 2px solid var(--button-text-green-active);
  }
`;

interface Props {
  name: string;
  loading: boolean;
}

const LoginButton = (props: Props) => {
  const { name, loading } = props;

  return (
    <Button type="submit" disabled={loading}>
      {loading && <MiniLoader />}

      {name}
    </Button>
  );
};

export { LoginButton };
