import { Hint } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AvailableHeadCell = () => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.ui.available_head_cell',
  });

  return (
    <Root>
      <span>{t('available')}</span>

      <Hint text={t('available_hint')} />
    </Root>
  );
};

export { AvailableHeadCell };
