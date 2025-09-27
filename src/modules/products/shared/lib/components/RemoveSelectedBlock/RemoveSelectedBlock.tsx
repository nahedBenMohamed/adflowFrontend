import { PrimaryButton } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  hr,
  .workspace__PrimaryButton--Root {
    scale: ${p => (p.$visible ? 1 : 0)};
    opacity: ${p => (p.$visible ? 1 : 0)};
    transition: var(--transition-200);
  }

  hr {
    transform-origin: bottom;
    transition-delay: var(--transition-duration);
  }
`;

const Delimiter = styled.hr`
  height: 32px;

  border-left: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  visible: boolean;
  onClick: () => void;
}

const RemoveSelectedBlock = (props: Props) => {
  const { visible, onClick } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_order_page.common.remove_selected_block',
  });

  return (
    <Root $visible={visible}>
      <PrimaryButton variant="empty-danger" onClick={onClick}>
        {t('remove_selected')}
      </PrimaryButton>

      <Delimiter />
    </Root>
  );
};

export { RemoveSelectedBlock };
