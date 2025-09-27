import { AddFilledButton, ControlButton } from '@/shared';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { TutorialItemForm } from '../../../../../../models';
import { TutorialEditGroupItemForm } from '../TutorialEditGroupItemForm/TutorialEditGroupItemForm';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CreatedFormControls = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
`;

const CreatedFormWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface Props {
  isSaving: boolean;
  createdForm?: TutorialItemForm;
  handleSaveForm: () => void;
  handleCreateForm: () => void;
  handleDeleteForm: () => void;
}

const CreateTutorialItemBlock = (props: Props) => {
  const { isSaving, createdForm, handleSaveForm, handleCreateForm, handleDeleteForm } = props;

  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer.create_tutorial_item_block',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onCreateForm = useCallback(() => {
    if (isSaving) return;

    if (createdForm && inputRef.current) {
      inputRef.current.focus();

      return;
    }

    handleCreateForm();
  }, [isSaving, createdForm, handleCreateForm]);

  return (
    <Root>
      <AddFilledButton text={t('create_link')} onClick={onCreateForm} />

      {createdForm && (
        <CreatedFormWrapper>
          <TutorialEditGroupItemForm
            ref={inputRef}
            dragDisabled
            itemForm={createdForm}
            formItemsDisabled={isSaving}
            handleSaveForm={isSaving ? undefined : handleSaveForm}
          />

          <CreatedFormControls>
            <ControlButton
              variant="save"
              loading={isSaving}
              disabled={isSaving}
              onClick={handleSaveForm}
            >
              {t('save')}
            </ControlButton>

            <ControlButton variant="cancel" disabled={isSaving} onClick={handleDeleteForm}>
              {t('cancel')}
            </ControlButton>
          </CreatedFormControls>
        </CreatedFormWrapper>
      )}
    </Root>
  );
};

export { CreateTutorialItemBlock };
