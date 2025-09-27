import { DeleteButton } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { AppointmentOrderStore } from '../../../../../../store';
import { useAppointmentServiceBlockColumns } from '../../../../hooks';
import type { ScheduleAppointmentOrderItemRow } from '../../../../models';
import { AppointmentServiceBlockItemTable } from '../AppointmentServiceBlockItemTable/AppointmentServiceBlockItemTable';

const Root = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding-bottom: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  orderStore: AppointmentOrderStore;
  orderItemRow: ScheduleAppointmentOrderItemRow;
}

const AppointmentServicesBlockItem = observer((props: Props) => {
  const { orderStore, orderItemRow } = props;

  const defaultColumns = useAppointmentServiceBlockColumns(orderStore);

  const appointmentServiceBlockItemTable = useReactTable<ScheduleAppointmentOrderItemRow>({
    data: [orderItemRow],
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Root>
      <TitleWrapper>
        <Title>{orderItemRow.service.name}</Title>

        <DeleteButton onClick={() => orderStore.removeOrderItemRow(orderItemRow.id)} />
      </TitleWrapper>

      <AppointmentServiceBlockItemTable
        appointmentServiceBlockItemTable={appointmentServiceBlockItemTable}
      />
    </Root>
  );
});

AppointmentServicesBlockItem.displayName = 'AppointmentServicesBlockItem';
export { AppointmentServicesBlockItem };
