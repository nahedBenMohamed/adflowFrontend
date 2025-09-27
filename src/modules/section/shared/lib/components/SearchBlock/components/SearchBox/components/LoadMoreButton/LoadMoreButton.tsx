import { memo, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.button<{ $loading: boolean }>`
  outline: none;

  display: flex;
  justify-content: center;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
  color: var(--button-text-green-default);

  margin: 3px 32px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);
  }

  &:active {
    color: var(--button-text-green-active);
  }

  ${p =>
    p.$loading &&
    css`
      &:hover,
      &:active {
        cursor: default;

        color: var(--button-text-green-default);
      }
    `};
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

const LoadMoreButton = memo((props: Props) => {
  const { loading, ...rest } = props;

  const { t } = useTranslation();

  return (
    <Root $loading={loading} {...rest}>
      {loading ? t('loading_title') : t('show_more')}
    </Root>
  );
});

LoadMoreButton.displayName = 'LoadMoreButton';
export { LoadMoreButton };
