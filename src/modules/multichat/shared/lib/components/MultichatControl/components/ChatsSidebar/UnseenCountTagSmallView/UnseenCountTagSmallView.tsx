import styled from 'styled-components';

export const UnseenCountTagSmallView = styled.div`
  position: absolute;
  top: -20%;
  right: -50%;

  height: 20px;
  min-width: 20px;
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
  color: var(--primary-statuses-white-0);

  padding: 1px 4px;
  border-radius: 16px;
  border: 1px solid var(--primary-statuses-white-0);
  background-color: var(--primary-statuses-green-520);
`;
