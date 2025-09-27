import {
  ColorUtil,
  SpanWithEllipsis,
  TruncateMixin,
  type Nullable,
  type UtcDateValue,
} from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  AppointmentEventHoverCard,
  InfoIcon,
  getAppointmentStatusColor,
  type ScheduleAppointment,
} from '../../../../shared';

const Root = styled.div<{ $editable?: boolean }>`
  position: relative;

  height: 100%;

  display: flex;
  flex-direction: column;

  font-size: 14px;
  line-height: 20px;

  ${TruncateMixin}

  &:hover {
    cursor: ${p => p.$editable && 'pointer'};
  }
`;

interface EventHeaderProps {
  $bgColor: string;
  $onlyHeader: boolean;
}

const EventHeader = styled.div<EventHeaderProps>`
  position: sticky;
  top: 0;
  bottom: 8px;

  min-height: 21px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-weight: 500;
  color: var(--primary-statuses-white-0);

  background-color: ${p => p.$bgColor};
  padding: ${p => (p.$onlyHeader ? '0 8px' : '2px 8px')};
  border-radius: ${p =>
    p.$onlyHeader
      ? 'var(--border-radius-element)'
      : 'var(--border-radius-element) var(--border-radius-element) 0 0'};
  transition: background-color var(--transition-200);

  ${TruncateMixin}
`;

const InfoIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface EventContentProps {
  $bgColor: string;
  $showPlaceholder: boolean;
}

const EventContent = styled.div<EventContentProps>`
  flex: 1;
  display: flex;

  font-weight: 400;
  color: ${p =>
    p.$showPlaceholder
      ? 'var(--button-text-graphite-primary-text)'
      : 'var(--button-text-graphite-priory-text)'};

  padding: 2px 8px;
  background-color: ${p => p.$bgColor};
  border-radius: 0 0 var(--border-radius-element) var(--border-radius-element);
  transition: background-color var(--transition-200);
`;

interface Props {
  title: string;
  endDate: UtcDateValue;
  startDate: UtcDateValue;
  minutesSlotDuration: number;
  productsSectionId: Nullable<number>;
  appointment?: ScheduleAppointment;
}

const AppointmentEventComponent = memo((props: Props) => {
  const { title, endDate, startDate, minutesSlotDuration, productsSectionId, appointment } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  if (!startDate || !endDate) {
    throw new Error(`Failed to parse event dates for event ${title}`);
  }

  const startTime = startDate.displayTime();
  const endTime = endDate.displayTime();

  const showOnlyEventHeader = endDate.diffMinutes(startDate) <= minutesSlotDuration;

  const showPlaceholder = !appointment;

  const headerBgColor = showPlaceholder
    ? 'var(--primary-statuses-turquoise-520)'
    : getAppointmentStatusColor(appointment.status);
  const contentBgColor = `rgb(${ColorUtil.getBgColorRgbByPipelineVar(headerBgColor)}, 0.25)`;

  return (
    <Root $editable={appointment?.userRights.canEdit}>
      <EventHeader $bgColor={headerBgColor} $onlyHeader={showOnlyEventHeader}>
        {showPlaceholder
          ? t('new_event')
          : appointment.title && <SpanWithEllipsis text={appointment.title} />}

        {appointment && (
          <AppointmentEventHoverCard
            withinPortal
            appointmentId={appointment.id}
            isEditable={appointment.userRights.canEdit}
            productsSectionId={productsSectionId}
            target={
              <InfoIconWrapper>
                <InfoIcon />
              </InfoIconWrapper>
            }
          />
        )}
      </EventHeader>

      {!showOnlyEventHeader && (
        <EventContent $bgColor={contentBgColor} $showPlaceholder={showPlaceholder}>
          {startTime} - {endTime}
        </EventContent>
      )}
    </Root>
  );
});

AppointmentEventComponent.displayName = 'AppointmentEventComponent';
export { AppointmentEventComponent };
