import styled from 'styled-components';

export const BaseTableBodyRowFilled = styled.div`
  height: 42px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-element);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;
