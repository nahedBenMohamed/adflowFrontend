import { type CSSProperties } from 'react';
import styled from 'styled-components';

interface EmptyTableBlockProps {
  $verticalText?: boolean;
  $height?: CSSProperties['height'];
  $minHeight?: CSSProperties['minWidth'];
  $justifyContent?: CSSProperties['justifyContent'];
}

export const EmptyTableBlock = styled.div<EmptyTableBlockProps>`
  width: 100%;
  max-width: 100vw;
  height: ${p => p.$height ?? '100%'};

  display: flex;
  align-items: center;
  justify-content: ${p => p.$justifyContent ?? 'center'};

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${p => p.$minHeight && `min-height: ${p.$minHeight}`};
  ${p => p.$verticalText && `writing-mode: vertical-rl`};
`;
