import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const AppointmentIndexCell = styled.div<{ $header?: boolean }>`
  min-width: 34px;

  font-size: 14px;
  text-align: left;
  line-height: 20px;
  font-weight: ${p => (p.$header ? 700 : 600)};
  color: var(--button-text-graphite-priory-text);

  padding: ${p => (p.$header ? '0 8px 0 13px' : '0 10px')};

  ${TruncateMixin}
`;
