import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1224px;

  display: flex;

  padding: 0 108px;

  @media (max-width: 1320px) {
    padding: 0 88px;
  }

  @media (max-width: 1100px) {
    padding: 0 56px;
  }

  @media (max-width: 992px) {
    padding: 0 48px;
  }

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;
