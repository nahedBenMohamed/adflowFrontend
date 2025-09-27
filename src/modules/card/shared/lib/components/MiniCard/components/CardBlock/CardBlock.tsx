import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const CardBlock = styled.div`
  position: relative;

  width: 100%;

  flex-shrink: 0;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0 1px 2px #d0daeb,
    0 0 2px #eef4fe;

  ${TruncateMixin}
`;
