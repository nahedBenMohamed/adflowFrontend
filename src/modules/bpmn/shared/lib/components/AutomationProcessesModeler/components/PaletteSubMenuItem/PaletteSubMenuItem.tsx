import styled from 'styled-components';

export const PaletteSubMenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 12px;
  transition: var(--transition-200);

  &:hover {
    cursor: move;

    background-color: #f3fded;
  }

  &:active {
    background-color: #e6fbda;
  }
`;
