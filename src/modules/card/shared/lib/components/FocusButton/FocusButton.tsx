import { MyTooltip, TargetIcon } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { CardStore } from '../../../../store';

const Root = styled.button<{ $active?: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg {
    width: 16px;
    height: 16px;

    path {
      transition: var(--transition-200);
    }
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      background: var(--background-green-20);

      svg path {
        fill: var(--button-text-green-active);
      }

      &:hover {
        cursor: pointer;

        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

interface Props {
  cardStore: CardStore;
}

const FocusButton = observer((props: Props) => {
  const { cardStore } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const { entity, toggleEntityFocus } = cardStore;

  if (!entity) return null;

  return (
    <MyTooltip label={t('card_focus')} openDelay={1000}>
      <Root $active={entity?.focused} onClick={toggleEntityFocus}>
        <TargetIcon />
      </Root>
    </MyTooltip>
  );
});

FocusButton.displayName = 'FocusButton';
export { FocusButton };
