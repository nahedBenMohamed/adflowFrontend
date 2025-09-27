import type { BusinessHours, Nullable, UtcDate } from '@/shared';
import { useMemo } from 'react';
import { generateSlotsMap } from '../../helpers';
import type { ScheduleAppointment, ScheduleBoardAppointmentRow } from '../../models';

export const useGetSchedulerBoardPageRows = ({
  timePeriod,
  currentDate,
  businessHours,
  appointments,
  limit,
}: {
  timePeriod: number;
  currentDate: UtcDate;
  businessHours: BusinessHours;
  appointments?: ScheduleAppointment[];
  limit?: Nullable<number>;
}) =>
  useMemo<ScheduleBoardAppointmentRow[]>(() => {
    const appointmentsLimit = limit ?? 20;

    if (!appointments) return new Array(appointmentsLimit).fill({ cells: [] });

    let appointmentsQueue = appointments.slice();
    const rows: ScheduleBoardAppointmentRow[] = [];

    const generateRows = () => {
      const slotsMap = generateSlotsMap({
        timePeriod,
        currentDate,
        businessHours,
      });

      // iterate through appointments and fill slotsMap, appointmentsQueue is needed not to mutate initial array
      appointmentsQueue = appointmentsQueue.filter(a => {
        let k = 0;
        let filterFlag = true;

        const slotMapKeys = Object.keys(slotsMap);

        while (k < slotMapKeys.length) {
          const periodCount = Number(slotMapKeys[k]);
          const slot = slotsMap[periodCount];

          if (!slot) {
            k++;

            continue;
          }

          if (
            !slot.appointment &&
            slot.startDate.lessOrEqualThan(a.startDate) &&
            slot.endDate.greaterOrEqualThan(a.endDate)
          ) {
            slot.appointment = a;

            // if we found a slot for an appointment, we can remove it from the queue
            // and stop iterating through slotsMap, we can only have one appointment per slot
            filterFlag = false;

            break;
          }

          k++;
        }

        return filterFlag;
      });

      const newRowCells: ScheduleBoardAppointmentRow['cells'] = [];

      // iterate through slotsMap, find slots with appointments and push them to newRowCells
      Object.values(slotsMap).forEach(({ appointment }) => {
        if (appointment) newRowCells.push(appointment);
      });

      if (!newRowCells.length) return;

      rows.push({ cells: newRowCells });

      // if we have more appointments than filled slots, we need to generate more rows,
      // so we call generateRows() recursively unless we have enough rows
      if (rows.flatMap(r => r.cells).length < appointments.length) {
        generateRows();
      }
    };

    // start generating rows, it will recursively call itself until we have enough rows
    generateRows();

    // if rows length is less than appointmentsLimit – fill with empty rows
    const emptyRowsCount = appointmentsLimit - rows.length;

    for (let i = 0; i < emptyRowsCount; i++) {
      rows.push({ cells: [] });
    }

    return rows;
  }, [limit, appointments, timePeriod, currentDate, businessHours]);
