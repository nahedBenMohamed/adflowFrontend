import { ScheduleAppointmentStatus } from '@/modules/scheduler/shared';
import { calculateEndOfWordIdxByNumber, type Nullable, type Optional, UtcDate } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetScheduleAppointmentCount } from '../../../../../../api';

const Root = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  margin-right: auto;
`;

interface Props {
  scheduleId: Optional<number>;
  entityId: Optional<number>;
  enabled: boolean;
}

const CompletedAppointmentsCount = (props: Props) => {
  const { scheduleId, entityId, enabled } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const dateNow = useMemo<string>(() => UtcDate.nowISO(), []);

  const { data: count } = useGetScheduleAppointmentCount({
    queryParams: {
      scheduleId,
      entityId,
      endDate: dateNow,
      status: ScheduleAppointmentStatus.COMPLETED,
    },
    enabled,
  });

  const countText = useMemo<Nullable<string>>(() => {
    if (!count) return null;

    const idx = calculateEndOfWordIdxByNumber(count);

    return t(`completed_count.${idx}`, { count: count });
  }, [count, t]);

  if (!enabled) return null;

  return <Root>{countText}</Root>;
};

export { CompletedAppointmentsCount };
