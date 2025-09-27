import {
  EntityTypeActionType,
  HttpMethod,
  InputModel,
  KeyValueListModel,
  type Optional,
  SelectModel,
  UuidUtil,
  validateForm,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type ActionHttpCallSettings,
  AutomationEntityTypeTemplateFormData,
  type AutomationModalBaseProps,
} from '../../../models';
import { AutomationModalTemplate } from '../AutomationModalTemplate';
import {
  RequestHttpAutomationModalContent,
  type RequestHttpAutomationModalContentForm,
} from './RequestHttpAutomationModalContent';

const RequestHttpAutomationModal = observer((props: AutomationModalBaseProps) => {
  const { isOpened, stageId, automationStore, automation = null, onClose } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.request_http_automation_modal',
  });

  const templateModel = useLocalObservable<AutomationEntityTypeTemplateFormData>(() =>
    automation
      ? AutomationEntityTypeTemplateFormData.fromAutomation(automation)
      : AutomationEntityTypeTemplateFormData.getDefaultTemplate(
          t('http_request_default_name', { id: UuidUtil.generate6() })
        )
  );

  const settings = useMemo<Optional<ActionHttpCallSettings>>(
    () => automation?.firstAction?.settings as Optional<ActionHttpCallSettings>,
    [automation]
  );

  const form = useLocalObservable<RequestHttpAutomationModalContentForm>(() => ({
    url: InputModel.create(settings?.url).httpUrl().required(),
    method: SelectModel.create(settings?.method ?? HttpMethod.POST).required(),
    headers: KeyValueListModel.createFromObject(settings?.headers).httpHeaderFormat(),
    params: KeyValueListModel.createFromObject(settings?.params).printableAsciiFormat(),
  }));

  const handleSave = useCallback(
    async (templateFormData: AutomationEntityTypeTemplateFormData): Promise<void> => {
      if (!validateForm(form) || !validateForm(templateFormData)) return;

      const requestHttpActionSettings: ActionHttpCallSettings = {
        url: form.url.value,
        method: form.method.value,
        headers: form.headers.toObject(),
        params: form.params.toObject(),
      };

      await automationStore.saveAutomation({
        stageId,
        templateModel: templateFormData,
        automationId: automation?.id,
        action: {
          delay: templateFormData.delay,
          settings: requestHttpActionSettings,
          type: EntityTypeActionType.HTTP_CALL,
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
      <RequestHttpAutomationModalContent form={form} entityTypeId={automationStore.entityTypeId} />
    </AutomationModalTemplate>
  );
});

RequestHttpAutomationModal.displayName = 'RequestHttpAutomationModal';
export { RequestHttpAutomationModal };
