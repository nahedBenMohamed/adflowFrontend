import { type BusinessHours, MediaBreakpoints, type Nullable, type UtcDate } from '@/shared';
import { TableScrollbarMixin } from '@/shared/lib/mixins/TableScrollbarMixin.mixin';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';
import {
  type CreateBoardAppointmentHandler,
  type GetScheduleAppointmentsQueryParams,
  type Schedule,
  type ScheduleAppointmentResult,
  type ScheduleBoardAppointmentRow,
  useGetSchedulerBoardPageColumns,
  useGetSchedulerBoardPageRows,
} from '../../../../shared';

const Root = styled.div<{ $noStatistics?: boolean }>`
  height: calc(
    100dvh - var(--header-height) * 2 - var(--subheader-height) - 16px - 8px -
      ${p => (p.$noStatistics ? '0px' : 'var(--scheduler-statistics-height)')}
  );

  overflow: auto;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;

  ${TableScrollbarMixin};

  @media ${MediaBreakpoints.SM} {
    width: calc(100vw - var(--sidebar-width) - 32px);
  }
`;

const StyledTable = styled.table<{ $loading: boolean }>`
  position: relative;

  min-width: 100%;
  height: 100%;

  border-collapse: separate;
  transition: var(--transition-200);

  ${p =>
    p.$loading &&
    css`
      opacity: 0.65;

      &:hover {
        cursor: progress;
      }
    `}
`;

const THead = styled.thead`
  position: sticky;
  top: 0;

  z-index: 2;
`;

const TH = styled.th`
  min-width: 184px;

  border-right: 1px solid var(--graphite-graphite-80);
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);

  &:first-child {
    position: sticky;
    left: 0;

    min-width: fit-content;
  }

  &:last-child {
    border-right: none;
  }
`;

const TD = styled.td`
  padding: 3px;
  border-right: 1px solid var(--graphite-graphite-80);
  border-bottom: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);

  &:first-child {
    position: sticky;
    left: 0;
  }

  &:last-child {
    border-right: none;
  }
`;

interface Props {
  schedule: Schedule;
  isLoading: boolean;
  startDate: UtcDate;
  businessHours: BusinessHours;
  isNoStatisticsShown?: boolean;
  productsSectionId: Nullable<number>;
  appointmentsQueryParams: GetScheduleAppointmentsQueryParams;
  canAddAppointment?: boolean;
  appointmentsResult?: ScheduleAppointmentResult;
  handleEditCell: (appointmentId: number) => void;
  handleCreateAppointment: CreateBoardAppointmentHandler;
}

const SchedulerBoardComponent = observer((props: Props) => {
  const {
    schedule,
    isLoading,
    startDate,
    businessHours,
    productsSectionId,
    canAddAppointment,
    appointmentsResult,
    isNoStatisticsShown,
    handleEditCell,
    handleCreateAppointment,
  } = props;

  // timePeriod in seconds
  const { id: scheduleId, timePeriod, appointmentLimit } = schedule;

  if (!timePeriod)
    throw new Error(
      `Board schedule ${scheduleId} must have a specified timePeriod, instead received ${timePeriod}`
    );

  const columns = useGetSchedulerBoardPageColumns({
    timePeriod,
    businessHours,
    currentDate: startDate,
    productsSectionId,
    canAddAppointment,
    handleEditCell,
    handleCreateAppointment,
  });

  const data = useGetSchedulerBoardPageRows({
    timePeriod,
    businessHours,
    currentDate: startDate,
    limit: appointmentLimit,
    appointments: appointmentsResult?.appointments,
  });

  const table = useReactTable<ScheduleBoardAppointmentRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Root $noStatistics={isNoStatisticsShown}>
      <StyledTable $loading={isLoading}>
        <THead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <TH key={h.id} colSpan={h.colSpan}>
                  {h.isPlaceholder ? null : (
                    <div>{flexRender(h.column.columnDef.header, h.getContext())}</div>
                  )}
                </TH>
              ))}
            </tr>
          ))}
        </THead>

        <tbody>
          {table.getRowModel().rows.map(r => (
            <tr key={r.id}>
              {r.getVisibleCells().map(c => (
                <TD key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TD>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Root>
  );
});

SchedulerBoardComponent.displayName = 'SchedulerBoardComponent';
export { SchedulerBoardComponent };
