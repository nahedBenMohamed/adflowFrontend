import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import type { IncomingKnownMissingFormData } from '../../../../../../store';
import { CallTypeGroup } from '../../../CallTypeGroup/CallTypeGroup';
import { TaskAndActivitiesScenarioGroup } from '../TaskAndActivitiesScenarioGroup/TaskAndActivitiesScenarioGroup';

interface Props {
  incomingKnownMissingFormData: IncomingKnownMissingFormData;
}

const IncomingKnownMissingScenarioBlock = observer((props: Props) => {
  const {
    incomingKnownMissingFormData: { taskAndActivityFormData, clearTasksAndActivitiesFormData },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.incoming_known_missing_scenario_block',
  });

  return (
    <CallTypeGroup title={t('missed_from_known_number')}>
      <TaskAndActivitiesScenarioGroup
        contactOrCompanyNotSelected={false}
        taskAndActivityFormData={taskAndActivityFormData}
        clearTaskAndActivityFormData={clearTasksAndActivitiesFormData}
      />
    </CallTypeGroup>
  );
});

IncomingKnownMissingScenarioBlock.displayName = 'IncomingKnownMissingScenarioBlock';
export { IncomingKnownMissingScenarioBlock };
