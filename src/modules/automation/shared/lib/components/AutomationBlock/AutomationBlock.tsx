import { EntityTypeActionType, type Nullable, type Option, truncateNumber } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { type ReactNode, type RefObject, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import type { AutomationStore } from '../../../../store';
import { type AutomationEntityType, type AutomationModalBaseProps } from '../../models';
import { Block } from '../Block/Block';
import { AddActivityAutomationModal } from '../Modals/AddActivityAutomationModal/AddActivityAutomationModal';
import { AddTaskAutomationModal } from '../Modals/AddTaskAutomationModal/AddTaskAutomationModal';
import { ChangeLinkedStageAutomationModal } from '../Modals/ChangeLinkedStageAutomationModal/ChangeLinkedStageAutomationModal';
import { ChangeResponsibleAutomationModal } from '../Modals/ChangeResponsibleAutomationModal/ChangeResponsibleAutomationModal';
import { ChangeStageAutomationModal } from '../Modals/ChangeStageAutomationModal/ChangeStageAutomationModal';
import { CreateEntityAutomationModal } from '../Modals/CreateEntityAutomationModal/CreateEntityAutomationModal';
import { RequestHttpAutomationModal } from '../Modals/RequestHttpAutomationModal/RequestHttpAutomationModal';
import { SendEmailAutomationModal } from '../Modals/SendEmailAutomationModal/SendEmailAutomationModal';
import { SendExternalChatAutomationModal } from '../Modals/SendExternalChatAutomationModal/SendExternalChatAutomationModal';
import { SendInternalChatAutomationModal } from '../Modals/SendInternalChatAutomationModal/SendInternalChatAutomationModal';
import { AddAutomationButton } from './AddAutomationButton';
import { HeaderDropdown } from './HeaderDropdown';
import { HeaderDropdownList } from './HeaderDropdownList';

const Root = styled(Block)`
  height: 63px;

  display: flex;
  flex-direction: column;
`;

interface CountProps {
  $active: boolean;
  $activeBgColor: string;
}

const Count = styled.div<CountProps>`
  height: 16px;
  min-width: 21px;
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 600;
  line-height: 14px;
  color: var(--primary-statuses-white-0);

  padding: 0 4px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--primary-statuses-white-0);
  transition: var(--transition-200);

  ${p =>
    p.$active &&
    css`
      background-color: var(--primary-statuses-white-0);
      color: ${p.$activeBgColor};
    `}
`;

interface HeaderProps {
  $bgColor: string;
  $hasShadow: boolean;
}

const Header = styled.div<HeaderProps>`
  position: relative;

  width: 100%;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  color: var(--primary-statuses-white-0);

  padding: 6px 8px 4px;
  background-color: ${p => p.$bgColor};
  border-top-left-radius: var(--border-radius-block);
  border-top-right-radius: var(--border-radius-block);
  box-shadow: ${p => (p.$hasShadow ? '0px 0px 2px #eef4fe, 0px 1px 2px #d0daeb' : 'none')};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    ${Count} {
      color: ${p => p.$bgColor};

      background-color: var(--primary-statuses-white-0);
    }
  }
`;

const Content = styled.div`
  margin: auto;
`;

interface Props {
  stageId: Nullable<number>;
  headerColor: string;
  type: EntityTypeActionType;
  automationStore: AutomationStore;
  automations: AutomationEntityType[];
}

const AutomationBlock = (props: Props) => {
  const { stageId, headerColor, type, automationStore, automations } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.block',
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  const [selectedAutomation, setSelectedAutomation] =
    useState<Nullable<AutomationEntityType>>(null);

  const [addActivityModalOpened, { close: hideAddActivityModal, open: showAddActivityModal }] =
    useDisclosure(false);
  const [addTaskModalOpened, { close: hideAddTaskModal, open: showAddTaskModal }] =
    useDisclosure(false);
  const [changeStageModalOpened, { close: hideChangeStageModal, open: showChangeStageModal }] =
    useDisclosure(false);
  const [
    changeLinkedStageModalOpened,
    { close: hideChangeLinkedStageModal, open: showChangeLinkedStageModal },
  ] = useDisclosure(false);
  const [
    changeResponsibleModalOpened,
    { close: hideChangeResponsibleModal, open: showChangeResponsibleModal },
  ] = useDisclosure(false);
  const [sendEmailModalOpened, { close: hideSendEmailModal, open: showSendEmailModal }] =
    useDisclosure(false);
  const [createEntityModalOpened, { close: hideCreateEntityModal, open: showCreateEntityModal }] =
    useDisclosure(false);
  const [
    sendInternalChatModalOpened,
    { close: hideSendInternalChatModal, open: showSendInternalChatModal },
  ] = useDisclosure(false);
  const [
    sendExternalChatModalOpened,
    { close: hideSendExternalChatModal, open: showSendExternalChatModal },
  ] = useDisclosure(false);
  const [requestHttpModalOpened, { close: hideRequestHttpModal, open: showRequestHttpModal }] =
    useDisclosure(false);

  const [dropdownOpened, { toggle: toggleDropdown, close: hideDropdown }] = useDisclosure(false);

  useOnClickOutside(dropdownRef as RefObject<HTMLButtonElement>, e => {
    if (headerRef.current?.contains(e.target as Node)) return;

    hideDropdown();
  });

  const automationOptions = useMemo<Option<number>[]>(
    () =>
      automations.map<Option<number>>(a => ({
        label: a.name,
        value: a.id,
      })),
    [automations]
  );

  const handleOpenModal = useCallback(() => {
    switch (type) {
      case EntityTypeActionType.ACTIVITY_CREATE: {
        showAddActivityModal();

        break;
      }

      case EntityTypeActionType.TASK_CREATE: {
        showAddTaskModal();

        break;
      }

      case EntityTypeActionType.ENTITY_STAGE_CHANGE: {
        showChangeStageModal();

        break;
      }

      case EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE: {
        showChangeLinkedStageModal();

        break;
      }

      case EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE: {
        showChangeResponsibleModal();

        break;
      }

      case EntityTypeActionType.EMAIL_SEND: {
        showSendEmailModal();

        break;
      }

      case EntityTypeActionType.ENTITY_CREATE: {
        showCreateEntityModal();

        break;
      }

      case EntityTypeActionType.CHAT_SEND_AMWORK: {
        showSendInternalChatModal();

        break;
      }

      case EntityTypeActionType.CHAT_SEND_EXTERNAL: {
        showSendExternalChatModal();

        break;
      }

      case EntityTypeActionType.HTTP_CALL: {
        showRequestHttpModal();

        break;
      }
    }
  }, [
    type,
    showAddTaskModal,
    showSendEmailModal,
    showAddActivityModal,
    showChangeStageModal,
    showRequestHttpModal,
    showCreateEntityModal,
    showSendInternalChatModal,
    showSendExternalChatModal,
    showChangeResponsibleModal,
    showChangeLinkedStageModal,
  ]);

  const handleSelectAutomation = useCallback(
    (id: number) => {
      const automation = automations.find(a => a.id === id);

      if (!automation) return;

      hideDropdown();
      setSelectedAutomation(automation);
    },
    [automations, hideDropdown, setSelectedAutomation]
  );

  const handleResetSelectedAutomation = useCallback(() => setSelectedAutomation(null), []);

  const getSelectedAutomationModal = useCallback(
    (selectedAutomation: AutomationEntityType): ReactNode => {
      const commonProps: AutomationModalBaseProps = {
        stageId,
        automationStore,
        automation: selectedAutomation,
        isOpened: Boolean(selectedAutomation),
        onClose: handleResetSelectedAutomation,
      };

      switch (selectedAutomation.firstAction.type) {
        case EntityTypeActionType.ACTIVITY_CREATE:
          return <AddActivityAutomationModal {...commonProps} />;

        case EntityTypeActionType.TASK_CREATE:
          return <AddTaskAutomationModal {...commonProps} />;

        case EntityTypeActionType.ENTITY_STAGE_CHANGE:
          return <ChangeStageAutomationModal {...commonProps} />;

        case EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE:
          return <ChangeLinkedStageAutomationModal {...commonProps} />;

        case EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE:
          return <ChangeResponsibleAutomationModal {...commonProps} />;

        case EntityTypeActionType.EMAIL_SEND:
          return <SendEmailAutomationModal {...commonProps} />;

        case EntityTypeActionType.ENTITY_CREATE:
          return <CreateEntityAutomationModal {...commonProps} />;

        case EntityTypeActionType.CHAT_SEND_AMWORK:
          return <SendInternalChatAutomationModal {...commonProps} />;

        case EntityTypeActionType.CHAT_SEND_EXTERNAL:
          return <SendExternalChatAutomationModal {...commonProps} />;

        case EntityTypeActionType.HTTP_CALL:
          return <RequestHttpAutomationModal {...commonProps} />;
      }
    },
    [stageId, automationStore, handleResetSelectedAutomation]
  );

  return (
    <Root $noShadow={dropdownOpened}>
      {automations.length > 0 && (
        <Header
          ref={headerRef}
          $bgColor={headerColor}
          $hasShadow={dropdownOpened}
          onClick={toggleDropdown}
        >
          {t(type)}

          <Count $active={dropdownOpened} $activeBgColor={headerColor}>
            {truncateNumber({ num: automations.length, precision: 3 })}
          </Count>

          <HeaderDropdown ref={dropdownRef} opened={dropdownOpened}>
            <HeaderDropdownList options={automationOptions} onSelect={handleSelectAutomation} />
          </HeaderDropdown>
        </Header>
      )}

      <Content>
        <AddAutomationButton onClick={handleOpenModal} />
      </Content>

      {selectedAutomation && getSelectedAutomationModal(selectedAutomation)}

      {addActivityModalOpened && (
        <AddActivityAutomationModal
          stageId={stageId}
          isOpened={addActivityModalOpened}
          automationStore={automationStore}
          onClose={hideAddActivityModal}
        />
      )}

      {addTaskModalOpened && (
        <AddTaskAutomationModal
          stageId={stageId}
          isOpened={addTaskModalOpened}
          automationStore={automationStore}
          onClose={hideAddTaskModal}
        />
      )}

      {changeStageModalOpened && (
        <ChangeStageAutomationModal
          stageId={stageId}
          isOpened={changeStageModalOpened}
          automationStore={automationStore}
          onClose={hideChangeStageModal}
        />
      )}

      {changeLinkedStageModalOpened && (
        <ChangeLinkedStageAutomationModal
          stageId={stageId}
          isOpened={changeLinkedStageModalOpened}
          automationStore={automationStore}
          onClose={hideChangeLinkedStageModal}
        />
      )}

      {changeResponsibleModalOpened && (
        <ChangeResponsibleAutomationModal
          stageId={stageId}
          isOpened={changeResponsibleModalOpened}
          automationStore={automationStore}
          onClose={hideChangeResponsibleModal}
        />
      )}

      {sendEmailModalOpened && (
        <SendEmailAutomationModal
          stageId={stageId}
          isOpened={sendEmailModalOpened}
          automationStore={automationStore}
          onClose={hideSendEmailModal}
        />
      )}

      {createEntityModalOpened && (
        <CreateEntityAutomationModal
          stageId={stageId}
          isOpened={createEntityModalOpened}
          automationStore={automationStore}
          onClose={hideCreateEntityModal}
        />
      )}

      {sendInternalChatModalOpened && (
        <SendInternalChatAutomationModal
          stageId={stageId}
          isOpened={sendInternalChatModalOpened}
          automationStore={automationStore}
          onClose={hideSendInternalChatModal}
        />
      )}

      {sendExternalChatModalOpened && (
        <SendExternalChatAutomationModal
          stageId={stageId}
          isOpened={sendExternalChatModalOpened}
          automationStore={automationStore}
          onClose={hideSendExternalChatModal}
        />
      )}

      {requestHttpModalOpened && (
        <RequestHttpAutomationModal
          stageId={stageId}
          isOpened={requestHttpModalOpened}
          automationStore={automationStore}
          onClose={hideRequestHttpModal}
        />
      )}
    </Root>
  );
};

export { AutomationBlock };
