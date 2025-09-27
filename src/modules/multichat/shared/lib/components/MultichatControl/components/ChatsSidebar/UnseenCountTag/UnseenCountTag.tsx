import styled from 'styled-components';

export const UnseenCountTag = styled.span<{ $bordered?: boolean }>`
  height: 20px;
  min-width: 20px;
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  color: var(--primary-statuses-white-0);

  padding: 0 5px;
  border-radius: 16px;
  background-color: var(--button-text-green-default);

  ${p => p.$bordered && `border: 1px solid var(--primary-statuses-white-0)`}
`;
