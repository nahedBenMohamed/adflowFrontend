import {
  HttpMethod,
  type InputModel,
  KeyValueInput,
  type KeyValueListModel,
  MyInput,
  MySelect,
  type Option,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AutomationFormItem, TemplateList, WrapperWithLeftOffset } from '../components';

const TemplateListWrapper = styled.div`
  padding-top: 12px;
`;

export interface RequestHttpAutomationModalContentForm {
  url: InputModel;
  method: SelectModel;
  headers: KeyValueListModel;
  params: KeyValueListModel;
}

interface Props {
  form: RequestHttpAutomationModalContentForm;
  entityTypeId: number;
}

const RequestHttpAutomationModalContent = observer((props: Props) => {
  const { form, entityTypeId } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.request_http_automation_modal',
  });

  const methodOptions = useMemo<Option[]>(
    () =>
      Object.values(HttpMethod).map(m => ({
        value: m,
        label: m,
      })),
    []
  );

  return (
    <AutomationFormItem text={t('http_request')}>
      <WrapperWithLeftOffset>
        <AutomationFormItem text={t('url')}>
          <MyInput variant="outlined" model={form.url} placeholder="https://domain.com/path" />
        </AutomationFormItem>

        <AutomationFormItem text={t('method')}>
          <MySelect withinPortal variant="outlined" model={form.method} options={methodOptions} />
        </AutomationFormItem>

        <AutomationFormItem text={t('headers')}>
          <WrapperWithLeftOffset>
            <KeyValueInput model={form.headers} variant="outlined" />
          </WrapperWithLeftOffset>
        </AutomationFormItem>

        <AutomationFormItem text={t('params')}>
          <WrapperWithLeftOffset>
            <KeyValueInput model={form.params} variant="outlined" />
          </WrapperWithLeftOffset>
        </AutomationFormItem>
      </WrapperWithLeftOffset>

      <TemplateListWrapper>
        <TemplateList entityTypeId={entityTypeId} />
      </TemplateListWrapper>
    </AutomationFormItem>
  );
});

RequestHttpAutomationModalContent.displayName = 'RequestHttpAutomationModalContent';
export { RequestHttpAutomationModalContent };
