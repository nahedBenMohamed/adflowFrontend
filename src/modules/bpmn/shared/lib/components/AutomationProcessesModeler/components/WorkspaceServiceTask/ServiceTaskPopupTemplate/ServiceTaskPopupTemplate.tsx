import { MyInput, type EntityTypeActionType, type InputModel } from '@/shared';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetWorkspaceServiceTaskOptions } from '../../../../../hooks';
import { PopupFormItem } from '../../PopupFormItem/PopupFormItem';
import { PopupHeaderIcon } from '../../PopupHeaderIcon/PopupHeaderIcon';
import { ProcessElementPopup } from '../../ProcessElementPopup/ProcessElementPopup';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  name: InputModel;
  isOpened: boolean;
  children: ReactNode;
  isListEntityType: boolean;
  entityTypeActionType: EntityTypeActionType;
  onSave: () => void;
  onClose: () => void;
}

const ServiceTaskPopupTemplate = (props: Props) => {
  const { name, isOpened, children, isListEntityType, entityTypeActionType, onSave, onClose } =
    props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.service_task_popup_template',
  });

  const { options, getServiceTaskNameByEntityTypeActionType } =
    useGetWorkspaceServiceTaskOptions(isListEntityType);

  return (
    <ProcessElementPopup
      isOpened={isOpened}
      title={getServiceTaskNameByEntityTypeActionType(entityTypeActionType)}
      Icon={
        <PopupHeaderIcon
          className="bpmn-icon-service-task"
          $color={options.find(o => o.value === entityTypeActionType)?.extra?.color}
        />
      }
      handleSave={onSave}
      handleCancel={onClose}
    >
      <Root>
        <PopupFormItem text={t('task_name')}>
          <MyInput variant="outlined" model={name} placeholder={t('placeholders.task_name')} />
        </PopupFormItem>

        {children}
      </Root>
    </ProcessElementPopup>
  );
};

export { ServiceTaskPopupTemplate };
