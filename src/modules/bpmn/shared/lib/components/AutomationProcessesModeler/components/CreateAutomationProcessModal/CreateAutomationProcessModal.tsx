import { DialogModalSecondary, InputModel, MyInput, UuidUtil } from '@/shared';
import { FocusTrap } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { CreateAutomationProcessDto, useCreateAutomationProcess } from '../../../../../../api';
import { BpmnIcon } from '../../../../../assets';
import {
  AutomationProcessType,
  SELECTED_AUTOMATION_PROCESS_ID_QUERY_PARAM,
} from '../../../../models';
import { PopupFormItem } from '../PopupFormItem/PopupFormItem';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  padding: 24px 32px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  isOpened: boolean;
  entityTypeId: number;
  onClose: () => void;
}

const CreateAutomationProcessModal = observer((props: Props) => {
  const { isOpened, entityTypeId, onClose } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.create_automation_process_modal',
  });

  const [, setSearchParams] = useSearchParams();

  const name = useLocalObservable<InputModel>(() =>
    InputModel.create(t('new_process', { number: UuidUtil.generate6number() })).required()
  );

  const { mutateAsync: createAutomationProcess, isPending: isCreatingAutomationProcess } =
    useCreateAutomationProcess();

  const handleCreateAutomationProcess = useCallback(async (): Promise<void> => {
    if (!name.validate()) return;

    const dto = new CreateAutomationProcessDto({
      isActive: false,
      objectId: entityTypeId,
      name: name.trimmedValue,
      type: AutomationProcessType.ENTITY_TYPE,
    });

    const { id: processId } = await createAutomationProcess(dto);

    setSearchParams(prev => {
      prev.set(SELECTED_AUTOMATION_PROCESS_ID_QUERY_PARAM, String(processId));

      return prev;
    });

    onClose();
  }, [entityTypeId, name, setSearchParams, createAutomationProcess, onClose]);

  return (
    <DialogModalSecondary
      width="440px"
      maxHeight="100%"
      isOpened={isOpened}
      Header={t('title')}
      height="fit-content"
      approveTitle={t('create')}
      loading={isCreatingAutomationProcess}
      approveDisabled={isCreatingAutomationProcess}
      onClose={onClose}
      onApprove={handleCreateAutomationProcess}
    >
      <FocusTrap active={isOpened}>
        <Root>
          <IconWrapper>
            <BpmnIcon />
          </IconWrapper>

          <PopupFormItem text={t('name')}>
            <MyInput model={name} placeholder={t('placeholders.name')} variant="outlined" />
          </PopupFormItem>
        </Root>
      </FocusTrap>
    </DialogModalSecondary>
  );
});

CreateAutomationProcessModal.displayName = 'CreateAutomationProcessModal';
export { CreateAutomationProcessModal };
