import { ClearIcon, SettingsTwoLinesIcon } from '@/shared';
import { memo, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, type CSSProperties } from 'styled-components';

interface RootProps {
  $active: boolean;
  $margin?: CSSProperties['margin'];
  $backgroundColor?: CSSProperties['backgroundColor'];
}

const Root = styled.button<RootProps>`
  height: 28px;

  z-index: 2;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 3px 12px 3px 8px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: ${p => p.$backgroundColor ?? 'var(--graphite-graphite-20)'};
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        color: var(--button-text-green-active);

        border-color: #f3fded;
        background-color: #f3fded;

        svg path {
          fill: var(--button-text-green-active);
        }
      }

      &:active {
        color: var(--button-text-green-hover);

        border-color: #e6fbda;
        background-color: #e6fbda;

        svg path {
          fill: var(--button-text-green-hover);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      color: var(--graphite-graphite-840);

      background: var(--primary-statuses-white-0);
      border-color: var(--primary-statuses-green-520);

      svg path {
        fill: var(--graphite-graphite-840);
      }
    `}

  ${p => p.$margin && `margin: ${p.$margin}`};
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  active: boolean;
  margin?: CSSProperties['margin'];
  backgroundColor?: CSSProperties['backgroundColor'];
}

const CustomizeButton = memo((props: Props) => {
  const { active, margin, backgroundColor, ...rest } = props;

  const { t } = useTranslation();

  return (
    <Root $active={active} $margin={margin} $backgroundColor={backgroundColor} {...rest}>
      {active ? <ClearIcon /> : <SettingsTwoLinesIcon />}

      {t('customize')}
    </Root>
  );
});

CustomizeButton.displayName = 'CustomizeButton';
export { CustomizeButton };
