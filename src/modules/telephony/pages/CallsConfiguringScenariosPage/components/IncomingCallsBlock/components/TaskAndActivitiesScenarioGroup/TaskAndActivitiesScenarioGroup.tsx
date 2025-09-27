import { ActivityTypeControl } from '@/modules/card';
import { activityTypeStore } from '@/modules/tasks';
import { FunctionalTextEditor, MyFloatingTooltip, MyInput } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TaskAndActivityCreateMode } from '../../../../../../shared';
import type { TaskAndActivityFormData } from '../../../../../../store';
import { RadioBlockWrapper } from '../../../RadioBlockWrapper/RadioBlockWrapper';
import { SelectWrapperTemplate } from '../../../SelectWrapperTemplate/SelectWrapperTemplate';
import { MinutesInput } from './components';

const Root = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${p => p.$disabled && `opacity: 0.35`};
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const PickersWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 24px;
`;

interface Props {
  contactOrCompanyNotSelected: boolean;
  taskAndActivityFormData: TaskAndActivityFormData;
  clearTaskAndActivityFormData: () => void;
}

const SELECT_WIDTH = '272px';
const EDITOR_MIN_HEIGHT = '70px';

const TaskAndActivitiesScenarioGroup = observer((props: Props) => {
  const {
    contactOrCompanyNotSelected,
    taskAndActivityFormData: {
      createMode,
      activityTypeId,
      activityText,
      activityDuration,
      taskTitle,
      taskText,
      taskDuration,
      createEmptyActivityForm,
      createEmptyTaskForm,
    },
    clearTaskAndActivityFormData,
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.task_and_activities_scenario_group',
  });

  return (
    <MyFloatingTooltip
      disabled={!contactOrCompanyNotSelected}
      label={t('select_contact_or_company_first')}
    >
      <Root $disabled={contactOrCompanyNotSelected}>
        <Title>{t('title')}</Title>

        <RadioBlockWrapper
          title={t('do_not_create')}
          radioProps={{
            model: createMode,
            disabled: contactOrCompanyNotSelected,
            value: TaskAndActivityCreateMode.DO_NOT_CREATE,
            handleChange: clearTaskAndActivityFormData,
          }}
        />

        <RadioBlockWrapper
          contentOutlined
          title={t('activity')}
          radioProps={{
            model: createMode,
            disabled: contactOrCompanyNotSelected,
            value: TaskAndActivityCreateMode.CREATE_ACTIVITY,
            handleChange: createEmptyTaskForm,
          }}
        >
          <PickersWrapper>
            <SelectWrapperTemplate title={t('activity_type')} width={SELECT_WIDTH}>
              <ActivityTypeControl
                view="select"
                model={activityTypeId}
                hiddenlyDisabled={contactOrCompanyNotSelected}
                activityTypes={activityTypeStore.activityTypes}
              />
            </SelectWrapperTemplate>

            <SelectWrapperTemplate title={t('complete')} width={SELECT_WIDTH}>
              <MinutesInput
                model={activityDuration}
                hiddenlyDisabled={contactOrCompanyNotSelected}
              />
            </SelectWrapperTemplate>
          </PickersWrapper>

          <SelectWrapperTemplate title={t('description')}>
            <FunctionalTextEditor
              variant="outlined"
              model={activityText}
              contentMinHeight={EDITOR_MIN_HEIGHT}
              hiddenlyDisabled={contactOrCompanyNotSelected}
              placeholder={t('placeholders.activity_description')}
            />
          </SelectWrapperTemplate>
        </RadioBlockWrapper>

        <RadioBlockWrapper
          title={t('task')}
          contentOutlined
          radioProps={{
            model: createMode,
            disabled: contactOrCompanyNotSelected,
            value: TaskAndActivityCreateMode.CREATE_TASK,
            handleChange: createEmptyActivityForm,
          }}
        >
          <PickersWrapper>
            <SelectWrapperTemplate title={t('task_title')} width={SELECT_WIDTH}>
              <MyInput
                model={taskTitle}
                variant="outlined"
                placeholder={t('placeholders.title')}
                hiddenlyDisabled={contactOrCompanyNotSelected}
              />
            </SelectWrapperTemplate>

            <SelectWrapperTemplate width={SELECT_WIDTH} title={t('complete')}>
              <MinutesInput model={taskDuration} hiddenlyDisabled={contactOrCompanyNotSelected} />
            </SelectWrapperTemplate>
          </PickersWrapper>

          <SelectWrapperTemplate title={t('description')}>
            <FunctionalTextEditor
              model={taskText}
              variant="outlined"
              placeholder={t('placeholders.task_description')}
              contentMinHeight={EDITOR_MIN_HEIGHT}
              hiddenlyDisabled={contactOrCompanyNotSelected}
            />
          </SelectWrapperTemplate>
        </RadioBlockWrapper>
      </Root>
    </MyFloatingTooltip>
  );
});

TaskAndActivitiesScenarioGroup.displayName = 'TaskAndActivitiesScenarioGroup';
export { TaskAndActivitiesScenarioGroup };
