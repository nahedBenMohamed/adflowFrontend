import { entityTypeStore, iconStore, routes, userStore } from '@/app';
import {
  CardFieldHelperContext,
  DuplicatesContext,
  FieldCompWrapper,
  FieldLabel,
  FieldValueFormGroupRoot,
  SendEmailContext,
  ShowFields,
  useMakeCallContext,
  type CardFieldHelperContextValue,
  type DuplicatesContextValue,
  type Field,
  type FieldSettingsStore,
  type SendEmailContextValue,
} from '@/modules/fields';
import { SendEmailModal } from '@/modules/mailing';
import { findChatWithProviderTransport, type ChatProvider } from '@/modules/multichat';
import { EntitySearchFilter, type EntityForm } from '@/modules/section';
import {
  CardCopiedCountTag,
  DragFieldIcon,
  EntityApiUtil,
  EntityCategory,
  MyDropdown,
  MyDropdownList,
  MyInput,
  PencilButton,
  SectionView,
  ShowMoreButton,
  StagesSelect,
  TruncateMixin,
  UserPicker,
  useSendEmail,
  type Entity,
  type EntityInfo,
  type Nullable,
  type Option,
  type Optional,
  type User,
} from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { ThreeDotsVerticalIcon } from '../../../assets';
import { useGetChatTags } from '../../hooks';
import type { FindChatHandler } from '../../types';
import { MessengerTag } from '../MessengerTag/MessengerTag';
import { CardBlock, SearchEntitiesBlock } from './components';

const CardHeader = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);

  ${TruncateMixin}
`;

const LinkWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 20px 16px;
`;

const ExtraFieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TitleBlock = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const ActionsBlock = styled.div`
  height: 20px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;

  margin-left: auto;
`;

const EntityIconWrapper = styled.div<{ $moduleColor: string }>`
  width: 32px;
  height: 32px;

  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  display: flex;

  svg {
    rect,
    circle,
    ellipse,
    path {
      fill: ${p => p.$moduleColor};
    }
  }
`;

const StyledLink = styled(Link)`
  width: 100%;

  font-size: 14px;
  font-weight: 500;
  color: var(--primary-blue);
  transition: var(--transition-200);

  // to align with the input
  padding-bottom: 1px;

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${TruncateMixin}
`;

const DotsIconWrapper = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
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
      svg path {
        fill: var(--button-text-green-active);
      }
    `}
`;

const TagWrapper = styled.div`
  height: 24px;
  max-width: 40%;
  width: fit-content;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  padding: 0px 6px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--button-text-graphite-secondary-text);

  ${TruncateMixin}
`;

const Tag = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const IconWrapper = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:disabled {
    pointer-events: none;

    opacity: 0.65;
  }
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShowMoreButtonWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  entityForm: EntityForm;
  parentEntityTypeId: number;
  parentEntity: Nullable<Entity>;
  alreadySelectedEntities: number[];
  entityEmailOptions: Option<string>[];
  fieldSettingsStore: FieldSettingsStore;
  isLast?: boolean;
  currentPageEncodedUrl?: string;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  providers?: ChatProvider[];
  setAlreadySelectedEntities: (alreadySelectedEntities: number[]) => void;
  unpinEntity: () => void;
  replaceEntity: ({
    replaceEntityId,
    newEntity,
  }: {
    replaceEntityId: number;
    newEntity: Entity;
  }) => Promise<void>;
  reloadFeed: () => void;
  handleInvalidateParentEntityInCache: () => void;
}

const MiniCard = observer((props: Props) => {
  const {
    entityForm,
    parentEntity,
    parentEntityTypeId,
    alreadySelectedEntities,
    entityEmailOptions,
    fieldSettingsStore,
    isLast,
    currentPageEncodedUrl,
    dragHandleProps,
    providers,
    setAlreadySelectedEntities,
    unpinEntity,
    replaceEntity,
    reloadFeed,
    handleInvalidateParentEntityInCache,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.mini_card',
  });

  const cardBlockRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const entity = entityForm.originalEntity;

  const et = entityTypeStore.getById(entity.entityTypeId);
  const isListView = et.section.view === SectionView.LIST;

  const { section } = et;

  const title = entityForm.name;

  const disabled = useMemo<boolean>(() => !entity.userRights.canEdit, [entity.userRights.canEdit]);

  const { emailModalData, isSendEmailModalOpened, openSendEmailModal, hideSendEmailModal } =
    useSendEmail();

  const telephonyContextValue = useMakeCallContext();

  const sendEmailTo = useMemo<string[]>(() => [emailModalData.email ?? ''], [emailModalData.email]);

  const sendEmailContextValue = useMemo<SendEmailContextValue>(
    () => ({ openSendEmailModal }),
    [openSendEmailModal]
  );

  const [isEditTitleMode, { toggle: toggleEditTitleMode, close: hideEditMode }] =
    useDisclosure(false);
  const [actionsDropdownOpened, { close: hideActionsDropdown, open: showActionsDropdown }] =
    useDisclosure(false);

  const onSelectEntity = useCallback(
    async (selectedEntityId: number): Promise<void> => {
      const newEntity = await EntityApiUtil.getById(selectedEntityId);

      await replaceEntity({ replaceEntityId: entity.id, newEntity });

      setAlreadySelectedEntities([...alreadySelectedEntities, selectedEntityId]);

      entity.isNew = false;
    },
    [alreadySelectedEntities, entity, setAlreadySelectedEntities, replaceEntity]
  );

  const onSearchEntities = useCallback(
    async (title: string): Promise<EntityInfo[]> => {
      const dto = new EntitySearchFilter({ entityTypeId: et.id, name: title });

      const result = await EntityApiUtil.searchEntities(dto);

      return result.entities;
    },
    [et.id]
  );

  const parentEntityIcon = useMemo<ReactNode>(
    () => iconStore.getByName(entityTypeStore.getById(parentEntityTypeId).section.icon).icon,
    [parentEntityTypeId]
  );

  const parentEntityColor = useMemo<string>(
    () =>
      iconStore.getEntityColorByEntityCategory(
        entityTypeStore.getById(parentEntityTypeId).entityCategory
      ),
    [parentEntityTypeId]
  );

  useOnClickOutside(titleInputRef as RefObject<HTMLInputElement>, e => {
    const target = e.target as HTMLElement;

    if (target.closest('.workspace__PencilButton--Root')) return;

    if (title.validate()) hideEditMode();
  });

  useLayoutEffect(() => {
    if (!cardBlockRef.current || !isLast) return;

    if (entity.isNew) cardBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  useEffect(() => {
    if (!entity || entity.id < 0 || !telephonyContextValue) return;

    const { setEntity: setEntityContext } = telephonyContextValue;

    const { entityCategory } = entityTypeStore.getById(entity.entityTypeId);

    if ([EntityCategory.CONTACT, EntityCategory.COMPANY].includes(entityCategory))
      setEntityContext(entity);
  }, [entity, telephonyContextValue]);

  const editTitleButtonClick = useCallback(() => {
    if (title.validate()) toggleEditTitleMode();
  }, [title, toggleEditTitleMode]);

  const handleFindChat = useCallback<FindChatHandler>(
    transport =>
      findChatWithProviderTransport({
        providers,
        transport,
        chats: entity.chats,
      }),
    [entity.chats, providers]
  );

  const chatTags = useGetChatTags(handleFindChat);

  const getTitle = useCallback((): ReactNode => {
    const placeholder = t('enter_name', { name: et.name.toLowerCase() });

    if (isEditTitleMode || entity.isNew) {
      if (entity.isNew)
        return (
          <SearchEntitiesBlock
            withinPortal
            title={title}
            inputVariant="primary"
            placeholder={placeholder}
            alreadySelectedEntities={alreadySelectedEntities}
            onSelectEntity={onSelectEntity}
            handleSearchEntities={onSearchEntities}
          />
        );

      return (
        <MyInput
          ref={titleInputRef}
          autoFocus
          alwaysActive
          model={title}
          placeholder={placeholder}
        />
      );
    }

    const { id: entityId, copiedCount, copiedFrom } = entity;

    return (
      <LinkWrapper>
        <StyledLink
          title={title.value}
          to={routes.card({ entityTypeId: et.id, entityId, from: currentPageEncodedUrl })}
        >
          {title.value}
        </StyledLink>

        <Tooltip.Group>
          {chatTags.map(
            ({ chat, transport }) =>
              chat && (
                <MessengerTag
                  key={chat.id}
                  chatId={chat.id}
                  providerId={chat.providerId}
                  providerTransport={transport}
                />
              )
          )}
        </Tooltip.Group>

        {copiedCount && copiedFrom && (
          <CardCopiedCountTag
            entityTypeId={et.id}
            copiedFrom={copiedFrom}
            copiedCount={copiedCount}
            from={currentPageEncodedUrl}
          />
        )}
      </LinkWrapper>
    );
  }, [
    et.id,
    title,
    entity,
    et.name,
    chatTags,
    isEditTitleMode,
    currentPageEncodedUrl,
    alreadySelectedEntities,
    onSelectEntity,
    onSearchEntities,
    t,
  ]);

  const entityTypeIcon = useMemo<ReactNode>(
    () => iconStore.getByName(section.icon).icon,
    [section.icon]
  );
  const moduleColor = iconStore.getEntityColorByEntityCategory(et.entityCategory);

  const handleSendEmail = useCallback(
    (result: boolean) => {
      hideSendEmailModal();

      if (result) reloadFeed();
    },
    [hideSendEmailModal, reloadFeed]
  );

  const handleUnpinLinkedEntity = useCallback(() => {
    setAlreadySelectedEntities(alreadySelectedEntities.filter(id => id !== entityForm.id));

    unpinEntity();
  }, [alreadySelectedEntities, entityForm.id, setAlreadySelectedEntities, unpinEntity]);

  const handleSelectResponsible = useCallback(
    (user: User) => {
      entityForm.responsibleUserId.setValue(user.id);
    },
    [entityForm.responsibleUserId]
  );

  const handleSelectDropdownOption = useCallback(
    (option: Option<Function>) => {
      option.value();

      hideActionsDropdown();
    },
    [hideActionsDropdown]
  );

  const settingsOptions = useMemo<Option<Function>[]>(
    () => [
      {
        label: t('unpin'),
        value: handleUnpinLinkedEntity,
      },
    ],
    [handleUnpinLinkedEntity, t]
  );

  const duplicatesContextValue = useMemo<DuplicatesContextValue>(
    () => ({
      searchDuplicates: Boolean(entity.isNew),
      entityTypeId: entityForm.originalEntity.entityTypeId,
      excludeEntitiesIds: [entityForm.id, ...alreadySelectedEntities],
      changeEntityCb: onSelectEntity,
    }),
    [
      entity.isNew,
      entityForm.id,
      alreadySelectedEntities,
      entityForm.originalEntity.entityTypeId,
      onSelectEntity,
    ]
  );

  const fieldHelperContextValue = useMemo<CardFieldHelperContextValue>(
    () => ({
      providers,
      isListView,
      entityId: entityForm.id,
      stageId: entityForm.stageId.value,
      entityName: entityForm.originalEntity.name,
      reloadFeed,
      invalidateEntityInCache: handleInvalidateParentEntityInCache,
    }),
    [
      providers,
      isListView,
      entityForm.id,
      entityForm.stageId.value,
      entityForm.originalEntity.name,
      reloadFeed,
      handleInvalidateParentEntityInCache,
    ]
  );

  const displayFields = useMemo<Field[]>(() => {
    // To properly display fine-tuned project fields, which can be hidden
    return et.displayFields.filter(f =>
      entityForm.activeFieldCodes
        ? f.code && f.isProjectField
          ? entityForm.activeFieldCodes.includes(f.code)
          : true
        : true
    );
  }, [et.displayFields, entityForm.activeFieldCodes]);

  const canShowMoreFields = displayFields.length > 3;

  const extraFieldPadding = useMemo<Optional<string>>(
    () =>
      // is list view fields can neither be mandatory nor important (because we have no stages in this view)
      // so that they won't have reserved left offset for indicator icon, that's why we don't need to
      // adjust this system field
      isListView ? undefined : '0 0 0 22px',
    [isListView]
  );

  return (
    <CardBlock ref={cardBlockRef}>
      <CardHeader>
        <TitleBlock>
          {dragHandleProps && (
            <IconWrapper {...dragHandleProps} disabled={disabled}>
              <DragFieldIcon />
            </IconWrapper>
          )}

          <EntityIconWrapper $moduleColor={moduleColor}>{entityTypeIcon}</EntityIconWrapper>

          {getTitle()}
        </TitleBlock>

        {!entity.isNew && (
          <TagWrapper>
            <Tag title={et.name}>{et.name}</Tag>
          </TagWrapper>
        )}

        {!disabled && (
          <ActionsBlock>
            <PencilButton active={isEditTitleMode} onClick={editTitleButtonClick} />

            <MyDropdown
              withinPortal
              position="bottom-start"
              opened={actionsDropdownOpened}
              Button={
                <DotsIconWrapper $active={actionsDropdownOpened}>
                  <ThreeDotsVerticalIcon />
                </DotsIconWrapper>
              }
              hide={hideActionsDropdown}
              show={showActionsDropdown}
            >
              <MyDropdownList
                minWidth="80px"
                options={settingsOptions}
                onSelect={handleSelectDropdownOption}
              />
            </MyDropdown>
          </ActionsBlock>
        )}
      </CardHeader>

      <CardBody>
        <ExtraFieldsWrapper>
          <FieldValueFormGroupRoot>
            <FieldLabel>{t('owner')}</FieldLabel>

            <FieldCompWrapper $padding={extraFieldPadding}>
              <UserPicker
                withinPortal
                noActiveShadow
                disabled={disabled}
                users={userStore.activeUsers}
                selectedId={entityForm.responsibleUserId.value as Optional<number>}
                onSelect={handleSelectResponsible}
              />
            </FieldCompWrapper>
          </FieldValueFormGroupRoot>

          {et.section.view === SectionView.BOARD && (
            <FieldValueFormGroupRoot>
              <FieldLabel>{t('stage')}</FieldLabel>

              <FieldCompWrapper $padding={extraFieldPadding}>
                <StagesSelect
                  withinPortal
                  disabled={disabled}
                  titleWidth="fit-content"
                  model={entityForm.stageId}
                  variant="outlined-without-active-shadow"
                  entityTypeId={entityForm.originalEntity.entityTypeId}
                />
              </FieldCompWrapper>
            </FieldValueFormGroupRoot>
          )}
        </ExtraFieldsWrapper>

        <SendEmailContext.Provider value={sendEmailContextValue}>
          <DuplicatesContext.Provider value={duplicatesContextValue}>
            <CardFieldHelperContext.Provider value={fieldHelperContextValue}>
              <FieldsWrapper>
                <ShowFields
                  disabled={disabled}
                  fieldSettingsStore={fieldSettingsStore}
                  fieldValuesStore={entityForm.fieldValuesStore}
                  fields={entityForm.areAllFieldsShown ? displayFields : displayFields.slice(0, 3)}
                />

                {canShowMoreFields && (
                  <ShowMoreButtonWrapper>
                    <ShowMoreButton
                      active={entityForm.areAllFieldsShown}
                      onClick={entityForm.toggleAreAllFieldsShown}
                    />
                  </ShowMoreButtonWrapper>
                )}
              </FieldsWrapper>
            </CardFieldHelperContext.Provider>
          </DuplicatesContext.Provider>
        </SendEmailContext.Provider>
      </CardBody>

      {parentEntity && isSendEmailModalOpened && (
        <SendEmailModal
          to={sendEmailTo}
          entityId={entity.id}
          entityIcon={parentEntityIcon}
          entityName={parentEntity.name}
          isOpened={isSendEmailModalOpened}
          entityIconColor={parentEntityColor}
          entityEmailOptions={entityEmailOptions}
          onClose={handleSendEmail}
        />
      )}
    </CardBlock>
  );
});

MiniCard.displayName = 'MiniCard';
export { MiniCard };
