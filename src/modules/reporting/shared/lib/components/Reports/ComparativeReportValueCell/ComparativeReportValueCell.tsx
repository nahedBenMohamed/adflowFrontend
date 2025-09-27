import { memo } from 'react';
import styled, { css } from 'styled-components';
import type { ComparativeReportValue } from '../../../models';
import type { ReportRowType } from '../../../types';
import { ReportValueCellPart } from './components';

const Root = styled.div<{ $rowType: ReportRowType }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-variant: tabular-nums;

  ${p =>
    p.$rowType === 'total' &&
    css`
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      color: var(--button-text-graphite-priory-text);
    `}
`;

interface Props {
  rowType: ReportRowType;
  value?: ComparativeReportValue;
}

const ComparativeReportValueCell = memo((props: Props) => {
  const { rowType, value } = props;

  return (
    <Root $rowType={rowType}>
      <ReportValueCellPart
        type="quantity"
        rowType={rowType}
        value={value?.current.quantity ?? 0}
        diff={value?.difference.quantity ?? 0}
      />

      {'|'}

      <ReportValueCellPart
        type="amount"
        rowType={rowType}
        value={value?.current.amount ?? 0}
        diff={value?.difference.amount ?? 0}
      />
    </Root>
  );
});

ComparativeReportValueCell.displayName = 'ComparativeReportValueCell';
export { ComparativeReportValueCell };
