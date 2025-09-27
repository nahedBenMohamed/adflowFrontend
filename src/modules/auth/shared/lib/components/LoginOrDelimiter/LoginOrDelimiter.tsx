import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  gap: 32px;
  align-items: center;

  font-size: 16px;
  line-height: 28px;
  font-family: Nunito;
`;

const Delimiter = styled.hr`
  flex: 1;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  caption: string;
}

const LoginOrDelimiter = (props: Props) => {
  const { caption } = props;

  return (
    <Root>
      <Delimiter />

      {caption}

      <Delimiter />
    </Root>
  );
};

export { LoginOrDelimiter };
