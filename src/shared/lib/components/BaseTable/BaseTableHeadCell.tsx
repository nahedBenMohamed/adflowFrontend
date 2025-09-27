import { flexRender } from '@tanstack/react-table';
import type { Header } from '@tanstack/table-core';
import type { CSSProperties } from 'react';
import styled from 'styled-components';

interface RootProps {
  $flex?: CSSProperties['flex'];
  $width?: CSSProperties['width'];
}

const Root = styled.div<RootProps>`
  position: relative;

  height: 24px;
  width: ${p => p.$width};

  flex: ${p => p.$flex};
  display: flex;
  align-items: center;

  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);

  padding-bottom: 8px;

  white-space: nowrap;
  overflow: hidden;
`;

interface Props<T> {
  header: Header<T, unknown>;
  getCellStyleFn?: (cell: Header<T, unknown>) => CSSProperties;
}

const BaseTableHeadCell = <T extends unknown>(props: Props<T>) => {
  const { header, getCellStyleFn } = props;

  const { column, isPlaceholder, getContext } = header;

  return (
    <Root style={getCellStyleFn ? getCellStyleFn(header) : { width: header.column.getSize() }}>
      {isPlaceholder ? null : flexRender(column.columnDef.header, getContext())}
    </Root>
  );
};

export { BaseTableHeadCell };
