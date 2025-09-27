import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  padding: 1px 6px 2px;
  border: 1px solid var(--button-text-graphite-secondary-text);
  border-radius: var(--border-radius-element);

  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  total: number;
}

const TotalTag = memo((props: Props) => {
  const { total } = props;

  const { t } = useTranslation();

  return <Root>{t('total', { total })}</Root>;
});

TotalTag.displayName = 'TotalTag';
export { TotalTag };
