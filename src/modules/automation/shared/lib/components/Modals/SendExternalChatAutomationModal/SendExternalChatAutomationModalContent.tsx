import { userStore } from '@/app';
import {
  DeleteButton,
  Hint,
  InputModel,
  MyCheckboxWithBooleanModel,
  MyFloatingTooltip,
  MyTextArea,
  MyUsersSelect,
  PhoneFieldInput,
  PlusIconButton,
  type BooleanModel,
  type SelectModel,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ActionSendOptionsForm } from '../../../models';
import { ExternalChatProvidersSelect } from '../../ExternalChatProvidersSelect/ExternalChatProvidersSelect';
import {
  AutomationBooleanRadioSelect,
  AutomationFormItem,
  AutomationSendOptionsBlock,
  TemplateList,
  WrapperWithLeftOffset,
} from '../components';

const OptionsBlockWrapper = styled.div<{ $hiddenGap?: boolean }>`
  margin-top: 0;
  transition: var(--transition-200);

  ${p => p.$hiddenGap && 'margin-top: -8px'};
`;

const PhoneFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TargetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxWrapper = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${p => p.$disabled && 'opacity: 0.7'};
`;

const CheckboxLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

export interface SendExternalChatAutomationModalContentForm {
  message: InputModel;
  providerId: SelectModel;
  userId: SelectModel;
  phoneNumbers: InputModel[];
  chatsEnabled: BooleanModel;
  phoneNumbersEnabled: BooleanModel;
  options: ActionSendOptionsForm;
}

interface Props {
  entityTypeId: number;
  form: SendExternalChatAutomationModalContentForm;
}

const SendExternalChatAutomationModalContent = observer((props: Props) => {
  const { entityTypeId, form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.send_external_chat_automation_modal',
  });

  const [phoneNumbersAvailable, setPhoneNumbersAvailable] = useState(true);

  const optionsBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    optionsBlockRef.current && autoAnimate(optionsBlockRef.current);
  }, [optionsBlockRef]);

  // clear checkbox errors that could possibly appear on save attempt
  useEffect(() => {
    if (form.chatsEnabled.value || form.phoneNumbersEnabled.value) {
      form.chatsEnabled.clearError();
      form.phoneNumbersEnabled.clearError();
    }
  }, [form.chatsEnabled, form.phoneNumbersEnabled]);

  useEffect(() => {
    if (!phoneNumbersAvailable) form.phoneNumbersEnabled.value = false;
  }, [form.phoneNumbersEnabled, phoneNumbersAvailable]);

  const addPhoneNumberModel = useCallback(() => {
    if (form.phoneNumbers.some(pn => !pn.value.length)) {
      form.phoneNumbers.find(pn => !pn.value.length)?.showError(t('errors.phone'));

      return;
    }

    form.phoneNumbers.push(InputModel.create().phoneInternational());
  }, [form.phoneNumbers, t]);

  const getDeletePhoneNumberHandler = useCallback(
    (idx: number) => () => {
      if (form.phoneNumbers.length < 2) return;

      form.phoneNumbers = form.phoneNumbers.filter((_, pnIdx) => pnIdx !== idx);
    },
    [form]
  );

  return (
    <>
      <AutomationFormItem text={t('sender')} hint={t('responsible_user_hint')}>
        <MyUsersSelect
          withinPortal
          variant="outlined"
          model={form.userId}
          users={userStore.activeUsers}
          emptyUserOptionTitle={t('current_responsible_user')}
        />
      </AutomationFormItem>

      <AutomationFormItem text={t('provider')}>
        <ExternalChatProvidersSelect
          model={form.providerId}
          setPhoneNumbersAvailable={setPhoneNumbersAvailable}
        />
      </AutomationFormItem>

      <TargetWrapper>
        <CheckboxWrapper>
          <CheckboxLabelWrapper>
            <MyCheckboxWithBooleanModel model={form.chatsEnabled} />

            {t('send_to_chats')}

            <Hint text={t('hint_chats')} />
          </CheckboxLabelWrapper>

          <WrapperWithLeftOffset>
            {form.chatsEnabled.value && (
              <>
                <AutomationBooleanRadioSelect
                  model={form.options.enabled}
                  trueLabel={t('options.fine_tune_addresses')}
                  falseLabel={t('options.all_addresses')}
                />

                <OptionsBlockWrapper ref={optionsBlockRef} $hiddenGap={!form.options.enabled.value}>
                  {form.options.enabled.value === 'true' && (
                    <AutomationSendOptionsBlock form={form.options} localePrefix="external_chat" />
                  )}
                </OptionsBlockWrapper>
              </>
            )}
          </WrapperWithLeftOffset>
        </CheckboxWrapper>

        <MyFloatingTooltip
          withinPortal
          zIndex={1051}
          label={t('phone_numbers_disabled')}
          disabled={phoneNumbersAvailable}
        >
          <CheckboxWrapper $disabled={!phoneNumbersAvailable}>
            <CheckboxLabelWrapper>
              <MyCheckboxWithBooleanModel
                model={form.phoneNumbersEnabled}
                disabled={!phoneNumbersAvailable}
              />

              {t('send_to_phone_numbers')}

              <Hint text={t('hint_phone_numbers')} />
            </CheckboxLabelWrapper>

            <WrapperWithLeftOffset>
              {phoneNumbersAvailable && form.phoneNumbersEnabled.value && (
                <TargetWrapper>
                  {form.phoneNumbers.map((pn, idx) => (
                    <PhoneFieldWrapper key={idx}>
                      <PhoneFieldInput model={pn} />

                      {form.phoneNumbers.length > 1 && (
                        <DeleteButton onClick={getDeletePhoneNumberHandler(idx)} />
                      )}
                    </PhoneFieldWrapper>
                  ))}

                  <PlusIconButton
                    isGreen
                    text={t('add_phone_number')}
                    onClick={addPhoneNumberModel}
                  />
                </TargetWrapper>
              )}
            </WrapperWithLeftOffset>
          </CheckboxWrapper>
        </MyFloatingTooltip>
      </TargetWrapper>

      <AutomationFormItem text={t('message')}>
        <MyTextArea
          minRows={3}
          variant="outlined"
          model={form.message}
          placeholder={t('placeholders.message')}
        />

        <TemplateList entityTypeId={entityTypeId} />
      </AutomationFormItem>
    </>
  );
});

SendExternalChatAutomationModalContent.displayName = 'SendExternalChatAutomationModalContent';
export { SendExternalChatAutomationModalContent };
