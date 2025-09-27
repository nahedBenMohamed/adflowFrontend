import styled from 'styled-components';

export const FormWrapper = styled.div`
  width: 100%;
  height: fit-content;

  display: grid;
  grid-template-columns: repeat(2, calc(50% - 12px));
  gap: 24px;
`;
