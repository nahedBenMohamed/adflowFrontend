import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ControlButton, PlusIconButton } from '../../../../components';
import { InputModel } from '../../../../models';
import { MyInput } from '../../Input/MyInput/MyInput';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  placeholder: string;
  buttonText: string;
  onAdd: (text: string) => Promise<void>;
  onOpen?: () => void;
  onClose?: () => void;
}

const AddItemForm = observer((props: Props) => {
  const { placeholder, buttonText, onAdd, onOpen, onClose } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'buttons',
  });

  const [opened, { close: hide, open }] = useDisclosure(false);
  const [adding, setAdding] = useState(false);

  const textModel = useLocalObservable(() => InputModel.create().required());

  const handleOpen = () => {
    onOpen?.();

    open();
  };

  const handleClose = () => {
    onClose?.();

    hide();
  };

  const handleAdd = async (): Promise<void> => {
    if (textModel.validate()) {
      try {
        setAdding(true);

        await onAdd(textModel.value);
      } finally {
        setAdding(false);

        textModel.value = '';
      }
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    handleAdd();
  };

  const handleCancel = () => {
    textModel.value = '';
    handleClose();
  };

  return (
    <Root>
      {opened && (
        <MyInput
          autoFocus
          alwaysActive
          model={textModel}
          whitespaceClearing
          placeholder={placeholder}
          onKeyDown={handleEnter}
        />
      )}

      {opened ? (
        <ControlsWrapper>
          <ControlButton disabled={adding} loading={adding} onClick={handleAdd}>
            {t('save')}
          </ControlButton>

          <ControlButton variant="cancel" onClick={handleCancel}>
            {t('cancel')}
          </ControlButton>
        </ControlsWrapper>
      ) : (
        <PlusIconButton onClick={handleOpen} text={buttonText} />
      )}
    </Root>
  );
});

AddItemForm.displayName = 'AddItemForm';
export { AddItemForm };
