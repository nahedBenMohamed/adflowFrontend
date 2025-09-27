import styled, { css } from 'styled-components';

const CommonStyles = css<{ $tableView?: boolean }>`
  ${p =>
    !p.$tableView &&
    css`
      @media (max-width: 1240px) {
        display: none;
      }
    `}
`;

export const TimezoneWrapper = styled.div`
  height: 20px;
  width: 48px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-size: 12px;
  font-weight: 600;
  color: var(--button-text-graphite-primary-text);

  padding: 0 6px;
  white-space: nowrap;
  background: var(--graphite-graphite-40);
  border-radius: var(--border-radius-element);

  &:hover {
    cursor: pointer;
  }

  ${CommonStyles}
`;

export const TimezoneLoaderWrapper = styled.div`
  width: fit-content;
  height: fit-content;

  ${CommonStyles}
`;
