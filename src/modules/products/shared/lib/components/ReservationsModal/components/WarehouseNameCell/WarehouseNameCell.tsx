import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import { memo } from 'react';
import styled, { css } from 'styled-components';
import { WarehouseIcon } from '../../../../../assets';

const Root = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      color: var(--button-text-graphite-secondary-text);

      svg path {
        fill: var(--button-text-graphite-secondary-text);
      }
    `}
`;

const WarehouseIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  name: string;
  disabled?: boolean;
}

const WarehouseNameCell = memo((props: Props) => {
  const { name, disabled } = props;

  return (
    <Root $disabled={disabled}>
      <WarehouseIconWrapper>
        <WarehouseIcon />
      </WarehouseIconWrapper>

      <SpanWithEllipsis medium text={name} />
    </Root>
  );
});

WarehouseNameCell.displayName = 'WarehouseNameCell';
export { WarehouseNameCell };
