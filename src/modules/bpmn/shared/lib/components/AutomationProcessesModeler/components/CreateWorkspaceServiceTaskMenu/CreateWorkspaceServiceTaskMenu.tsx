import { SpanWithEllipsis, type EntityTypeActionType } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import type ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type Create from 'diagram-js/lib/features/create/Create';
import type { DragEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetWorkspaceServiceTaskOptions } from '../../../../hooks';
import {
  BpmnJsType,
  TOGGLE_CREATE_WORKSPACE_SERVICE_TASK_MENU_EVENT,
  TOGGLE_CREATE_WORKSPACE_START_EVENT_MENU_EVENT,
  type ProcessMinimap,
} from '../../../../models';
import { PaletteSubMenu } from '../PaletteSubMenu/PaletteSubMenu';
import { PaletteSubMenuIcon } from '../PaletteSubMenuIcon/PaletteSubMenuIcon';
import { PaletteSubMenuItem } from '../PaletteSubMenuItem/PaletteSubMenuItem';

interface Props {
  modeler: BpmnModeler;
  isListEntityType: boolean;
}

const CreateWorkspaceServiceTaskMenu = (props: Props) => {
  const { modeler, isListEntityType } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.create_workspace_service_task_menu',
  });

  const [isCreateWorkspaceServiceTaskMenuOpened, { close, toggle }] = useDisclosure(false);

  useEffect(() => {
    const eventBus = modeler.get<EventBus>('eventBus');
    const minimap = modeler.get<ProcessMinimap>('minimap');

    if (minimap.isOpen()) minimap.toggle();

    // Can not open two menus at a time
    eventBus.on(TOGGLE_CREATE_WORKSPACE_START_EVENT_MENU_EVENT, close);

    eventBus.on(TOGGLE_CREATE_WORKSPACE_SERVICE_TASK_MENU_EVENT, toggle);
  }, [modeler, toggle, close]);

  useLayoutEffect(() => {
    const paletteElement = document.querySelector('.entry.bpmn-icon-service-task.workspace');

    if (!paletteElement) return;

    paletteElement.classList.toggle('active', isCreateWorkspaceServiceTaskMenuOpened);
  }, [isCreateWorkspaceServiceTaskMenuOpened, t]);

  const { options, getServiceTaskNameByEntityTypeActionType } =
    useGetWorkspaceServiceTaskOptions(isListEntityType);

  const getCreateWorkspaceServiceTaskHandler = useCallback(
    (actionType: EntityTypeActionType) => (e: DragEvent | MouseEvent) => {
      e.preventDefault();

      close();

      const bpmnFactory = modeler.get<BpmnFactory>('bpmnFactory');
      const elementFactory = modeler.get<ElementFactory>('elementFactory');
      const create = modeler.get<Create>('create');

      const businessObject = bpmnFactory.create(BpmnJsType.SERVICE_TASK);

      businessObject.isWorkspaceServiceTask = true;
      businessObject.entityTypeActionType = actionType;
      businessObject.name = getServiceTaskNameByEntityTypeActionType(
        businessObject.entityTypeActionType
      );

      const shape = elementFactory.createShape({
        businessObject,
        type: BpmnJsType.SERVICE_TASK,
      });

      create.start(e, shape);
    },
    [modeler, close, getServiceTaskNameByEntityTypeActionType]
  );

  return (
    <PaletteSubMenu
      title={t('workspace_service_tasks')}
      opened={isCreateWorkspaceServiceTaskMenuOpened}
      Icon={<PaletteSubMenuIcon className="bpmn-icon-service-task" />}
      onClose={close}
    >
      {options.map(o => (
        <PaletteSubMenuItem
          key={o.value}
          draggable
          onClick={getCreateWorkspaceServiceTaskHandler(o.value)}
          onDragStart={getCreateWorkspaceServiceTaskHandler(o.value)}
        >
          <PaletteSubMenuIcon className="bpmn-icon-service-task" $color={o.extra?.color} />

          <SpanWithEllipsis text={o.label} />
        </PaletteSubMenuItem>
      ))}
    </PaletteSubMenu>
  );
};

CreateWorkspaceServiceTaskMenu.displayName = 'CreateWorkspaceServiceTaskMenu';
export { CreateWorkspaceServiceTaskMenu };
