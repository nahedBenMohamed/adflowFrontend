import styled from 'styled-components';

const Root = styled.article`
  position: relative;

  width: 414px;
  height: 450px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  padding: 16px;
  background-color: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

interface Props {
  children: React.ReactNode;
}

const Block = (props: Props) => {
  const { children } = props;

  return <Root>{children}</Root>;
};

export { Block };
