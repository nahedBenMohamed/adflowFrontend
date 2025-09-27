import { generalSettingsStore } from '@/app';
import { Currency, currencyFormatterHelper } from '@/shared';
import { memo, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { DeclineIcon, GrowthIcon } from '../../../../../../assets';
import type { ReportRowType } from '../../../../../types';

const Part = styled.div<{ $rowType: ReportRowType }>`
  display: flex;
  align-items: center;
  gap: ${p => (p.$rowType === 'total' ? 8 : 4)}px;

  ${p => (p.$rowType === 'group' || p.$rowType === 'subgroup') && `font-weight: 600`};
`;

interface DynamicProps {
  dynamic: ValueDynamic;
  rowType: ReportRowType;
}

const Dynamic = styled.div<DynamicProps>`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  font-size: 12px;
  line-height: 16px;
  color: ${p => {
    switch (p.dynamic) {
      case 'growth':
        return `var(--button-text-green-active)`;

      case 'decline':
        return `var(--button-text-red-default)`;

      case 'none':
        return `var(--button-text-graphite-primary-text)`;
    }
  }};

  ${p =>
    p.rowType === 'total' &&
    css`
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
    `}
`;

const DynamicIconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

type ValueDynamic = 'growth' | 'decline' | 'none';
type ValueType = 'quantity' | 'amount';

interface Props {
  type: ValueType;
  value: number;
  diff: number;
  rowType: ReportRowType;
}

const calculateValueDynamic = (diff: number): ValueDynamic => {
  if (diff > 0) return 'growth';

  if (diff < 0) return 'decline';

  return 'none';
};

const getDiffPercentage = (diff: number): string => {
  return (diff ? (diff * 100).toFixed(2) : '0') + '%';
};

const ReportValueCellPart = memo((props: Props) => {
  const { value, diff, type, rowType } = props;

  const getFormattedValue = useCallback(
    (value: number): string => {
      if (type === 'quantity') return value.toFixed(0);

      return currencyFormatterHelper.format({
        value,
        currency: generalSettingsStore.accountSettings?.currency ?? Currency.USD,
      });
    },
    [type]
  );

  const dynamic = useMemo<ValueDynamic>(() => calculateValueDynamic(diff), [diff]);

  return (
    <Part $rowType={rowType}>
      {getFormattedValue(value)}

      <Dynamic rowType={rowType} dynamic={dynamic}>
        {getDiffPercentage(diff)}

        {(dynamic === 'growth' || dynamic === 'decline') && (
          <DynamicIconWrapper>
            {dynamic === 'growth' && <GrowthIcon />}
            {dynamic === 'decline' && <DeclineIcon />}
          </DynamicIconWrapper>
        )}
      </Dynamic>
    </Part>
  );
});

export { ReportValueCellPart };
