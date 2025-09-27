import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px 0;
`;

const NoLinksBlock = () => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.components.common',
  });

  return <Root>{t('no_links')}</Root>;
};

export { NoLinksBlock };
