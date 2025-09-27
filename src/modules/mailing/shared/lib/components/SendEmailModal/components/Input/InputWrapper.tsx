import styled from 'styled-components';

export const InputWrapper = styled.div<{ $paddingLeft: string }>`
  position: relative;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  input {
    padding-bottom: 6px;
    padding-left: ${p => p.$paddingLeft};
  }
`;
