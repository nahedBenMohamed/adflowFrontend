import styled, { css, type CSSProperties } from 'styled-components';

interface TextEditorWrapperProps {
  $focused: boolean;
  $defaultOutlined?: boolean;
  $padding?: CSSProperties['padding'];
}

export const TextEditorWrapper = styled.div<TextEditorWrapperProps>`
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: ${p => p.$padding ?? '16px'};
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p =>
    p.$focused
      ? css`
          border: 1px solid var(--button-text-green-active);
          box-shadow: 1px 1px 6px 0px var(--primary-statuses-green-520);
        `
      : css`
          border: 1px solid ${p.$defaultOutlined ? 'var(--graphite-graphite-80)' : 'transparent'};

          &:hover {
            cursor: pointer;

            border-color: var(--button-text-graphite-secondary-text);
          }
        `}
`;
