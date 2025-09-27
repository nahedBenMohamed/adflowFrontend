/* eslint-disable i18next/no-literal-string */

import { generalSettingsStore } from '@/app';
import { Currency, currencyFormatterHelper } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { PartnerLead } from '../../../../shared';
import { Block } from '../Block/Block';

const Table = styled.table`
  width: 100%;

  text-align: left;
`;

const TableHeader = styled.thead`
  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const TableHeaderColumn = styled.th`
  padding-bottom: 8px;
`;

const TableBody = styled.tbody`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const TableBodyRow = styled.tr`
  &:nth-child(1) {
    td {
      padding: 16px 0 6px;
    }
  }

  &:nth-child(even) {
    background-color: var(--graphite-graphite-20);
  }
`;

const TableBodyColumn = styled.td`
  padding: 6px 0;
`;

const PaymentStatus = styled.span<{ $paid: boolean }>`
  font-weight: 500;
  color: ${p =>
    p.$paid ? 'var(--button-text-green-default)' : 'var(--button-text-graphite-secondary-text)'};
`;

interface Props {
  leads: PartnerLead[];
}

const PartnerLeadsBlock = observer((props: Props) => {
  const { accountSettings } = generalSettingsStore;

  const currency = accountSettings?.currency || Currency.USD;

  return (
    <Block>
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderColumn>Customer (company name and subdomain)</TableHeaderColumn>
            <TableHeaderColumn>Date of registration</TableHeaderColumn>
            <TableHeaderColumn>Date of payment</TableHeaderColumn>
            <TableHeaderColumn>Payment amount</TableHeaderColumn>
            <TableHeaderColumn>Partner bonus</TableHeaderColumn>
            <TableHeaderColumn>Payment status</TableHeaderColumn>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {props.leads.map(lead => (
            <TableBodyRow key={lead.id}>
              <TableBodyColumn>{lead.name}</TableBodyColumn>
              <TableBodyColumn>{lead.registrationDate.displayShort()}</TableBodyColumn>
              <TableBodyColumn>
                {lead.paymentDate ? lead.paymentDate.displayShort() : null}
              </TableBodyColumn>
              <TableBodyColumn>
                {currencyFormatterHelper.format({ value: lead.paymentAmount, currency })}
              </TableBodyColumn>
              <TableBodyColumn>
                {currencyFormatterHelper.format({ value: lead.partnerBonus, currency })}
              </TableBodyColumn>
              <TableBodyColumn>
                <PaymentStatus $paid={lead.isPaidToPartner}>
                  {lead.isPaidToPartner ? 'Paid' : 'In process'}
                </PaymentStatus>
              </TableBodyColumn>
            </TableBodyRow>
          ))}
        </TableBody>
      </Table>
    </Block>
  );
});

PartnerLeadsBlock.displayName = 'PartnerLeadsBlock';
export { PartnerLeadsBlock };
