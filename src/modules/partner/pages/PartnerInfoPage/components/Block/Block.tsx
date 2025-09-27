import styled from 'styled-components';

export const Block = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;
