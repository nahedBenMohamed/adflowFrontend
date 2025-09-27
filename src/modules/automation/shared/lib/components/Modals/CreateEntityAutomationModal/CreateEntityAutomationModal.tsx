import type { AutomationModalBaseProps } from '@/modules/automation';
import {
  EntityTypeActionType,
  InputModel,
  SelectModel,
  UuidUtil,
  validateForm,
  type Optional,
} from '@/shared';
import { useDidUpdate } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutomationEntityTypeTemplateFormData,
  type ActionEntityCreateSettings,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  CreateEntityAutomationModalContent,
  type CreateEntityAutomationModalContentForm,
} from './CreateEntityAutomationModalContent';

const CreateEntityAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { isOpened, stageId, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.create_entity_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('create_entity_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionEntityCreateSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionEntityCreateSettings>,
    [automation]
  );

  const form = useLocalObservable<CreateEntityAutomationModalContentForm>(() => ({
    entityTypeId: SelectModel.create(settings?.entityTypeId).required(),
    boardId: SelectModel.create(settings?.boardId),
    stageId: SelectModel.create(settings?.stageId),
    ownerId: SelectModel.create(settings?.ownerId ?? null),
    name: InputModel.create(settings?.name),
  }));

  useDidUpdate(() => {
    form.boardId.resetValue();
    form.stageId.resetValue();
  }, [form.entityTypeId.value]);

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const createLinkedEntityActionSettings: ActionEntityCreateSettings = {
        entityTypeId: form.entityTypeId.value,
        boardId: form.boardId.value,
        stageId: form.stageId.value,
        ownerId: form.ownerId.value,
        name: form.name.trimmedValue,
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: createLinkedEntityActionSettings,
          type: EntityTypeActionType.ENTITY_CREATE,
        },
      });

      onClose();
    },
    [automation, automationStore, form, stageId, onClose]
  );

  return (
    <AutomationModalTemplate
      maxHeight="824px"
      isOpened={isOpened}
      automation={automation}
      templateFormData={templateModel}
      automationStore={automationStore}
      title={automation ? t('title_update') : t('title_add')}
      onClose={onClose}
      onSave={handleSave}
    >
      <CreateEntityAutomationModalContent form={form} entityTypeId={automationStore.entityTypeId} />
    </AutomationModalTemplate>
  );
});

CreateEntityAutomationModal.displayName = 'CreateEntityAutomationModal';
export { CreateEntityAutomationModal };
