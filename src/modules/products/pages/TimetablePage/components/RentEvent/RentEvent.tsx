import { InfoLargeIcon } from '@/shared';
import type { EventContentArg } from '@fullcalendar/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MyHoverCard, TruncateMixin } from '../../../../../../shared';
import type { Rental } from '../../../../shared';
import { RentEventDetails } from '../RentEventDetails/RentEventDetails';

const Root = styled.div`
  position: relative;

  z-index: var(--dropdown-z-index);

  margin: 2px;
`;

const InfoIconWrapper = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
  }
`;

const RentSlotContainer = styled.div<{ $status: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;

  line-height: 20px;
  color: var(--primary-statuses-white-0);

  border-radius: var(--border-radius-block);
  background: ${p =>
    p.$status === 'reserved' ? 'var(--neutral-red-100)' : 'var(--neutral-green-120)'};
`;

const RentSlotHeader = styled.div<{ $status: string }>`
  width: 100%;
  height: 26px;

  display: flex;
  justify-content: space-between;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;

  padding: 3px 8px;
  border-radius: var(--border-radius-block) var(--border-radius-block) 0 0;
  background: ${p =>
    p.$status === 'reserved'
      ? 'var(--button-text-red-default)'
      : 'var(--button-text-green-default)'};
`;

const RentSlotHeaderTitle = styled.div`
  width: 85%;

  ${TruncateMixin}
`;

const RentSlotContent = styled.div`
  width: 100%;
  height: 26px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 1px 8px 5px 8px;
  border-radius: 0 0 8px 8px;

  ${TruncateMixin}
`;

const RentSlotInfo = styled.div`
  width: 20px;
  height: 20px;
`;

interface Props {
  fcEvent: EventContentArg;
  events: Rental[];
}

const RentEvent = (props: Props) => {
  const { fcEvent, events } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.calendar',
  });

  const { event } = fcEvent;

  return (
    <Root>
      <RentSlotContainer $status={event.extendedProps.status}>
        <RentSlotHeader $status={event.extendedProps.status}>
          <RentSlotHeaderTitle>{event.title}</RentSlotHeaderTitle>

          <RentSlotInfo>
            <MyHoverCard
              withinPortal
              openDelay={200}
              width="fit-content"
              transition="scale-y"
              position="right-start"
              target={
                <InfoIconWrapper>
                  <InfoLargeIcon />
                </InfoIconWrapper>
              }
            >
              <RentEventDetails
                eventDetails={events.find(e => e.id === Number(event.id)) ?? null}
              />
            </MyHoverCard>
          </RentSlotInfo>
        </RentSlotHeader>

        <RentSlotContent>{t(`statuses.${event.extendedProps.status}`)}</RentSlotContent>
      </RentSlotContainer>
    </Root>
  );
};

export { RentEvent };
