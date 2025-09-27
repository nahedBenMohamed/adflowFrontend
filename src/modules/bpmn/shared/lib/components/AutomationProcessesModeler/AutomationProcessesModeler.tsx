import { entityTypeStore, generalSettingsStore } from '@/app';
import {
  ErrorCode,
  type Nullable,
  type Optional,
  SectionView,
  type ServiceError,
  WholePageLoaderWithLogo,
} from '@/shared';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import type { AxiosError } from 'axios';
import ColorPickerModule from 'bpmn-js-color-picker';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type { CommandStack, EventBus } from 'bpmn-js/lib/features/modeling/Modeling';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { type Element, getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import GridModule from 'diagram-js-grid';
import MinimapModule from 'diagram-js-minimap';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import type EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import zeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';
import {
  UpdateAutomationProcessDto,
  useGetAutomationsProcess,
  useUpdateAutomationProcess,
} from '../../../../api';
import WorkspaceModule from '../../../../extension';
import workspaceModdle from '../../../../resources/workspace.json';
import { checkIfCanAddConditionToFlow } from '../../helpers';
import {
  useGetWorkspaceServiceTaskOptions,
  useHandleTranslateModelerElementsTitles,
} from '../../hooks';
import { BpmnJsType, type EventBusEvent } from '../../models';
import { AutomationProcessSchemaErrorWarning } from '../AutomationProcessSchemaErrorWarning/AutomationProcessSchemaErrorWarning';
import {
  CenterDiagramViewButton,
  CreateWorkspaceServiceTaskMenu,
  CreateWorkspaceStartEventMenu,
  ProcessControls,
  WorkspaceDelayEventPopup,
  WorkspaceSequenceFlowPopup,
  WorkspaceServiceTaskPopupSwitch,
  WorkspaceStartEventPopup,
} from './components';

const Root = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
`;

const ModelerBlock = styled.article`
  width: 100%;
  height: 100%;
`;

const HIGHEST_EVENT_PRIORITY = 1500;

interface Props {
  backLink: string;
  entityTypeId: number;
  selectedAutomationProcessId: number;
}

const AutomationProcessesModeler = observer((props: Props) => {
  const { backLink, entityTypeId, selectedAutomationProcessId } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_automations_processes_modeler',
  });

  const modelerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { account } = generalSettingsStore;

  const { data: automationProcess, isLoading: isAutomationProcessLoading } =
    useGetAutomationsProcess(selectedAutomationProcessId);

  const { mutateAsync: updateAutomationProcess, isPending: isAutomationProcessUpdating } =
    useUpdateAutomationProcess(selectedAutomationProcessId);

  const [selectedWorkspaceStartEventId, setSelectedWorkspaceStartEventId] =
    useState<Nullable<string>>(null);
  const [selectedWorkspaceSequenceFlowId, setSelectedWorkspaceSequenceFlowId] =
    useState<Nullable<string>>(null);
  const [selectedWorkspaceDelayEventId, setSelectedWorkspaceDelayEventId] =
    useState<Nullable<string>>(null);
  const [selectedWorkspaceServiceTaskId, setSelectedWorkspaceServiceTaskId] =
    useState<Nullable<string>>(null);

  const selectedWorkspaceElementId =
    selectedWorkspaceStartEventId ||
    selectedWorkspaceSequenceFlowId ||
    selectedWorkspaceDelayEventId ||
    selectedWorkspaceServiceTaskId;

  const [modeler, setModeler] = useState<Nullable<BpmnModeler>>(null);

  const isListEntityType = useMemo<boolean>(() => {
    const et = entityTypeStore.getById(entityTypeId);

    if (!et) return false;

    return et.section.view === SectionView.LIST;
  }, [entityTypeId]);

  const { getServiceTaskNameByEntityTypeActionType } =
    useGetWorkspaceServiceTaskOptions(isListEntityType);

  useLayoutEffect(() => {
    if (!modelerRef.current || !automationProcess) return;

    const modelerInstance = new BpmnModeler({
      container: modelerRef.current,
      moddleExtensions: {
        zeebe: zeebeModdle,
        workspace: workspaceModdle,
      },
      // WorkspaceModule should be LAST in array!
      additionalModules: [MinimapModule, ColorPickerModule, GridModule, WorkspaceModule],
    });

    const initializeModeler = async (): Promise<void> => {
      const modelerCanvas = modelerInstance.get<Canvas>('canvas');

      if (automationProcess.bpmnFile) {
        await modelerInstance.importXML(automationProcess.bpmnFile);

        modelerCanvas.zoom('fit-viewport');
      } else {
        await modelerInstance.createDiagram();
      }

      if (modelerCanvas) modelerCanvas.zoom('fit-viewport');

      modelerInstance.on('element.click', HIGHEST_EVENT_PRIORITY, (e: EventBusEvent) => {
        const element = e.element;
        const businessObject = getBusinessObject(element);

        // We can only customize workspace start events
        if (is(businessObject, BpmnJsType.START_EVENT) && businessObject.isWorkspaceEvent) {
          setSelectedWorkspaceStartEventId(element.id);
        } else {
          setSelectedWorkspaceStartEventId(null);
        }

        // We can add custom conditions only to outgoing flows from Gateways which are not default
        if (is(businessObject, BpmnJsType.SEQUENCE_FLOW) && checkIfCanAddConditionToFlow(element)) {
          setSelectedWorkspaceSequenceFlowId(element.id);
        } else {
          setSelectedWorkspaceSequenceFlowId(null);
        }

        if (
          is(businessObject, BpmnJsType.INTERMEDIATE_CATCH_EVENT) &&
          element.businessObject.isWorkspaceDelay
        ) {
          setSelectedWorkspaceDelayEventId(element.id);
        } else {
          setSelectedWorkspaceDelayEventId(null);
        }

        if (
          is(businessObject, BpmnJsType.SERVICE_TASK) &&
          element.businessObject.isWorkspaceServiceTask
        ) {
          setSelectedWorkspaceServiceTaskId(element.id);
        } else {
          setSelectedWorkspaceServiceTaskId(null);
        }
      });

      const modeling = modelerInstance.get<Modeling>('modeling');
      const eventBus = modelerInstance.get<EventBus>('eventBus');
      const elementRegistry = modelerInstance.get<ElementRegistry>('elementRegistry');

      const handleUpdateProcessId = () => {
        const rootProcessElement = elementRegistry.filter(e =>
          is(e, BpmnJsType.PROCESS)
        )[0] as Optional<Element>;

        if (!rootProcessElement || !account) return;

        modeling.updateProperties(rootProcessElement, {
          id: `Process_${account.id}_${selectedAutomationProcessId}`,
        });
      };

      handleUpdateProcessId();

      modelerInstance.on('shape.added', function (e: EventBusEvent) {
        const element = e.element;
        const businessObject = getBusinessObject(element);

        if (is(businessObject, BpmnJsType.SERVICE_TASK)) {
          const { isWorkspaceServiceTask, entityTypeActionType } = businessObject;

          // We need to manually set names for workspace service tasks which are created from context pad (without name) so that they could be properly translated, elements created from CreateWorkspaceServiceTaskMenu already have names

          // To avoid:
          // "The error "illegal invocation in <execute> or <revert> phase" typically occurs when you're trying to modify a BPMN diagram element during its creation event..."
          setTimeout(() => {
            if (isWorkspaceServiceTask && entityTypeActionType && !businessObject.name)
              modeling.updateProperties(element, {
                name: getServiceTaskNameByEntityTypeActionType(entityTypeActionType),
              });
          });
        }
      });

      // Add "Add Conditions..." name to newly added sequence flows to which user can add conditions
      eventBus.on('connection.added', (e: EventBusEvent) => {
        const element = e.element;
        const businessObject = getBusinessObject(element);

        // So that class is set by custom rendering extension (if other conditions are met there)
        setTimeout(() => {
          const domElement = document.querySelector(`[data-element-id="${element.id}"]`);

          if (domElement) {
            const childNodes = Array.from(domElement.childNodes);

            childNodes.forEach(n => {
              if (
                n instanceof SVGElement &&
                n.classList.contains(
                  'workspace__WorkspaceRenderer--SequenceFlow__PossibleCondition'
                ) &&
                !businessObject.name
              )
                modeling.updateProperties(element, {
                  name: t('add_conditions'),
                });
            });
          }
        });
      });

      setModeler(modelerInstance);
    };

    initializeModeler();

    return () => modelerInstance.destroy();
  }, [
    account,
    automationProcess,
    selectedAutomationProcessId,
    getServiceTaskNameByEntityTypeActionType,
    t,
  ]);

  useHandleTranslateModelerElementsTitles(modeler);

  useWindowEvent('keydown', e => {
    // Handle undo (Cmd + Z / Ctrl + Z)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && modeler) {
      const commandStack = modeler.get<CommandStack>('commandStack');

      e.preventDefault();

      commandStack.undo();
    }

    // Handle redo (Cmd + Shift + Z / Ctrl + Shift + Z)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z' && modeler) {
      const commandStack = modeler.get<CommandStack>('commandStack');

      e.preventDefault();

      commandStack.redo();
    }

    // Handle element or elements selection delete (Backspace)
    if (!selectedWorkspaceElementId && e.key === 'Backspace' && modeler) {
      const editorActions = modeler.get<EditorActions>('editorActions');

      editorActions.trigger('removeSelection', {});
    }
  });

  const [isProcessWarningOpened, { open: showProcessWarning, close: hideProcessWarning }] =
    useDisclosure(false);

  const handleProcessSchemaError = useCallback(
    (e: unknown) => {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.AUTOMATION_PROCESS_ERROR) showProcessWarning();
    },
    [showProcessWarning]
  );

  const handleCancel = useCallback(() => navigate(backLink), [backLink, navigate]);

  const getSaveDraftHandler = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      async (): Promise<void> => {
        if (!modeler) throw new Error('Modeler is not initialized, failed to save diagram');

        const { xml: bpmnFile } = await modeler.saveXML({ format: true });

        const dto = new UpdateAutomationProcessDto({ bpmnFile, isActive });

        await updateAutomationProcess(dto);
      },
    [modeler, updateAutomationProcess]
  );

  const handleSaveAndRun = useCallback(
    async ({ withRedirect }: { withRedirect: boolean }): Promise<void> => {
      try {
        await getSaveDraftHandler({ isActive: true })();

        if (withRedirect) navigate(backLink);
      } catch (e) {
        handleProcessSchemaError(e);
      }
    },
    [backLink, getSaveDraftHandler, handleProcessSchemaError, navigate]
  );

  const handleGetElementFromRegistry = useCallback(
    (id: string): Element => {
      if (!modeler)
        throw new Error('Modeler is not initialized, failed to get element from registry');

      const elementRegistry = modeler.get<ElementRegistry>('elementRegistry');

      const element = elementRegistry.get(id);

      if (!element) throw new Error(`Failed to get element ${id} from element registry`);

      return element as Element;
    },
    [modeler]
  );

  const handleCloseWorkspaceStartEventPopup = useCallback(
    () => setSelectedWorkspaceStartEventId(null),
    []
  );
  const handleCloseWorkspaceServiceTaskPopup = useCallback(
    () => setSelectedWorkspaceServiceTaskId(null),
    []
  );
  const handleCloseWorkspaceDelayEventPopup = useCallback(
    () => setSelectedWorkspaceDelayEventId(null),
    []
  );
  const handleCloseWorkspaceSequenceFlowPopup = useCallback(
    () => setSelectedWorkspaceSequenceFlowId(null),
    []
  );

  return (
    <Root>
      {isAutomationProcessLoading ? (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      ) : (
        <>
          <ModelerBlock ref={modelerRef} />

          {modeler && <CenterDiagramViewButton modeler={modeler} />}

          {modeler && (
            <>
              <CreateWorkspaceStartEventMenu
                entityTypeId={entityTypeId}
                modeler={modeler}
                isListEntityType={isListEntityType}
              />
              <CreateWorkspaceServiceTaskMenu
                modeler={modeler}
                isListEntityType={isListEntityType}
              />
            </>
          )}

          {selectedWorkspaceStartEventId && modeler && (
            <WorkspaceStartEventPopup
              key={selectedWorkspaceStartEventId}
              modeler={modeler}
              isListEntityType={isListEntityType}
              isOpened={Boolean(selectedWorkspaceStartEventId)}
              selectedWorkspaceStartEventId={selectedWorkspaceStartEventId}
              onClose={handleCloseWorkspaceStartEventPopup}
              handleGetElementFromRegistry={handleGetElementFromRegistry}
            />
          )}

          {selectedWorkspaceSequenceFlowId && modeler && (
            <WorkspaceSequenceFlowPopup
              key={selectedWorkspaceSequenceFlowId}
              modeler={modeler}
              entityTypeId={entityTypeId}
              isOpened={Boolean(selectedWorkspaceSequenceFlowId)}
              selectedWorkspaceSequenceFlowId={selectedWorkspaceSequenceFlowId}
              onClose={handleCloseWorkspaceSequenceFlowPopup}
              handleGetElementFromRegistry={handleGetElementFromRegistry}
            />
          )}

          {selectedWorkspaceDelayEventId && modeler && (
            <WorkspaceDelayEventPopup
              key={selectedWorkspaceDelayEventId}
              modeler={modeler}
              isOpened={Boolean(selectedWorkspaceDelayEventId)}
              selectedWorkspaceDelayEventId={selectedWorkspaceDelayEventId}
              onClose={handleCloseWorkspaceDelayEventPopup}
              handleGetElementFromRegistry={handleGetElementFromRegistry}
            />
          )}

          {selectedWorkspaceServiceTaskId && modeler && (
            <WorkspaceServiceTaskPopupSwitch
              key={selectedWorkspaceServiceTaskId}
              modeler={modeler}
              entityTypeId={entityTypeId}
              isListEntityType={isListEntityType}
              isOpened={Boolean(selectedWorkspaceServiceTaskId)}
              selectedWorkspaceServiceTaskId={selectedWorkspaceServiceTaskId}
              onClose={handleCloseWorkspaceServiceTaskPopup}
              handleGetElementFromRegistry={handleGetElementFromRegistry}
            />
          )}

          {automationProcess && (
            <ProcessControls
              isActive={automationProcess.isActive}
              isUpdating={isAutomationProcessUpdating}
              handleCancel={handleCancel}
              handleSaveAndRun={handleSaveAndRun}
              handleSaveDraft={getSaveDraftHandler({ isActive: false })}
            />
          )}

          {isProcessWarningOpened && automationProcess && (
            <AutomationProcessSchemaErrorWarning
              name={automationProcess.name}
              isOpened={isProcessWarningOpened}
              onClose={hideProcessWarning}
            />
          )}
        </>
      )}
    </Root>
  );
});

AutomationProcessesModeler.displayName = 'AutomationProcessesModeler';
export { AutomationProcessesModeler };
