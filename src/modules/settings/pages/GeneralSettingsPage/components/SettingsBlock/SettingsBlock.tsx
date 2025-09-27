import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const SettingsBlock = styled.div`
  gap: 16px;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));

  padding: 24px 32px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  ${TruncateMixin}
`;
