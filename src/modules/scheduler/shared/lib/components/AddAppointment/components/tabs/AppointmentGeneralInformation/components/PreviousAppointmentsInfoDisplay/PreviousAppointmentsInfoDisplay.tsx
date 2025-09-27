import { FilterDelimiter, truncateNumber, type UtcDate } from '@/shared';
import { memo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  padding: 0 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: stretch;
  gap: 12px;
`;

const BlockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const ValueWrapper = styled.div<{ $minWidth?: CSSProperties['minWidth'] }>`
  height: 28px;
  min-width: ${p => p.$minWidth};

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 4px 12px;
  background: var(--graphite-graphite-20);
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80,);
`;

interface Props {
  count?: number;
  lastDate?: UtcDate;
}

const PreviousAppointmentsInfoDisplay = memo((props: Props) => {
  const { count, lastDate } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  return (
    <Root>
      <Wrapper>
        <BlockWrapper>
          <Title>{t('count')}</Title>

          <ValueWrapper $minWidth="36px">
            {count ? truncateNumber({ num: count, precision: 4 }) : 0}
          </ValueWrapper>
        </BlockWrapper>

        <BlockWrapper>
          <Title>{t('last_visit')}</Title>

          <ValueWrapper $minWidth="124px">
            {lastDate ? lastDate.format('DD MMM, hh A') : '–'}
          </ValueWrapper>
        </BlockWrapper>
      </Wrapper>

      <FilterDelimiter />
    </Root>
  );
});

PreviousAppointmentsInfoDisplay.displayName = 'PreviousAppointmentsInfoDisplay';
export { PreviousAppointmentsInfoDisplay };
