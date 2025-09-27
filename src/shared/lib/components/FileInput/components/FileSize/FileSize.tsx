import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { formatBytes } from '../../../../helpers';
import { TruncateMixin } from '../../../../mixins';

interface RootProps {
  $minWidth: CSSProperties['minWidth'];
  $color?: string;
}

const Root = styled.span<RootProps>`
  min-width: ${p => p.$minWidth};

  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: ${p => p.$color ?? `var(--button-text-graphite-secondary-text)`};

  ${TruncateMixin}
`;

interface Props {
  $size: number;
  $minWidth?: CSSProperties['minWidth'];
  $color?: string;
}

const FileSize = (props: Props) => {
  const { $size: size, $minWidth: minWidth = '36px', $color: color } = props;

  return (
    <Root $minWidth={minWidth} $color={color}>
      {formatBytes({ bytes: size, decimals: 0 })}
    </Root>
  );
};

export { FileSize };
