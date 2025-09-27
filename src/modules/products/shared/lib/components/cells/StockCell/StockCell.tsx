import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $color: CSSProperties['color'];
  $disabled?: boolean;
}

const Root = styled.div<RootProps>`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${p => p.$color};

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      color: var(--button-text-graphite-secondary-text);
    `}
`;

type StockCellColor = 'green' | 'red' | 'orange' | 'gray';

const stockColors: Record<StockCellColor, CSSProperties['color']> = {
  green: 'var(--button-text-green-default)',
  red: 'var(--button-text-red-default)',
  orange: 'var(--primary-statuses-orange-440)',
  gray: 'var(--button-text-graphite-primary-text)',
};

interface Props {
  stock: number;
  color?: StockCellColor;
  disabled?: boolean;
}

const StockCell = observer((props: Props) => {
  const { stock, color = 'gray', disabled } = props;

  const stockColor = stockColors[color];

  return (
    <Root $color={stockColor} $disabled={disabled}>
      {stock}
    </Root>
  );
});

StockCell.displayName = 'StockCell';
export { StockCell };
