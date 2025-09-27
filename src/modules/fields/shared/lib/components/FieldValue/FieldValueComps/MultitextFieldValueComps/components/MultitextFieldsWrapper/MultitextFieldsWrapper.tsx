import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const MultitextFieldsWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  ${TruncateMixin}
`;
