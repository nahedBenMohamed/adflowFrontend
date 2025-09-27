import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.button<{ $isRedButton?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${p =>
    p.$isRedButton ? `var(--button-text-red-default)` : `var(--button-text-green-default)`};

  padding: 4px 8px;
  border-radius: var(--border-radius-element);
  background-color: ${p => (p.$isRedButton ? 'var(--background-red-20)' : '#f3fded')};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: ${p =>
      p.$isRedButton ? 'var(--button-text-red-active)' : 'var(--button-text-green-active)'};

    background-color: ${p => (p.$isRedButton ? 'var(--neutral-red-100)' : '#e6fbda')};
  }

  &:active {
    color: ${p =>
      p.$isRedButton ? 'var(--button-text-red-hover)' : 'var(--button-text-green-hover)'};
  }
`;

interface Props {
  active: boolean;
  isRedButton?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const FeedItemShowMoreButton = (props: Props) => {
  const { active, isRedButton, onClick } = props;

  const { t } = useTranslation();

  return (
    <Root $isRedButton={isRedButton} onClick={onClick}>
      {active ? t('show_less') : t('show_more')}
    </Root>
  );
};

export { FeedItemShowMoreButton };
