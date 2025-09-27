import { SpanWithEllipsis, type UtcDateValue } from '@/shared';
import { memo } from 'react';
import styled, { css } from 'styled-components';
import { CreatedAtIcon, ShippedAtIcon } from '../../../../../../../shared';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.div<{ $inactive: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  ${p =>
    p.$inactive &&
    css`
      svg path {
        fill: var(--button-text-graphite-secondary-text);
      }
    `}
`;

type ShipmentDateCellIconType = 'created_at' | 'shipped_at';

interface Props {
  inactive: boolean;
  date: UtcDateValue;
  icon: ShipmentDateCellIconType;
}

const ShipmentDateCell = memo((props: Props) => {
  const { inactive, date, icon } = props;

  return date ? (
    <Root>
      <IconWrapper $inactive={inactive}>
        {icon === 'created_at' ? <CreatedAtIcon /> : <ShippedAtIcon />}
      </IconWrapper>

      <SpanWithEllipsis inactive={inactive} text={date.displayShort()} />
    </Root>
  ) : null;
});

ShipmentDateCell.displayName = 'ShipmentDateCell';
export { ShipmentDateCell };
