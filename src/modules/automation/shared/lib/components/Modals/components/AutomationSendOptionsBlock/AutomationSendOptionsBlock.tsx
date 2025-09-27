import { FormItem, FormItemLabel, Hint, MyCheckboxWithBooleanModel } from '@/shared';
import { Transition } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ActionSendOptionsForm } from '../../../../models';
import { AutomationBooleanRadioSelect } from '../AutomationBooleanRadioSelect/AutomationBooleanRadioSelect';
import { WrapperWithLeftOffset } from '../WrapperWithLeftOffset/WrapperWithLeftOffset';
import { EntitySendOptionsBlock } from './components';

const ItemWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  form: ActionSendOptionsForm;
  localePrefix: 'email' | 'external_chat';
}

const AutomationSendOptionsBlock = observer((props: Props) => {
  const { form, localePrefix } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: `automation.modals.send_${localePrefix}_automation_modal.options`,
  });

  // Clear error on change checkboxes value
  useEffect(() => {
    form.main.enabled.clearError();
    form.contact.enabled.clearError();
    form.company.enabled.clearError();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.contact.enabled.value, form.company.enabled.value, form.main.enabled.value]);

  return (
    <WrapperWithLeftOffset>
      <FormItem>
        <FormItem gap="8px">
          <ItemWrapper>
            <MyCheckboxWithBooleanModel model={form.main.enabled} />

            <FormItemLabel
              $gap="4px"
              title={t('main_entity')}
              $color="var(--button-text-graphite-primary-text)"
            >
              {t('main_entity')}

              <Hint text={t('main_entity_hint')} />
            </FormItemLabel>
          </ItemWrapper>

          <Transition mounted={form.main.enabled.value} transition="scale-y">
            {styles => (
              <WrapperWithLeftOffset style={styles}>
                <AutomationBooleanRadioSelect
                  model={form.main.onlyFirstValue}
                  falseLabel={t('main_entity_all')}
                  trueLabel={t('main_entity_only_first')}
                />
              </WrapperWithLeftOffset>
            )}
          </Transition>
        </FormItem>

        <FormItem gap="8px">
          <ItemWrapper>
            <MyCheckboxWithBooleanModel model={form.contact.enabled} />

            <FormItemLabel
              $gap="4px"
              title={t('contact')}
              $color="var(--button-text-graphite-primary-text)"
            >
              {t('contact')}

              <Hint text={t('contact_hint')} />
            </FormItemLabel>
          </ItemWrapper>

          <Transition mounted={form.contact.enabled.value} transition="scale-y">
            {styles => (
              <WrapperWithLeftOffset style={styles}>
                <EntitySendOptionsBlock
                  localePrefix="contact"
                  localeModalPrefix={localePrefix}
                  model={form.contact.actionSendVariant}
                />
              </WrapperWithLeftOffset>
            )}
          </Transition>
        </FormItem>

        <FormItem gap="8px">
          <ItemWrapper>
            <MyCheckboxWithBooleanModel model={form.company.enabled} />

            <FormItemLabel
              $gap="4px"
              title={t('company')}
              $color="var(--button-text-graphite-primary-text)"
            >
              {t('company')}

              <Hint text={t('company_hint')} />
            </FormItemLabel>
          </ItemWrapper>

          <Transition mounted={form.company.enabled.value} transition="scale-y">
            {styles => (
              <WrapperWithLeftOffset style={styles}>
                <EntitySendOptionsBlock
                  localePrefix="company"
                  localeModalPrefix={localePrefix}
                  model={form.company.actionSendVariant}
                />
              </WrapperWithLeftOffset>
            )}
          </Transition>
        </FormItem>
      </FormItem>
    </WrapperWithLeftOffset>
  );
});

AutomationSendOptionsBlock.displayName = 'AutomationSendOptionsBlock';
export { AutomationSendOptionsBlock };
