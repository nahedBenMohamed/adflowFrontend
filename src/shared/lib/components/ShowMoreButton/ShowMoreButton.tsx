import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CaretDownIcon } from '../../../assets';

interface RootProps {
  $resolved: boolean;
  $disabled: boolean;
}

const Root = styled.button<RootProps>`
  display: flex;
  gap: 4px;
  align-items: flex-end;

  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  color: ${p => (p.$resolved ? 'var(--button-text-graphite-primary-text)' : 'var(--primary-blue)')};

  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    ${p =>
      !p.$resolved &&
      css`
        color: var(--button-text-blue-hover);

        svg path {
          fill: var(--button-text-blue-hover);
        }
      `}
  }

  ${p =>
    !p.$resolved &&
    css`
      &:active {
        color: var(--button-text-blue-active);

        svg path {
          fill: var(--button-text-blue-active);
        }
      }
    `}

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.6;
      pointer-events: none;
    `}
`;

const IconWrapper = styled.div<{ $active: boolean }>`
  width: 14px;
  height: 14px;

  transition: var(--transition-200);
  transform: rotate(${p => (p.$active ? '180deg' : '0deg')});

  svg path {
    transition: var(--transition-200);
  }
`;

interface Props {
  active: boolean;
  visible?: boolean;
  resolved?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ShowMoreButton = (props: Props) => {
  const { active, visible = true, disabled = false, resolved = false, onClick } = props;

  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <Root onClick={onClick} $resolved={resolved} $disabled={disabled}>
      <IconWrapper $active={active}>
        <CaretDownIcon />
      </IconWrapper>

      {active ? t('show_less') : t('show_more')}
    </Root>
  );
};

export { ShowMoreButton };
