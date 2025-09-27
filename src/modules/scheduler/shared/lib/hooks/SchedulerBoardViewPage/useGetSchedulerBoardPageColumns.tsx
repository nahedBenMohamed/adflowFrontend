import type { BusinessHours, Nullable, Optional, UtcDate } from '@/shared';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import {
  AppointmentCell,
  AppointmentIndexCell,
  AppointmentPeriodHeaderCell,
} from '../../components';
import { generateSlotsMap } from '../../helpers';
import type { ScheduleAppointment, ScheduleBoardAppointmentRow } from '../../models';
import type { CreateBoardAppointmentHandler } from '../../types';

export const useGetSchedulerBoardPageColumns = ({
  timePeriod,
  currentDate,
  businessHours,
  productsSectionId,
  canAddAppointment,
  handleEditCell,
  handleCreateAppointment,
}: {
  timePeriod: number;
  currentDate: UtcDate;
  businessHours: BusinessHours;
  productsSectionId: Nullable<number>;
  canAddAppointment?: boolean;
  handleEditCell: (appointmentId: number) => void;
  handleCreateAppointment: CreateBoardAppointmentHandler;
}) =>
  useMemo<ColumnDef<ScheduleBoardAppointmentRow>[]>(() => {
    const columnHelper = createColumnHelper<ScheduleBoardAppointmentRow>();

    let columns: ColumnDef<ScheduleBoardAppointmentRow>[] = [];

    const slotsMap = generateSlotsMap({
      timePeriod,
      currentDate,
      businessHours,
    });

    const columnAccessor = ({
      row,
      periodStart,
      periodEnd,
    }: {
      row: ScheduleBoardAppointmentRow;
      periodStart: UtcDate;
      periodEnd: UtcDate;
    }): Optional<ScheduleAppointment> =>
      row.cells.find(
        ({ startDate, endDate }) =>
          startDate.greaterOrEqualThan(periodStart) && endDate.lessOrEqualThan(periodEnd)
      );

    Object.keys(slotsMap).forEach(periodCount => {
      const slot = slotsMap[Number(periodCount)];

      if (!slot) return;

      columns.push(
        columnHelper.display({
          id: periodCount,
          header: () => (
            <AppointmentPeriodHeaderCell>
              {slot.startDate.displayTime()}
            </AppointmentPeriodHeaderCell>
          ),
          cell: info => {
            const cell = columnAccessor({
              row: info.row.original,
              periodStart: slot.startDate,
              periodEnd: slot.endDate,
            });

            return (
              <AppointmentCell
                appointment={cell}
                canAddAppointment={canAddAppointment}
                productsSectionId={productsSectionId}
                handleEditCell={cell ? () => handleEditCell(cell.id) : undefined}
                handleCreateAppointment={() =>
                  handleCreateAppointment({
                    startDate: slot.startDate,
                    endDate: slot.endDate,
                  })
                }
              />
            );
          },
        })
      );
    });

    return [
      columnHelper.display({
        id: 'index',
        header: () => <AppointmentIndexCell $header>#</AppointmentIndexCell>,
        cell: info => <AppointmentIndexCell>{info.row.index + 1}</AppointmentIndexCell>,
      }),
      ...columns,
    ];
  }, [
    timePeriod,
    currentDate,
    businessHours,
    productsSectionId,
    canAddAppointment,
    handleEditCell,
    handleCreateAppointment,
  ]);
