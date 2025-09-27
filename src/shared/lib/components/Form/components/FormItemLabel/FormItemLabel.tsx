import styled, { css, type CSSProperties } from 'styled-components';
import { TruncateMixin } from '../../../../mixins';

interface FormItemLabelProps {
  $gap?: CSSProperties['gap'];
  $color?: CSSProperties['color'];
  $fontWeight?: CSSProperties['fontWeight'];
}

export const FormItemLabel = styled.div<FormItemLabelProps>`
  flex-shrink: 0;
  ${p =>
    p.$gap &&
    css`
      display: flex;
      align-items: center;
      gap: ${p.$gap};
    `}

  font-size: 14px;
  font-weight: ${p => p.$fontWeight ?? 400};
  line-height: 18px;
  color: ${p => p.$color ?? 'var(--button-text-graphite-priory-text)'};

  ${TruncateMixin}
`;
