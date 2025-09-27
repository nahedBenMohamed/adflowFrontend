import { MediaBreakpoints, MiniLoader, useLeftBlockWidth } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface RootProps {
  $width: number;
  $opened: boolean;
}

const ACTION_MENU_HEIGHT = '52px';

const Root = styled.div<RootProps>`
  position: fixed;
  bottom: ${p => (p.$opened ? 0 : `-${ACTION_MENU_HEIGHT}`)};

  height: ${ACTION_MENU_HEIGHT};
  width: ${p => p.$width}px;

  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  color: var(--primary-statuses-white-0);

  padding: 0 15px;
  background-color: var(--primary-blue);
  border-top-left-radius: var(--border-radius-block);
  border-top-right-radius: var(--border-radius-block);
  transition: var(--transition-200);

  @media ${MediaBreakpoints.SM} {
    left: 0;

    width: 100vw;
  }
`;

interface ActionMenuButtonProps {
  $bordered: boolean;
  $disabled: boolean;
}

const ActionMenuButton = styled.button<ActionMenuButtonProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  margin-left: 8px;
  padding: 4px 15px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--graphite-graphite-40);

    border-color: var(--graphite-graphite-40);
  }

  &:active {
    color: var(--primary-statuses-white-0);

    border-color: var(--primary-statuses-white-0);
  }

  &:disabled {
    opacity: 0.65;
  }

  ${p => p.$bordered && `border: 1px solid #c7ddf2`};
`;

interface Props {
  opened: boolean;
  saving: boolean;
  canceling: boolean;
  onSave: () => void;
  onCancel: () => Promise<void>;
}

const ActionMenu = (props: Props) => {
  const { opened, saving, canceling, onSave, onCancel } = props;

  const { t } = useTranslation();

  const leftBlockWidth = useLeftBlockWidth();

  if (leftBlockWidth === 0) return null;

  const savingOrCanceling = saving || canceling;

  return (
    <Root $width={leftBlockWidth - 3} $opened={opened}>
      <ActionMenuButton $bordered $disabled={savingOrCanceling} onClick={onSave}>
        {saving && <MiniLoader />}

        {t('buttons.save')}
      </ActionMenuButton>

      <ActionMenuButton
        $bordered={false}
        $disabled={savingOrCanceling}
        className="workspace__ActionMenu--Cancel"
        onClick={onCancel}
      >
        {canceling && <MiniLoader />}

        {t('buttons.cancel')}
      </ActionMenuButton>
    </Root>
  );
};

export { ActionMenu };
