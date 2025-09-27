import { observer, useLocalObservable } from 'mobx-react-lite';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PlusIcon } from '../../../../../assets';
import { InputModel } from '../../../../models';
import { ControlButton } from '../../../Buttons/ControlButton/ControlButton';
import { MyInput } from '../../../Form/Input/MyInput/MyInput';

const Root = styled.div`
  display: flex;

  border-top: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-40);
`;

const AddBoardControlsWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
`;

const PlusIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  background: var(--button-text-green-default);
  transition: var(--transition-200);
`;

const AddButton = styled.button`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px 12px 8px 8px;
  background-color: var(--graphite-graphite-40);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--graphite-graphite-840);
    border-color: #eff5eb;
    background-color: #eff5eb;

    ${PlusIconWrapper} {
      background-color: var(--button-text-green-active);
    }
  }

  &:active {
    border-color: #e6fbda;
    background-color: #e6fbda;

    ${PlusIconWrapper} {
      background-color: var(--button-text-green-hover);
    }
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

interface Props {
  isAddMode: boolean;
  isAdding: boolean;
  handleAddNew: (boardName: string) => Promise<void>;
  showAddMode: () => void;
  handleCancel: () => void;
}

const Controls = observer((props: Props) => {
  const { isAddMode, isAdding, showAddMode, handleAddNew, handleCancel } = props;

  const { t } = useTranslation();

  const model = useLocalObservable(() => InputModel.create().required());

  const onAdd = async (): Promise<void> => {
    if (!model.validate()) return;

    await handleAddNew(model.value);
    model.value = '';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onAdd();
  };

  const onCancel = () => {
    handleCancel();

    model.value = '';
  };

  return (
    <Root>
      {isAddMode ? (
        <AddBoardControlsWrapper>
          <MyInput
            autoFocus
            model={model}
            hasBorderBottom
            variant="outlined"
            disabled={isAdding}
            placeholder={t('new_board')}
            onKeyDown={handleKeyDown}
          />
          <ControlsWrapper>
            <ControlButton variant="cancel" onClick={onCancel}>
              {t('buttons.cancel')}
            </ControlButton>

            <ControlButton disabled={isAdding} loading={isAdding} onClick={onAdd}>
              {t('buttons.add')}
            </ControlButton>
          </ControlsWrapper>
        </AddBoardControlsWrapper>
      ) : (
        <AddButton onClick={showAddMode}>
          <PlusIconWrapper>
            <PlusIcon />
          </PlusIconWrapper>

          {t('new_board')}
        </AddButton>
      )}
    </Root>
  );
});

Controls.displayName = 'Controls';
export { Controls };
