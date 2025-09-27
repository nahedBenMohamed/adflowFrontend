import { InnerHTMLNormalizerMixin } from '@/shared';
import styled from 'styled-components';

export const InnerHTMLNormalizer = styled.div<{ $expanded: boolean }>`
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: ${p => (p.$expanded ? 'unset' : 3)};
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${InnerHTMLNormalizerMixin}
`;
