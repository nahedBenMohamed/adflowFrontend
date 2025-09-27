import styled from 'styled-components';

const Root = styled.div`
  gap: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  font-family: Nunito;
  color: var(--graphite-graphite-840);
`;

const FormLink = styled.a`
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  font-family: Nunito SemiBold;
  color: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-green-hover);
  }

  &:active {
    color: var(--button-text-green-active);
  }
`;

interface Props {
  href: string;
  caption: string;
  linkTitle: string;
}

const SuggestionLink = (props: Props) => {
  const { href, caption, linkTitle } = props;

  return (
    <Root>
      {caption}

      <FormLink href={href}>{linkTitle}</FormLink>
    </Root>
  );
};

export { SuggestionLink };
