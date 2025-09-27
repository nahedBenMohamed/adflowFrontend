import { authStore } from '@/modules/auth';
import { activityTypeStore, type ActivityType, type CreateActivityTypeDto } from '@/modules/tasks';
import {
  InputModel,
  MyDropdown,
  MyDropdownListRoot,
  MySelectTitle,
  NoOptionsMessage,
  PickerButton,
  PlusIconButton,
  WarningModal,
  useDropdownWidth,
  type Nullable,
  type Option,
  type SelectModel,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RocketIcon } from '../../../../../assets';
import { ActivityTypeItem, AddTypeBlock } from './components';

const DropdownContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

const AddTypeWrapper = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

type ActivityTypeControlView = 'picker' | 'select';

interface Props {
  model: SelectModel;
  activityTypes: ActivityType[];
  hiddenlyDisabled?: boolean;
  view?: ActivityTypeControlView;
  handleSelect?: (activityTypeId: Nullable<number>) => void;
}

const ActivityTypeControl = observer((props: Props) => {
  const { model, activityTypes, hiddenlyDisabled, view = 'picker', handleSelect } = props;

  const { t: t1 } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.common.activity_type_picker',
  });
  const { t: t2 } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const [controlsRef, setControlsRef] = useState<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    controlsRef && autoAnimate(controlsRef);
  }, [controlsRef]);

  const addTypeInputRef = useRef<Nullable<HTMLInputElement>>(null);

  const isAdmin = authStore.isAdmin();

  const [deleteCandidateId, setDeleteCandidateId] = useState<Nullable<number>>(null);

  const [dropdownOpened, { close: hideDropdown, open: showDropdown, toggle: toggleDropdown }] =
    useDisclosure(false);
  const [addTypeInputOpened, { close: hideAddTypeInput, open: showAddTypeInput }] =
    useDisclosure(false);
  const [warningModalOpened, { close: hideWarningModal, open: showWarningModal }] =
    useDisclosure(false);
  const [isDeleting, { close: startDeleting, open: stopDeleting }] = useDisclosure(false);

  const newType = useLocalObservable(() => InputModel.create().required());

  const options = activityTypes.map<Option<number>>(at => ({
    label: at.name,
    value: at.id,
  }));

  const onSelect = useCallback(
    (id: number) => {
      model.setValue(id);
      handleSelect?.(id);

      hideDropdown();
    },
    [handleSelect, hideDropdown, model]
  );

  const getOnSelectHandler = useCallback((id: number) => () => onSelect(id), [onSelect]);

  const handleDropdownHide = useCallback(() => {
    hideDropdown();

    hideAddTypeInput();
  }, [hideAddTypeInput, hideDropdown]);

  const handleShowDeleteWarning = useCallback(
    (id: number) => {
      setDeleteCandidateId(id);

      showWarningModal();
    },
    [showWarningModal]
  );

  const getShowDeleteWarningHandler = useCallback(
    (id: number) => () => handleShowDeleteWarning(id),
    [handleShowDeleteWarning]
  );

  const handleApproveDelete = useCallback(async () => {
    if (!deleteCandidateId) return;

    startDeleting();

    await activityTypeStore.delete(deleteCandidateId);

    const newSelectedId =
      [...activityTypes].find(a => a.id !== deleteCandidateId)?.id ??
      activityTypeStore.firstActivityType?.id ??
      null;

    model.setValue(newSelectedId);
    handleSelect?.(newSelectedId);

    hideWarningModal();
    stopDeleting();
    showDropdown();
  }, [
    activityTypes,
    deleteCandidateId,
    handleSelect,
    hideWarningModal,
    model,
    showDropdown,
    startDeleting,
    stopDeleting,
  ]);

  const handleClose = useCallback(() => {
    hideWarningModal();

    showDropdown();
  }, [hideWarningModal, showDropdown]);

  const handleShowAddTypeInput = useCallback(() => {
    flushSync(() => {
      showAddTypeInput();
    });

    addTypeInputRef.current?.focus();
  }, [showAddTypeInput]);

  const handleAddNewType = useCallback(async (): Promise<void> => {
    if (!newType.validate()) return;

    const createdActivityTypeId = (
      await activityTypeStore.add({
        name: newType.value,
      } as CreateActivityTypeDto)
    ).id;

    newType.value = '';
    addTypeInputRef.current?.focus();

    model.setValue(createdActivityTypeId);
    handleSelect?.(createdActivityTypeId);
  }, [handleSelect, model, newType]);

  const handleCancel = useCallback(() => {
    newType.value = '';

    hideAddTypeInput();
  }, [hideAddTypeInput, newType]);

  const label = model.value
    ? activityTypeStore.getById(model.value).name
    : t1('placeholders.select_activity_type');
  const active = dropdownOpened;

  const [dropdownWidth, titleRef] = useDropdownWidth();

  return (
    <>
      <MyDropdown
        withinPortal
        position="bottom-start"
        opened={dropdownOpened}
        Button={
          view === 'picker' ? (
            <PickerButton
              value={label}
              iconOutlined={false}
              Icon={<RocketIcon />}
              hiddenlyDisabled={hiddenlyDisabled}
              active={active || Boolean(model.value)}
              onClick={toggleDropdown}
            />
          ) : (
            <MySelectTitle
              ref={titleRef}
              variant="outlined"
              active={dropdownOpened}
              invalid={!model.isValid}
              showPlaceholder={!model.value}
              hiddenlyDisabled={hiddenlyDisabled}
            >
              {label}
            </MySelectTitle>
          )
        }
        show={showDropdown}
        hide={handleDropdownHide}
      >
        <DropdownContentWrapper>
          <MyDropdownListRoot
            $maxHeight="304px"
            $noPadding={false}
            $width={view === 'select' ? dropdownWidth : 276}
          >
            {options.length > 0 ? (
              options.map(o => (
                <ActivityTypeItem
                  key={o.value}
                  id={o.value}
                  isActive={o.value === model.value}
                  label={o.label}
                  onDelete={getShowDeleteWarningHandler(o.value)}
                  onSelect={getOnSelectHandler(o.value)}
                />
              ))
            ) : (
              <NoOptionsMessage>{t2('no_options')}</NoOptionsMessage>
            )}
          </MyDropdownListRoot>

          {isAdmin && (
            <AddTypeWrapper ref={setControlsRef}>
              {addTypeInputOpened ? (
                <AddTypeBlock
                  model={newType}
                  ref={addTypeInputRef}
                  loading={activityTypeStore.isAdding}
                  onCancel={handleCancel}
                  onSave={handleAddNewType}
                />
              ) : (
                <PlusIconButton text={t1('add_new_type')} onClick={handleShowAddTypeInput} />
              )}
            </AddTypeWrapper>
          )}
        </DropdownContentWrapper>
      </MyDropdown>

      {warningModalOpened && (
        <WarningModal
          height="fit-content"
          maxHeight="380px"
          width="500px"
          title={t1('warn_title')}
          isOpened={warningModalOpened}
          approveLoading={isDeleting}
          annotation={t1('warn_annotation')}
          onClose={handleClose}
          onApprove={handleApproveDelete}
        />
      )}
    </>
  );
});

ActivityTypeControl.displayName = 'ActivityTypeControl';
export { ActivityTypeControl };
