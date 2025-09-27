import { calculateEndOfWordIdxByNumber, UtcDate } from '@/shared';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

dayjs.extend(duration);

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  max-width: 315px;
  padding: 20px 36px;

  background: var(--primary-statuses-white-0);
  border: 2px solid var(--graphite-graphite-840);
  border-radius: 20px;
`;

const Heading = styled.p`
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: var(--graphite-graphite-840);
  font-family: 'Geologica', sans-serif;
`;

const CounterWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const DigitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 72px;
  padding: 14px 20px;

  background: var(--graphite-graphite-840);
  border-radius: 10px;
`;

const Digit = styled.div`
  font-size: 36px;
  line-height: 50px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  color: var(--primary-statuses-white-0);
  font-family: 'Nunito SemiBold', sans-serif;
`;

const DigitPeriod = styled.div`
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  color: var(--primary-statuses-white-0);
  font-family: 'Nunito', sans-serif;
`;

interface Counter {
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

interface Props {
  endDate: UtcDate;
}

const PriceRiseCounter = (props: Props) => {
  const { endDate } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.billing_page.lifetime_promo_plans.price_rise_counter',
  });

  const [timeLeft, setTimeLeft] = useState<Counter>({ months: 0, days: 0, hours: 0, minutes: 0 });
  const animationFrameRef = useRef<number>(0);

  const calculateTimeUntilEndOfSale = useCallback(() => {
    const now = UtcDate.now();
    const endOfSale = endDate;

    if (now.isAfter(endOfSale)) {
      return { months: 0, days: 0, hours: 0, minutes: 0 };
    }

    const diff = dayjs.duration(endOfSale.diff(now) * 1000);

    return {
      months: diff.months(),
      days: diff.days(),
      hours: diff.hours(),
      minutes: diff.minutes(),
    };
  }, [endDate]);

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeUntilEndOfSale());
      animationFrameRef.current = window.requestAnimationFrame(updateCountdown);
    };

    animationFrameRef.current = window.requestAnimationFrame(updateCountdown);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [calculateTimeUntilEndOfSale]);

  const formatMonthsCount = useCallback(
    (days: number) => {
      const idx = calculateEndOfWordIdxByNumber(days);

      return t(`months.${idx}`);
    },
    [t]
  );

  const formatDaysCount = useCallback(
    (days: number) => {
      const idx = calculateEndOfWordIdxByNumber(days);

      return t(`days.${idx}`);
    },
    [t]
  );

  const formatHoursCount = useCallback(
    (hours: number) => {
      const idx = calculateEndOfWordIdxByNumber(hours);

      return t(`hours.${idx}`);
    },
    [t]
  );

  const formatMinutesCount = useCallback(
    (minutes: number) => {
      const idx = calculateEndOfWordIdxByNumber(minutes);

      return t(`minutes.${idx}`);
    },
    [t]
  );

  return (
    <Root>
      <Heading>{t('sale_ends')}</Heading>

      <CounterWrapper>
        {timeLeft.months > 0 && (
          <DigitWrapper>
            <Digit>{timeLeft.months}</Digit>

            <DigitPeriod>{formatMonthsCount(timeLeft.months)}</DigitPeriod>
          </DigitWrapper>
        )}

        <DigitWrapper>
          <Digit>{timeLeft.days}</Digit>

          <DigitPeriod>{formatDaysCount(timeLeft.days)}</DigitPeriod>
        </DigitWrapper>

        <DigitWrapper>
          <Digit>{timeLeft.hours}</Digit>

          <DigitPeriod>{formatHoursCount(timeLeft.hours)}</DigitPeriod>
        </DigitWrapper>

        {timeLeft.months < 1 && (
          <DigitWrapper>
            <Digit>{timeLeft.minutes}</Digit>

            <DigitPeriod>{formatMinutesCount(timeLeft.minutes)}</DigitPeriod>
          </DigitWrapper>
        )}
      </CounterWrapper>
    </Root>
  );
};

export { PriceRiseCounter };
