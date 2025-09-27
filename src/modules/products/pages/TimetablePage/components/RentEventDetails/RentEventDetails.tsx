import { routes } from '@/app';
import { SpanWithEllipsis, UtcDate, type Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Rental } from '../../../../shared';

const RentEventDetailsContainer = styled.div`
  width: fit-content;
  height: fit-content;

  padding: 16px;
  overflow-y: scroll;
  box-sizing: border-box;
`;

const RentEventDetailsHeader = styled.div`
  margin-bottom: 16px;
`;

const RentEventDetailsTitle = styled(Link)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

const RentEventDetailsItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;
  margin-bottom: 8px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
`;

const RentEventDetailsItemLabel = styled.div`
  color: var(--button-text-graphite-primary-text);
`;

const RentEventDetailsItemStatus = styled.div<{ $status: string }>`
  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--primary-statuses-white-0);

  padding: 4px;
  border-radius: var(--border-radius-element);
  background: ${p =>
    p.$status === 'reserved' ? 'var(--secondary-noun-240)' : 'var(--primary-statuses-pink-360)'};
`;

interface Props {
  eventDetails: Nullable<Rental>;
}

const EVENT_FIELDS = ['title', 'phone', 'mail', 'period', 'shifts', 'status'];

const RentEventDetails = (props: Props) => {
  const { eventDetails } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.calendar',
  });

  const startDateFromDate = UtcDate.fromDate(new Date(eventDetails?.startDate || ''));
  const endDateFromDate = UtcDate.fromDate(new Date(eventDetails?.endDate || ''));

  const renderField = (field: string) => {
    switch (field) {
      case 'title':
        return (
          <RentEventDetailsHeader key={field}>
            <RentEventDetailsTitle
              to={routes.card({
                entityTypeId: eventDetails?.entityInfo.entityTypeId || 0,
                entityId: eventDetails?.entityInfo.id || 0,
              })}
            >
              {eventDetails?.entityInfo.name}
            </RentEventDetailsTitle>
          </RentEventDetailsHeader>
        );

      case 'period':
        return (
          <RentEventDetailsItem key={field}>
            <RentEventDetailsItemLabel>{t(`fields.${field}`)}</RentEventDetailsItemLabel>

            <SpanWithEllipsis
              text={`${startDateFromDate.displayShort()} — ${endDateFromDate.displayShort()}`}
            />
          </RentEventDetailsItem>
        );

      case 'shifts':
        return (
          <RentEventDetailsItem key={field}>
            <RentEventDetailsItemLabel>{t(`fields.${field}`)}</RentEventDetailsItemLabel>

            <SpanWithEllipsis
              text={String(Math.ceil(startDateFromDate.diffDays(endDateFromDate, true)))}
            />
          </RentEventDetailsItem>
        );

      default:
        return (
          <RentEventDetailsItem key={field}>
            <RentEventDetailsItemLabel>{t(`fields.${field}`)}</RentEventDetailsItemLabel>

            <RentEventDetailsItemStatus $status={eventDetails?.status ?? 'rented'}>
              {t(`statuses.${eventDetails?.status}`)}
            </RentEventDetailsItemStatus>
          </RentEventDetailsItem>
        );
    }
  };

  return <RentEventDetailsContainer>{EVENT_FIELDS.map(renderField)}</RentEventDetailsContainer>;
};

export { RentEventDetails };
