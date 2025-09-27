import { DialogModalSecondary } from '@/shared';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CreateStockRow } from '../../../../../../shared';
import { CreateStocksTable } from './CreateStocksTable';

const Content = styled.div`
  width: 100%;

  padding: 0 16px;
`;

interface Props {
  opened: boolean;
  createStocksTable: Table<CreateStockRow>;
  hide: () => void;
}

const CreateStocksModal = (props: Props) => {
  const { opened, createStocksTable, hide } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.ui.create_stocks_modal',
  });

  return (
    <DialogModalSecondary
      width="100%"
      maxWidth="464px"
      maxHeight="308px"
      isOpened={opened}
      Header={t('title')}
      onClose={hide}
    >
      <Content>
        <CreateStocksTable createStocksTable={createStocksTable} />
      </Content>
    </DialogModalSecondary>
  );
};

export { CreateStocksModal };
