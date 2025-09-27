import { boardApiUtil, entityTypeStore, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ScenarioAutoCreateState } from '../../../../../../shared';
import type { IncomingUnknownMissingFormData } from '../../../../../../store';
import { CallTypeGroup } from '../../../CallTypeGroup/CallTypeGroup';
import { RadioBlockWrapper } from '../../../RadioBlockWrapper/RadioBlockWrapper';
import { SelectWrapper } from '../../../SelectWrapper/SelectWrapper';
import { SelectsWrapper } from '../../../SelectsWrapper/SelectsWrapper';
import { TaskAndActivitiesScenarioGroup } from '../TaskAndActivitiesScenarioGroup/TaskAndActivitiesScenarioGroup';

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  incomingUnknownMissingFormData: IncomingUnknownMissingFormData;
  clearIncomingUnknownMissingFormData: () => void;
}

const IncomingUnknownMissingScenarioBlock = observer((props: Props) => {
  const {
    incomingUnknownMissingFormData: {
      autoCreate,
      contactId,
      ownerId,
      dealId,
      boardId,
      taskAndActivityFormData,
      clearTasksAndActivitiesFormData,
    },
    clearIncomingUnknownMissingFormData,
  } = props;

  const { t: t1 } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.incoming_unknown_missing_scenario_block',
  });
  const { t: t2 } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_configuring_scenarios_page',
  });

  const contactAndCompaniesOptions = useMemo(() => entityTypeStore.contactsAndCompaniesOptions, []);

  const dealOptions = useMemo(
    () => (contactId.value ? entityTypeStore.getLinkedDealsOptions(contactId.value) : []),
    [contactId.value]
  );

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(dealId.value);

  const handleChangeContactOrCompany = useCallback(() => {
    autoCreate.setValue(ScenarioAutoCreateState.ENABLED);

    if (contactId.value && authStore.user) {
      ownerId.setValue(authStore.user.id);
    }

    dealId.setValue(null);
    boardId.setValue(null);
  }, [autoCreate, contactId.value, ownerId, dealId, boardId]);

  const handleSelectDeal = useCallback(async (): Promise<void> => {
    if (boardsOptions[0]?.value) boardId.setValue(boardsOptions[0]?.value);
  }, [boardId, boardsOptions]);

  return (
    <CallTypeGroup title={t1('missed_call_from_unknown_number')}>
      <RadioBlockWrapper
        title={t2('creates_manually')}
        hint={t1('creates_manually_hint')}
        radioProps={{
          model: autoCreate,
          value: ScenarioAutoCreateState.DISABLED,
          handleChange: clearIncomingUnknownMissingFormData,
        }}
      />
      <RadioBlockWrapper
        title={t1('auto_create')}
        radioProps={{
          model: autoCreate,
          value: ScenarioAutoCreateState.ENABLED,
        }}
      >
        <SelectsWrapper>
          <SelectWrapper
            title={t1('contact_or_company')}
            selectProps={{
              model: contactId,
              options: contactAndCompaniesOptions,
              handleChange: handleChangeContactOrCompany,
            }}
          />

          <SelectWrapper
            title={t1('responsible')}
            selectProps={{
              model: ownerId,
              placeholder: t1('placeholders.select_responsible'),
              options: userStore.activeUserOptions,
            }}
            disabledProps={{
              disabled: !contactId.value,
              warningTitle: t1('select_contact_or_company_first'),
            }}
          />
        </SelectsWrapper>

        <SelectsWrapper>
          <SelectWrapper
            title="Deal"
            selectProps={{
              model: dealId,
              options: dealOptions,
              placeholder: t1('placeholders.select_deal'),
              handleChange: handleSelectDeal,
            }}
            disabledProps={{
              disabled: !contactId.value,
              warningTitle: t1('select_contact_or_company_first'),
            }}
          />

          <SelectWrapper
            title={t1('deal_pipeline')}
            selectProps={{
              model: boardId,
              options: boardsOptions,
              placeholder: t1('placeholders.select_pipeline'),
            }}
            disabledProps={{
              disabled: !dealId.value,
              warningTitle: t1('select_deal_first'),
            }}
          />
        </SelectsWrapper>

        <Delimiter />

        <TaskAndActivitiesScenarioGroup
          contactOrCompanyNotSelected={!contactId.value}
          taskAndActivityFormData={taskAndActivityFormData}
          clearTaskAndActivityFormData={clearTasksAndActivitiesFormData}
        />
      </RadioBlockWrapper>
    </CallTypeGroup>
  );
});

IncomingUnknownMissingScenarioBlock.displayName = 'IncomingUnknownMissingScenarioBlock';
export { IncomingUnknownMissingScenarioBlock };
