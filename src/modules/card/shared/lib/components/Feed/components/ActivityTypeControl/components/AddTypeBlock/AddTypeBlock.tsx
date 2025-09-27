import { ControlButton, MyInput, type InputModel } from '@/shared';
import { Ref, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  ref?: Ref<HTMLInputElement>;
  model: InputModel;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const AddTypeBlock = (props: Props) => {
  const { ref, model, loading, onSave, onCancel } = props;

  const { t } = useTranslation();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    onSave();
  };

  return (
    <Root>
      <MyInput
        ref={ref}
        model={model}
        hasBorderBottom
        placeholder={t('new_activity_type')}
        onKeyDown={handleKeyDown}
      />

      <ControlsWrapper>
        <ControlButton disabled={loading} loading={loading} onClick={onSave}>
          {t('buttons.add')}
        </ControlButton>

        <ControlButton variant="cancel" onClick={onCancel}>
          {t('buttons.cancel')}
        </ControlButton>
      </ControlsWrapper>
    </Root>
  );
};

export { AddTypeBlock };
