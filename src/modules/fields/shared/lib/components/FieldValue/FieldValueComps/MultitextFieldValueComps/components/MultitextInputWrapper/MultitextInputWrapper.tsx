import { TruncateMixin } from '@/shared';
import styled from 'styled-components';

export const MultitextInputWrapper = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  ${TruncateMixin}
`;
