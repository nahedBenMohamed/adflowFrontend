import styled from 'styled-components';

export const LogoutButton = styled.button`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-red-hover);
  }

  &:active {
    color: var(--button-text-red-active);
  }
`;
