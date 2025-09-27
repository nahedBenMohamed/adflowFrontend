import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const FieldSelectWrapper = styled.div<{ $placeholderShown?: boolean }>`
  width: ${p => (p.$placeholderShown ? 'var(--field-dropdown-min-width)' : 'fit-content')};
  max-width: 100%;

  ${TruncateMixin}
`;
