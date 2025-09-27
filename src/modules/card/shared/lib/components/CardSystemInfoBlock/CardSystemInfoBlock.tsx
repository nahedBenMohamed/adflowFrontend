import { UtcDate, calculateEndOfWordIdxByNumber, type UtcDateValue } from '@/shared';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CardSystemInfoBlockItem } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

interface Props {
  createdAt: UtcDate;
  isOnSystemStatus: boolean;
  closedAt?: UtcDateValue;
  lastShipmentDate?: UtcDateValue;
}

const CardSystemInfoBlock = memo((props: Props) => {
  const { createdAt, isOnSystemStatus, closedAt, lastShipmentDate } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const dateNow = useMemo<UtcDate>(() => UtcDate.now(), []);

  const getDaysInWork = useCallback(() => {
    if (isOnSystemStatus && closedAt) return Math.round(closedAt.diffDays(createdAt));

    return Math.round(dateNow.diffDays(createdAt));
  }, [dateNow, closedAt, createdAt, isOnSystemStatus]);

  const daysInWork = getDaysInWork();
  const daysInWorkEndOfWordIdx = calculateEndOfWordIdxByNumber(daysInWork);

  return (
    <Root>
      <Row>
        <CardSystemInfoBlockItem label={t('creation_date')} text={createdAt.toString()} />

        <CardSystemInfoBlockItem
          label={t('in_work')}
          text={`${daysInWork} ${t(`days.${daysInWorkEndOfWordIdx}`)}`}
        />
      </Row>

      {(closedAt || lastShipmentDate) && (
        <Row>
          {closedAt && (
            <CardSystemInfoBlockItem label={t('closing_date')} text={closedAt.toString()} />
          )}

          {lastShipmentDate && (
            <CardSystemInfoBlockItem
              label={t('shipping_date')}
              text={lastShipmentDate.toString()}
            />
          )}
        </Row>
      )}
    </Root>
  );
});

CardSystemInfoBlock.displayName = 'CardSystemInfoBlock';
export { CardSystemInfoBlock };
