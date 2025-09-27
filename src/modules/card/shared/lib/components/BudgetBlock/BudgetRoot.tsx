import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const BudgetRoot = styled.div<{ $disabled?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-align: right;
  color: var(--graphite-graphite-840);

  ${TruncateMixin}

  ${p => p.$disabled && `pointer-events: none`};
`;
