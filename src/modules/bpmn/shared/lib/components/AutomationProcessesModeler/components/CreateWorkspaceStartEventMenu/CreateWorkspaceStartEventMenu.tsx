import { generalSettingsStore } from '@/app';
import { SpanWithEllipsis, type EntityTypeTrigger } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import type ElementFactory from 'diagram-js/lib/core/ElementFactory';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type Create from 'diagram-js/lib/features/create/Create';
import { observer } from 'mobx-react-lite';
import type { DragEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetWorkspaceEventOptions } from '../../../../hooks';
import {
  BpmnJsType,
  TOGGLE_CREATE_WORKSPACE_SERVICE_TASK_MENU_EVENT,
  TOGGLE_CREATE_WORKSPACE_START_EVENT_MENU_EVENT,
  type ProcessMinimap,
} from '../../../../models';
import { EventMessageNameUtil } from '../../../../utils';
import { PaletteSubMenu } from '../PaletteSubMenu/PaletteSubMenu';
import { PaletteSubMenuIcon } from '../PaletteSubMenuIcon/PaletteSubMenuIcon';
import { PaletteSubMenuItem } from '../PaletteSubMenuItem/PaletteSubMenuItem';

interface Props {
  modeler: BpmnModeler;
  entityTypeId: number;
  isListEntityType: boolean;
}

const CreateWorkspaceStartEventMenu = observer((props: Props) => {
  const { modeler, entityTypeId, isListEntityType } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.create_workspace_start_event_menu',
  });

  const { account } = generalSettingsStore;

  const [isCreateWorkspaceEventMenuOpened, { close, toggle }] = useDisclosure(false);

  useEffect(() => {
    const eventBus = modeler.get<EventBus>('eventBus');
    const minimap = modeler.get<ProcessMinimap>('minimap');

    if (minimap.isOpen()) minimap.toggle();

    // Can not open two menus at a time
    eventBus.on(TOGGLE_CREATE_WORKSPACE_SERVICE_TASK_MENU_EVENT, close);

    eventBus.on(TOGGLE_CREATE_WORKSPACE_START_EVENT_MENU_EVENT, toggle);
  }, [modeler, toggle, close]);

  useLayoutEffect(() => {
    const paletteElement = document.querySelector('.entry.bpmn-icon-start-event-message.workspace');

    if (!paletteElement) return;

    paletteElement.classList.toggle('active', isCreateWorkspaceEventMenuOpened);
  }, [isCreateWorkspaceEventMenuOpened, t]);

  const { options, getEventNameByEntityTypeTrigger } =
    useGetWorkspaceEventOptions(isListEntityType);

  const getCreateWorkspaceEventHandler = useCallback(
    (entityTypeTrigger: EntityTypeTrigger) => (e: DragEvent | MouseEvent) => {
      e.preventDefault();

      close();

      if (!account) return;

      const bpmnFactory = modeler.get<BpmnFactory>('bpmnFactory');
      const elementFactory = modeler.get<ElementFactory>('elementFactory');
      const create = modeler.get<Create>('create');

      const businessObject = bpmnFactory.create(BpmnJsType.START_EVENT);

      businessObject.accountId = account.id;
      businessObject.isWorkspaceEvent = true;
      businessObject.entityTypeId = entityTypeId;
      businessObject.entityTypeTrigger = entityTypeTrigger;
      businessObject.name = getEventNameByEntityTypeTrigger(businessObject.entityTypeTrigger);

      const messageEventDefinition = bpmnFactory.create(BpmnJsType.MESSAGE_EVENT_DEFINITION);
      const message = bpmnFactory.create(BpmnJsType.MESSAGE);

      message.name = EventMessageNameUtil.getMessageName({
        entityTypeTrigger,
        accountId: account.id,
        entityTypeId: entityTypeId,
      });
      messageEventDefinition.messageRef = message;
      businessObject.eventDefinitions = [messageEventDefinition];

      const shape = elementFactory.createShape({
        type: BpmnJsType.START_EVENT,
        businessObject: businessObject,
      });

      create.start(e, shape);
    },
    [modeler, entityTypeId, account, close, getEventNameByEntityTypeTrigger]
  );

  return (
    <PaletteSubMenu
      title={t('workspace_events')}
      opened={isCreateWorkspaceEventMenuOpened}
      Icon={<PaletteSubMenuIcon className="bpmn-icon-start-event-message" />}
      onClose={close}
    >
      {options.map(o => (
        <PaletteSubMenuItem
          key={o.value}
          draggable
          onClick={getCreateWorkspaceEventHandler(o.value)}
          onDragStart={getCreateWorkspaceEventHandler(o.value)}
        >
          <PaletteSubMenuIcon className="bpmn-icon-start-event-message" $color={o.extra?.color} />

          <SpanWithEllipsis text={o.label} />
        </PaletteSubMenuItem>
      ))}
    </PaletteSubMenu>
  );
});

CreateWorkspaceStartEventMenu.displayName = 'CreateWorkspaceStartEventMenu';
export { CreateWorkspaceStartEventMenu };
