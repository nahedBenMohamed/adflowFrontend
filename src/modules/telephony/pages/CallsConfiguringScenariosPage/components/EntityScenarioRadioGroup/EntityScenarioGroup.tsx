import { boardApiUtil, entityTypeStore } from '@/app';
import type { InputModel, SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScenarioAutoCreateState } from '../../../../shared';
import { CallTypeGroup } from '../CallTypeGroup/CallTypeGroup';
import { RadioBlockWrapper } from '../RadioBlockWrapper/RadioBlockWrapper';
import { SelectWrapper } from '../SelectWrapper/SelectWrapper';
import { SelectsWrapper } from '../SelectsWrapper/SelectsWrapper';

interface Props {
  groupTitle: string;
  dealId: SelectModel;
  boardId: SelectModel;
  contactId: SelectModel;
  autoCreate: InputModel;
  autoCreateDisabledTitle: string;
  autoCreateDisabledHint?: string;
  clearFormData: () => void;
}

const EntityScenarioRadioGroup = observer((props: Props) => {
  const {
    groupTitle,
    autoCreate,
    dealId,
    contactId,
    boardId,
    autoCreateDisabledTitle,
    autoCreateDisabledHint,
    clearFormData,
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix:
      'telephony.pages.calls_configuring_scenarios_page.components.entity_scenario_radio_group',
  });

  const contactAndCompaniesOptions = useMemo(() => entityTypeStore.contactsAndCompaniesOptions, []);

  const dealOptions = useMemo(
    () => (contactId.value ? entityTypeStore.getLinkedDealsOptions(contactId.value) : []),
    [contactId.value]
  );

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(dealId.value);

  const handleChangeContactOrCompany = useCallback(() => {
    autoCreate.setValue(ScenarioAutoCreateState.ENABLED);

    dealId.setValue(null);
    boardId.setValue(null);
  }, [autoCreate, dealId, boardId]);

  const handleSelectDeal = useCallback(async (): Promise<void> => {
    boardId.setValue(boardsOptions[0]?.value);
  }, [boardId, boardsOptions]);

  return (
    <CallTypeGroup title={groupTitle}>
      <RadioBlockWrapper
        hint={autoCreateDisabledHint}
        title={autoCreateDisabledTitle}
        radioProps={{
          model: autoCreate,
          value: ScenarioAutoCreateState.DISABLED,
          handleChange: clearFormData,
        }}
      />

      <RadioBlockWrapper
        title={t('automatically_create')}
        radioProps={{
          model: autoCreate,
          value: ScenarioAutoCreateState.ENABLED,
        }}
      >
        <SelectWrapper
          title={t('contact_or_company')}
          selectProps={{
            model: contactId,
            options: contactAndCompaniesOptions,
            handleChange: handleChangeContactOrCompany,
          }}
        />

        <SelectsWrapper>
          <SelectWrapper
            title={t('deal')}
            selectProps={{
              model: dealId,
              options: dealOptions,
              placeholder: t('placeholders.select_deal'),
              handleChange: handleSelectDeal,
            }}
            disabledProps={{
              disabled: !contactId.value,
              warningTitle: t('select_contact_or_company_first'),
            }}
          />

          <SelectWrapper
            title={t('deal_pipeline')}
            selectProps={{
              model: boardId,
              options: boardsOptions,
              placeholder: t('placeholders.select_pipeline'),
            }}
            disabledProps={{
              disabled: !dealId.value,
              warningTitle: t('select_deal_first'),
            }}
          />
        </SelectsWrapper>
      </RadioBlockWrapper>
    </CallTypeGroup>
  );
});

EntityScenarioRadioGroup.displayName = 'EntityScenarioRadioGroup';
export { EntityScenarioRadioGroup };
