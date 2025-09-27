import { entityTypeStore, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { AddLinkedEntityBlock } from '@/modules/card';
import {
  CardFieldHelperContext,
  type CardFieldHelperContextValue,
  type Field,
  type FieldSettingsStore,
  ShowFields,
} from '@/modules/fields';
import { useGetChatProviders } from '@/modules/multichat';
import type { EntityForm } from '@/modules/section';
import {
  AvatarCircle,
  Entity,
  type Nullable,
  PermissionObjectType,
  SectionView,
  ShowMoreButton,
  StagesSelect,
  type User,
  UserPicker,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { type CSSProperties, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { AppointmentBlock } from '../AppointmentBlock/AppointmentBlock';
import { AppointmentEntityBlockHeader } from '../AppointmentEntityBlockHeader/AppointmentEntityBlockHeader';

const FieldsWrapper = styled.div<{ $loading: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${p =>
    p.$loading &&
    css`
      cursor: wait;

      opacity: 0.8;

      * {
        pointer-events: none;
      }
    `}
`;

const ShowMoreButtonWrapper = styled.div`
  margin: 0 auto;
`;

const FieldWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const FieldLabel = styled.span`
  min-width: 182px;

  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);

  padding-top: 6px;
`;

const FieldContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResponsibleUserName = styled.span`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--graphite-graphite-840);
`;

interface Props {
  editMode: boolean;
  entityTypeId: number;
  entityForm: Nullable<EntityForm>;
  fieldSettingsStore: Nullable<FieldSettingsStore>;
  responsibleUserId?: number;
  addEntityForm: (entity: Entity) => Promise<void>;
}

const AppointmentEntityBlock = observer((props: Props) => {
  const {
    editMode,
    entityTypeId,
    entityForm,
    fieldSettingsStore,
    responsibleUserId,
    addEntityForm,
  } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const { data: providers, isLoading: areChatProvidersLoading } = useGetChatProviders();

  const entityType = entityTypeStore.getById(entityTypeId);
  const responsibleUser = responsibleUserId ? userStore.getById(responsibleUserId) : null;

  const [addingLinkedEntity, setAddingLinkedEntity] = useState(false);

  const handleAddEntity = useCallback(async (): Promise<void> => {
    if (addingLinkedEntity) return;

    if (!authStore.user || !entityType)
      throw new Error(
        `Failed to add linked entity: user is not authorized or entity type is not defined`
      );

    const entity = Entity.createEmpty({
      name: '',
      userId: authStore.user.id,
      entityTypeId: entityType.id,
      entityId: -1,
    });

    try {
      setAddingLinkedEntity(true);

      await addEntityForm(entity);
    } finally {
      setAddingLinkedEntity(false);
    }
  }, [entityType, addingLinkedEntity, addEntityForm]);

  const canCreate = entityType
    ? Boolean(authStore.user?.canCreate(PermissionObjectType.ENTITY_TYPE, entityType.id))
    : false;

  const isBoard = entityType.section.view === SectionView.BOARD;

  const getCardFieldHelperContextValue = useCallback<
    (entityForm: EntityForm) => CardFieldHelperContextValue
  >(
    entityForm => ({
      providers,
      entityId: entityForm.id,
      stageId: entityForm.originalEntity.stageId,
      entityName: entityForm.originalEntity.name,
    }),
    [providers]
  );

  const handleSelectResponsible = useCallback(
    (user: User) => entityForm?.responsibleUserId.setValue(user.id),
    [entityForm?.responsibleUserId]
  );

  const commonStyles = useMemo<CSSProperties>(
    () => ({
      flex: editMode ? 0.5 : undefined,
      height: editMode ? 'fit-content' : undefined,
    }),
    [editMode]
  );

  const displayFields = useMemo<Field[]>(() => {
    // To properly display fine-tuned project fields, which can be hidden
    return entityType.displayFields.filter(f =>
      entityForm?.activeFieldCodes
        ? f.code && f.isProjectField
          ? entityForm.activeFieldCodes.includes(f.code)
          : true
        : true
    );
  }, [entityType.displayFields, entityForm?.activeFieldCodes]);

  const canShowMoreFields = displayFields.length > 3;

  return entityForm ? (
    <AppointmentBlock
      styles={commonStyles}
      disabled={!entityForm.originalEntity.userRights.canEdit}
      headerTitle={
        <AppointmentEntityBlockHeader
          et={entityType}
          entityForm={entityForm}
          addEntityForm={addEntityForm}
        />
      }
    >
      <FieldsWrapper $loading={areChatProvidersLoading}>
        <FieldWrapper>
          <FieldLabel>{t('responsible')}</FieldLabel>

          {responsibleUser && !editMode ? (
            <FieldContentWrapper>
              <AvatarCircle size="large" avatar={responsibleUser.getAvatar()} />

              <ResponsibleUserName>{responsibleUser.fullName}</ResponsibleUserName>
            </FieldContentWrapper>
          ) : (
            <FieldContentWrapper>
              <UserPicker
                withinPortal
                noActiveShadow
                variant="outlined"
                users={userStore.activeUsers}
                selectedId={entityForm.responsibleUserId.value}
                onSelect={handleSelectResponsible}
              />
            </FieldContentWrapper>
          )}
        </FieldWrapper>

        {isBoard && (
          <FieldWrapper>
            <FieldLabel>{t('stage')}</FieldLabel>

            <FieldContentWrapper>
              <StagesSelect
                withinPortal
                titleWidth="fit-content"
                model={entityForm.stageId}
                variant="outlined-without-active-shadow"
                entityTypeId={entityForm.originalEntity.entityTypeId}
              />
            </FieldContentWrapper>
          </FieldWrapper>
        )}

        <CardFieldHelperContext.Provider value={getCardFieldHelperContextValue(entityForm)}>
          <ShowFields
            // to make sure we rerender component when entityForm is changed
            // (in case of selection)
            key={entityForm.id}
            mobileColumn
            hideEmailAction
            fieldValuesStore={entityForm.fieldValuesStore}
            fieldSettingsStore={fieldSettingsStore ?? undefined}
            fields={entityForm.areAllFieldsShown ? displayFields : displayFields.slice(0, 4)}
          />
        </CardFieldHelperContext.Provider>

        {canShowMoreFields && (
          <ShowMoreButtonWrapper>
            <ShowMoreButton
              active={entityForm.areAllFieldsShown}
              onClick={entityForm.toggleAreAllFieldsShown}
            />
          </ShowMoreButtonWrapper>
        )}
      </FieldsWrapper>
    </AppointmentBlock>
  ) : (
    canCreate && (
      <AddLinkedEntityBlock
        outlined
        et={entityType}
        styles={commonStyles}
        addingLinkedEntity={addingLinkedEntity}
        handleAddEntity={handleAddEntity}
      />
    )
  );
});

AppointmentEntityBlock.displayName = 'AppointmentEntityBlock';
export { AppointmentEntityBlock };
