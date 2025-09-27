import { EntityTypeActionType, type Nullable } from '@/shared';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { checkIfElementHasServiceTasksInContextPad, safeSetElementTitle } from '../helpers';
import { BpmnJsType, type ProcessMinimap } from '../models';

export const useHandleTranslateModelerElementsTitles = (modeler: Nullable<BpmnModeler>): void => {
  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_automations_processes_modeler',
  });

  useEffect(() => {
    if (!modeler) return;

    const eventBus = modeler.get<EventBus>('eventBus');

    const dataActionEntryAttr = 'data-action';
    const dataIdEntryAttr = 'data-id';

    const createStartEventPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.start-event"]`
    );
    const createEndEventPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.end-event"]`
    );
    const createExclusiveGatewayPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.exclusive_gateway"]`
    );
    const createParallelGatewayPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.parallel_gateway"]`
    );
    const createDataObjectPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.data-object"]`
    );
    const createDataStorePaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.data-store"]`
    );
    const createParticipantExpandedPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.participant-expanded"]`
    );
    const createGroupPaletteEntry = document.querySelector(
      `[${dataActionEntryAttr}="create.group"]`
    );

    if (createStartEventPaletteEntry)
      safeSetElementTitle({
        element: createStartEventPaletteEntry,
        title: t('pallete.create_workspace_start_event'),
      });

    if (createEndEventPaletteEntry)
      safeSetElementTitle({
        element: createEndEventPaletteEntry,
        title: t('pallete.create_workspace_end_event'),
      });

    if (createExclusiveGatewayPaletteEntry)
      safeSetElementTitle({
        element: createExclusiveGatewayPaletteEntry,
        title: t('pallete.create_workspace_exclusive_gateway'),
      });

    if (createParallelGatewayPaletteEntry)
      safeSetElementTitle({
        element: createParallelGatewayPaletteEntry,
        title: t('pallete.create_workspace_parallel_gateway'),
      });

    if (createDataObjectPaletteEntry)
      safeSetElementTitle({
        element: createDataObjectPaletteEntry,
        title: t('pallete.create_workspace_data_object'),
      });

    if (createDataStorePaletteEntry)
      safeSetElementTitle({
        element: createDataStorePaletteEntry,
        title: t('pallete.create_workspace_data_store'),
      });

    if (createParticipantExpandedPaletteEntry)
      safeSetElementTitle({
        element: createParticipantExpandedPaletteEntry,
        title: t('pallete.create_workspace_participant_expanded'),
      });

    if (createGroupPaletteEntry)
      safeSetElementTitle({
        element: createGroupPaletteEntry,
        title: t('pallete.create_workspace_group'),
      });

    // So that everything is already mounted to the DOM
    setTimeout(() => {
      const handleSetMinimapToggleTranslatedTitle = () => {
        const minimap = modeler.get<ProcessMinimap>('minimap');

        const minimapToggle = document.querySelector('.djs-minimap .toggle');

        if (minimapToggle)
          minimap.isOpen()
            ? minimapToggle.setAttribute('title', t('close_minimap'))
            : minimapToggle.setAttribute('title', t('open_minimap'));
      };

      // Initial title
      handleSetMinimapToggleTranslatedTitle();

      // Translate bpmn-js-color-picker entries titles
      eventBus.on('contextPad.trigger', () => {
        const defaultColorColorPickerEntry = document.querySelector(
          `[${dataIdEntryAttr}="default-color"]`
        );
        const blueColorColorPickerEntry = document.querySelector(
          `[${dataIdEntryAttr}="blue-color"]`
        );
        const orangeColorColorPickerEntry = document.querySelector(
          `[${dataIdEntryAttr}="orange-color"]`
        );
        const greenColorColorPickerEntry = document.querySelector(
          `[${dataIdEntryAttr}="green-color"]`
        );
        const redColorColorPickerEntry = document.querySelector(`[${dataIdEntryAttr}="red-color"]`);
        const purpleColorColorPickerEntry = document.querySelector(
          `[${dataIdEntryAttr}="purple-color"]`
        );

        if (defaultColorColorPickerEntry)
          safeSetElementTitle({
            element: defaultColorColorPickerEntry,
            title: t('color_picker.default_color'),
          });

        if (blueColorColorPickerEntry)
          safeSetElementTitle({
            element: blueColorColorPickerEntry,
            title: t('color_picker.blue_color'),
          });

        if (orangeColorColorPickerEntry)
          safeSetElementTitle({
            element: orangeColorColorPickerEntry,
            title: t('color_picker.orange_color'),
          });

        if (greenColorColorPickerEntry)
          safeSetElementTitle({
            element: greenColorColorPickerEntry,
            title: t('color_picker.green_color'),
          });

        if (redColorColorPickerEntry)
          safeSetElementTitle({
            element: redColorColorPickerEntry,
            title: t('color_picker.red_color'),
          });

        if (purpleColorColorPickerEntry)
          safeSetElementTitle({
            element: purpleColorColorPickerEntry,
            title: t('color_picker.purple_color'),
          });
      });

      // On every toggle
      eventBus.on('minimap.toggle', handleSetMinimapToggleTranslatedTitle);

      const handPaletteElement = document.querySelector('.entry.bpmn-icon-hand-tool');
      const lassoPaletteElement = document.querySelector('.entry.bpmn-icon-lasso-tool');
      const spacePaletteElement = document.querySelector('.entry.bpmn-icon-space-tool');
      const globalConnectPaletteElement = document.querySelector(
        '.entry.bpmn-icon-connection-multi'
      );

      const paletteStartEventElement = document.querySelector(
        '.entry.bpmn-icon-start-event-message.workspace'
      );
      const paletteDelayElement = document.querySelector(
        '.entry.bpmn-icon-intermediate-event-catch-timer.workspace'
      );
      const paletteServiceTaskElement = document.querySelector(
        '.entry.bpmn-icon-service-task.workspace'
      );

      // So that we have access to translations, we can't pass translation function properly to the extension

      safeSetElementTitle({ element: handPaletteElement, title: t('activate_hand_tool') });
      safeSetElementTitle({ element: lassoPaletteElement, title: t('activate_lasso_tool') });
      safeSetElementTitle({
        element: spacePaletteElement,
        title: t('active_create_remove_space_tool'),
      });
      safeSetElementTitle({
        element: globalConnectPaletteElement,
        title: t('activate_global_connect_tool'),
      });

      safeSetElementTitle({
        element: paletteStartEventElement,
        title: t('create_workspace_start_event'),
      });
      safeSetElementTitle({
        element: paletteDelayElement,
        title: t('create_workspace_delay_event'),
      });
      safeSetElementTitle({
        element: paletteServiceTaskElement,
        title: t('create_workspace_service_task'),
      });

      eventBus.on('contextPad.open', function (e: { current: { target: Element } }) {
        const {
          current: { target: element },
        } = e;

        const appendEndEventContextPadEntry = document.querySelector(
          `[${dataActionEntryAttr}="append.end-event"]`
        );
        const appendGatewayContextPadEntry = document.querySelector(
          `[${dataActionEntryAttr}="append.gateway"]`
        );
        const appendTextAnnotationContextPadEntry = document.querySelector(
          `[${dataActionEntryAttr}="append.text-annotation"]`
        );
        const replaceContextPadEntry = document.querySelector(`[${dataActionEntryAttr}="replace"]`);
        const deleteContextPadEntry = document.querySelector(`[${dataActionEntryAttr}="delete"]`);
        const setColorContextPadEntry = document.querySelector(
          `[${dataActionEntryAttr}="set-color"]`
        );
        const connectContextPadEntry = document.querySelector(`[${dataActionEntryAttr}="connect"]`);

        if (appendEndEventContextPadEntry)
          safeSetElementTitle({
            element: appendEndEventContextPadEntry,
            title: t('context_pad.append_end_event'),
          });

        if (appendGatewayContextPadEntry)
          safeSetElementTitle({
            element: appendGatewayContextPadEntry,
            title: t('context_pad.append_gateway'),
          });

        if (appendTextAnnotationContextPadEntry)
          safeSetElementTitle({
            element: appendTextAnnotationContextPadEntry,
            title: t('context_pad.append_text_annotation'),
          });

        if (replaceContextPadEntry)
          safeSetElementTitle({
            element: replaceContextPadEntry,
            title: t('context_pad.replace'),
          });

        if (deleteContextPadEntry)
          safeSetElementTitle({
            element: deleteContextPadEntry,
            title: t('context_pad.delete'),
          });

        if (setColorContextPadEntry)
          safeSetElementTitle({
            element: setColorContextPadEntry,
            title: t('context_pad.set_color'),
          });

        if (connectContextPadEntry)
          safeSetElementTitle({
            element: connectContextPadEntry,
            title: t('context_pad.connect'),
          });

        if (is(element, BpmnJsType.SEQUENCE_FLOW)) {
          const toggleDefaultContextPadEntry = document.querySelector('.workspace.toggle-default');

          if (toggleDefaultContextPadEntry)
            safeSetElementTitle({
              element: toggleDefaultContextPadEntry,
              title: t('toggle_default_context_pad_entry'),
            });
        }

        const businessObject = getBusinessObject(element);

        if (checkIfElementHasServiceTasksInContextPad(businessObject)) {
          const contextPadEntryServiceTaskAddTask = document.querySelector(
            '.workspace__CreateTask.context-pad-entry'
          );
          const contextPadEntryServiceTaskAddActivity = document.querySelector(
            '.workspace__CreateActivity.context-pad-entry'
          );
          const contextPadEntryServiceTaskChangeStage = document.querySelector(
            '.workspace__EntityStageChange.context-pad-entry'
          );
          const contextPadEntryServiceTaskChangeLinkedStage = document.querySelector(
            '.workspace__EntityLinkedStageChange.context-pad-entry'
          );
          const contextPadEntryServiceTaskChangeResponsible = document.querySelector(
            '.workspace__EntityResponsibleChange.context-pad-entry'
          );
          const contextPadEntryServiceTaskSendEmail = document.querySelector(
            '.workspace__SendEmail.context-pad-entry'
          );
          const contextPadEntryServiceTaskCreateEntity = document.querySelector(
            '.workspace__EntityCreate.context-pad-entry'
          );
          const contextPadEntryServiceTaskSendAmwork = document.querySelector(
            '.workspace__ChatSendAmwork.context-pad-entry'
          );
          const contextPadEntryServiceTaskSendExternal = document.querySelector(
            '.workspace__ChatSendExternal.context-pad-entry'
          );
          const contextPadEntryServiceTaskHttpCall = document.querySelector(
            '.workspace__HttpCall.context-pad-entry'
          );

          const contextPadEntryServiceTaskAddDelay = document.querySelector(
            '.workspace__CreateDelay.context-pad-entry'
          );

          if (contextPadEntryServiceTaskAddTask)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskAddTask,
              title: t(`context_pad.${EntityTypeActionType.TASK_CREATE}`),
            });

          if (contextPadEntryServiceTaskAddTask)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskAddTask,
              title: t(`context_pad.${EntityTypeActionType.TASK_CREATE}`),
            });

          if (contextPadEntryServiceTaskAddActivity)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskAddActivity,
              title: t(`context_pad.${EntityTypeActionType.ACTIVITY_CREATE}`),
            });

          if (contextPadEntryServiceTaskChangeStage)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskChangeStage,
              title: t(`context_pad.${EntityTypeActionType.ENTITY_STAGE_CHANGE}`),
            });

          if (contextPadEntryServiceTaskChangeLinkedStage)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskChangeLinkedStage,
              title: t(`context_pad.${EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE}`),
            });

          if (contextPadEntryServiceTaskChangeResponsible)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskChangeResponsible,
              title: t(`context_pad.${EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE}`),
            });

          if (contextPadEntryServiceTaskSendEmail)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskSendEmail,
              title: t(`context_pad.${EntityTypeActionType.EMAIL_SEND}`),
            });

          if (contextPadEntryServiceTaskCreateEntity)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskCreateEntity,
              title: t(`context_pad.${EntityTypeActionType.ENTITY_CREATE}`),
            });

          if (contextPadEntryServiceTaskSendAmwork)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskSendAmwork,
              title: t(`context_pad.${EntityTypeActionType.CHAT_SEND_AMWORK}`),
            });

          if (contextPadEntryServiceTaskSendExternal)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskSendExternal,
              title: t(`context_pad.${EntityTypeActionType.CHAT_SEND_EXTERNAL}`),
            });

          if (contextPadEntryServiceTaskHttpCall)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskHttpCall,
              title: t(`context_pad.${EntityTypeActionType.HTTP_CALL}`),
            });

          if (contextPadEntryServiceTaskAddDelay)
            safeSetElementTitle({
              element: contextPadEntryServiceTaskAddDelay,
              title: t('context_pad.delay'),
            });
        }
      });
    });
  }, [modeler, t]);
};
