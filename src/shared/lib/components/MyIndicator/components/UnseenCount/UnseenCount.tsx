import styled, { css } from 'styled-components';

export const UnseenCount = styled.span<{ $small: boolean }>`
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: var(--primary-statuses-white-0);

  ${p =>
    p.$small &&
    css`
      font-size: 8px;
      line-height: 12px;
    `}
`;
