import { userStore } from '@/app';
import {
  DeleteButton,
  DragFieldIcon,
  MultiselectWithCheckboxes,
  UsersMultiselect,
  type Optional,
} from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  useGetTutorialProductsGroups,
  useGetTutorialProductsOptions,
} from '../../../../../../hooks';
import type { TutorialItemForm } from '../../../../../../models';
import { TutorialGroupItemFormInput } from '../TutorialGroupItemFormInput/TutorialGroupItemFormInput';

const FormItemWrapper = styled.div`
  position: relative;

  height: 36px;
  width: var(--tutorial-item-column-width);

  flex-shrink: 0;
`;

const InputWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;

  transition: var(--transition-200);
`;

const NameInputWrapper = styled(InputWrapper)`
  z-index: 3;

  &:focus-within {
    width: calc(var(--tutorial-item-column-width) * 4 + 16px * 3);
  }
`;

const LinkInputWrapper = styled(InputWrapper)`
  z-index: 2;

  &:focus-within {
    width: calc(var(--tutorial-item-column-width) * 3 + 16px * 2);
  }
`;

interface RootProps {
  $dragging?: boolean;
  $formItemsDisabled?: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  align-items: center;
  gap: 16px;

  padding-bottom: 12px;
  transition: var(--transition-200);

  ${p => p.$dragging && `opacity: 0.5`};

  ${p =>
    p.$formItemsDisabled &&
    css`
      ${FormItemWrapper} {
        pointer-events: none;

        opacity: 0.5;
      }
    `}
`;

const DragIconWrapper = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }
`;

const DeleteButtonWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  margin-left: auto;
`;

interface Props {
  ref?: Ref<HTMLInputElement>;
  itemForm: TutorialItemForm;
  isDragging?: boolean;
  dragDisabled?: boolean;
  formItemsDisabled?: boolean;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  handleSaveForm?: () => void;
  handleUpdateName?: () => void;
  handleUpdateLink?: () => void;
  handleUpdateUserIds?: () => void;
  handleUpdateProducts?: () => void;
  handleDeleteForm?: () => void;
}

const TutorialEditGroupItemForm = observer((props: Props) => {
  const {
    ref,
    itemForm: { id, name, link, userIds, products },
    isDragging,
    dragDisabled,
    formItemsDisabled,
    dragHandleProps,
    handleSaveForm,
    handleUpdateName,
    handleUpdateLink,
    handleUpdateUserIds,
    handleUpdateProducts,
    handleDeleteForm,
  } = props;

  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer.tutorial_edit_group_item_form',
  });

  const productsGroups = useGetTutorialProductsGroups();
  const productsOptions = useGetTutorialProductsOptions();

  const getSaveOnEnterHandler = useCallback<() => Optional<() => void>>(
    // we allow to save on enter only forms which are not saved yet (hence have negative id)
    () => (id < 0 ? handleSaveForm : undefined),
    [id, handleSaveForm]
  );

  return (
    <Root $dragging={isDragging} $formItemsDisabled={formItemsDisabled}>
      <DragIconWrapper disabled={formItemsDisabled || dragDisabled} {...dragHandleProps}>
        <DragFieldIcon />
      </DragIconWrapper>

      <FormItemWrapper>
        <NameInputWrapper>
          <TutorialGroupItemFormInput
            ref={ref}
            model={name}
            placeholder={t('placeholders.name')}
            handleChange={handleUpdateName}
            handleSaveOnEnter={getSaveOnEnterHandler()}
          />
        </NameInputWrapper>
      </FormItemWrapper>

      <FormItemWrapper>
        <LinkInputWrapper>
          <TutorialGroupItemFormInput
            model={link}
            placeholder={t('placeholders.link')}
            handleChange={handleUpdateLink}
            handleSaveOnEnter={getSaveOnEnterHandler()}
          />
        </LinkInputWrapper>
      </FormItemWrapper>

      <FormItemWrapper>
        <UsersMultiselect
          withinPortal
          model={userIds}
          titleMinWidth={0}
          variant="outlined-tall"
          fixedDropdownWidth={272}
          users={userStore.activeUsers}
          placeholder={t('placeholders.all')}
          handleChange={handleUpdateUserIds}
        />
      </FormItemWrapper>

      <FormItemWrapper>
        <MultiselectWithCheckboxes
          withinPortal
          model={products}
          titleMinWidth={0}
          position="bottom-end"
          variant="outlined-tall"
          groups={productsGroups}
          dropdownMinWidth="272px"
          options={productsOptions}
          placeholder={t('placeholders.all')}
          handleChange={handleUpdateProducts}
        />
      </FormItemWrapper>

      <DeleteButtonWrapper>
        <DeleteButton disabled={!handleDeleteForm} onClick={handleDeleteForm} />
      </DeleteButtonWrapper>
    </Root>
  );
});

TutorialEditGroupItemForm.displayName = 'TutorialEditGroupItemForm';
export { TutorialEditGroupItemForm };
