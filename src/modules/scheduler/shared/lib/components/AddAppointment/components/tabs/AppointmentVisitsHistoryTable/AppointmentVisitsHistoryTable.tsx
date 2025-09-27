import {
  BaseTable,
  EmptyTableBlock,
  MediaBreakpoints,
  SectionPagination,
  TableSkeleton,
  type Currency,
} from '@/shared';
import { getCoreRowModel, useReactTable, type Cell, type Header } from '@tanstack/react-table';
import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetPaginatedScheduleAppointments } from '../../../../../../../api';
import { useAppointmentsHistoryColumns } from '../../../../../hooks';
import {
  SCHEDULE_APPOINTMENTS_LIMIT,
  type Schedule,
  type ScheduleAppointment,
} from '../../../../../models';

const Root = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  @media ${MediaBreakpoints.SM} {
    min-width: 800px;
  }
`;

const TableSkeletonWrapper = styled.div`
  padding: 0 16px;
`;

const PaginationWrapper = styled.div<{ $openedFromCard?: boolean }>`
  ${p => (p.$openedFromCard ? `padding: 16px` : `padding: 16px 32px 0`)};
`;

interface Props {
  entityId: number;
  currency: Currency;
  dateNow: string;
  selectedSchedule: Schedule;
  openedFromCard?: boolean;
}

const AppointmentVisitsHistoryTable = (props: Props) => {
  const { entityId, currency, dateNow, selectedSchedule, openedFromCard } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const {
    isLoading,
    isPlaceholderData,
    data: appointmentsResult,
  } = useGetPaginatedScheduleAppointments({
    page: currentPage,
    queryParams: {
      entityId,
      expand: 'order',
      endDate: dateNow,
      showCanceled: true,
      scheduleId: selectedSchedule.id,
    },
  });

  const meta = appointmentsResult?.meta;
  const appointments = appointmentsResult?.appointments;

  const columns = useAppointmentsHistoryColumns({
    currency,
    openedFromCard,
    selectedSchedule,
  });

  const visitsTable = useReactTable<ScheduleAppointment>({
    columns: columns,
    data: appointments ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  const pagesCount = meta ? Math.ceil(meta.total / SCHEDULE_APPOINTMENTS_LIMIT) : null;

  return (
    <Root>
      {isLoading ? (
        <TableSkeletonWrapper>
          <TableSkeleton />
        </TableSkeletonWrapper>
      ) : appointments && appointments.length > 0 ? (
        <>
          <BaseTable
            table={visitsTable}
            tableLoading={isPlaceholderData}
            headProps={{
              headRowProps: {
                $notSticky: true,
                $paddingLeft: openedFromCard ? '16px' : '32px',
              },
              getCellStyleFn: (header: Header<ScheduleAppointment, unknown>): CSSProperties => {
                return { width: header.column.getSize() };
              },
            }}
            bodyProps={{
              bodyRowProps: {
                $striped: true,
                $paddingLeft: openedFromCard ? '16px' : '32px',
              },
              getCellStyleFn: (cell: Cell<ScheduleAppointment, unknown>): CSSProperties => {
                return { width: cell.column.getSize() };
              },
            }}
          />

          {pagesCount && pagesCount > 1 && (
            <PaginationWrapper $openedFromCard={openedFromCard}>
              <SectionPagination
                pageCount={pagesCount}
                currentPage={currentPage}
                boundaries={openedFromCard ? 2 : 4}
                handleChange={setCurrentPage}
              />
            </PaginationWrapper>
          )}
        </>
      ) : (
        <EmptyTableBlock $height="336px">{t('visits_history_empty')}</EmptyTableBlock>
      )}
    </Root>
  );
};

export { AppointmentVisitsHistoryTable };
