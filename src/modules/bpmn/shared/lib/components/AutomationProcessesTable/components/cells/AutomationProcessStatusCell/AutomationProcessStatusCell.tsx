import {
  debounce,
  ErrorCode,
  MySwitchWithModel,
  type BooleanModel,
  type InputModel,
  type Optional,
  type ServiceError,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateAutomationProcessDto, useUpdateAutomationProcess } from '../../../../../../../api';
import { AutomationProcessSchemaErrorWarning } from '../../../../AutomationProcessSchemaErrorWarning/AutomationProcessSchemaErrorWarning';

interface Props {
  name: InputModel;
  processId: number;
  model: BooleanModel;
}

const AutomationProcessStatusCell = observer((props: Props) => {
  const { name, processId, model } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.hooks.use_bpmn_automations_columns',
  });

  const { mutateAsync: updateAutomationProcess } = useUpdateAutomationProcess(processId);

  const [isProcessWarningOpened, { open: showProcessWarning, close: hideProcessWarning }] =
    useDisclosure(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleUpdateAutomationProcess = useCallback(
    debounce(async (isActive: boolean): Promise<void> => {
      const dto = new UpdateAutomationProcessDto({
        isActive,
      });

      try {
        await updateAutomationProcess(dto);
      } catch (e) {
        const axiosError = e as AxiosError;
        const serviceError = axiosError.response?.data as Optional<ServiceError>;

        if (serviceError?.errorCode === ErrorCode.AUTOMATION_PROCESS_ERROR) {
          showProcessWarning();

          model.setValue(false);
        }
      }
    }, 500),
    [model, updateAutomationProcess, showProcessWarning]
  );

  return (
    <>
      <MySwitchWithModel
        model={model}
        label={t('active')}
        onChange={debouncedHandleUpdateAutomationProcess}
      />

      {isProcessWarningOpened && (
        <AutomationProcessSchemaErrorWarning
          name={name.value}
          isOpened={isProcessWarningOpened}
          onClose={hideProcessWarning}
        />
      )}
    </>
  );
});

export { AutomationProcessStatusCell };
