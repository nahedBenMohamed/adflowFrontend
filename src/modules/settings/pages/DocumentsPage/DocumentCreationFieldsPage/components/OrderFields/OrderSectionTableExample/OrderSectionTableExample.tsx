import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { OrderSectionExampleWrapper } from '../OrderSectionExampleWrapper/OrderSectionExampleWrapper';
import { OrderSectionTextParagraph } from '../OrderSectionTextParagraph/OrderSectionTextParagraph';

const Table = styled.table`
  border-collapse: separate;
  border: 1px solid var(--graphite-graphite-360);

  th {
    border-bottom: 1px solid var(--graphite-graphite-360);
  }

  th,
  td {
    padding: 4px 8px;
    white-space: nowrap;
    border-left: 1px solid var(--graphite-graphite-360);

    &:first-of-type {
      border-left: none;
    }

    &:nth-child(2n) {
      background-color: var(--graphite-graphite-20);
    }
  }
`;

const OrderSectionTableExample = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_templates_page.order_fields',
  });

  const headCells: string[] = [
    t('order_item.number'),
    t('order_item.name'),
    t('order_item.price'),
    t('order_item.currency'),
    t('order_item.discount'),
    t('order_item.tax'),
    t('order_item.quantity'),
    t('order_item.amount'),
  ];

  const bodyCells: string[] = [
    '{#order.products}{number}',
    '{name}',
    '{price}',
    '{currency}',
    '{discount}',
    '{tax}',
    '{quantity}',
    '{amount}{/}',
  ];

  const tableExample = `${headCells.join('\t')}\n${bodyCells.join('\t')}`;

  return (
    <OrderSectionExampleWrapper
      copyText={tableExample}
      Title={<OrderSectionTextParagraph>{t('table_example')}:</OrderSectionTextParagraph>}
    >
      <Table>
        <thead>
          <tr>
            {headCells.map(hc => (
              <th key={hc}>
                <OrderSectionTextParagraph>
                  <strong>{hc}</strong>
                </OrderSectionTextParagraph>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {bodyCells.map(bc => (
              <td key={bc}>
                <OrderSectionTextParagraph>
                  <b>{bc}</b>
                </OrderSectionTextParagraph>
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </OrderSectionExampleWrapper>
  );
};

export { OrderSectionTableExample };
