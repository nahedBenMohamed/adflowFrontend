import { determineApiHost } from '@/app';
import { envUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepBiggerTitle,
  BuilderStepBox,
  BuilderStepSubtitle,
  SiteFormBuilderPageStepRoot,
  type SiteFormElementsPageFormData,
} from '../../../../shared';
import { CodeBlock } from '../../../SiteFormBuilderPage/components/SiteFormBuilderStep5/components';
import { HeadlessSiteFormFieldsTable, HeadlessSiteFormPlainFieldsTable } from './components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Content = styled(BuilderStepBox)`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 32px 48px;

  p,
  b,
  span {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: var(--button-text-graphite-priory-text);
  }

  span {
    white-space: pre;
  }

  code {
    font-weight: 500;
    border: 1px solid var(--graphite-graphite-80);
    font-family: var(--font-family-mono);
    white-space: pre;

    padding: 1px 4px;
    border-radius: var(--border-radius-element);
    background-color: var(--background-noun-20);
  }

  p,
  span {
    code {
      font-weight: 500;
      border: 1px solid var(--graphite-graphite-80);
      font-family: var(--font-family-mono);
      white-space: pre;

      padding: 1px 4px;
      border-radius: var(--border-radius-element);
      background-color: var(--background-noun-20);
    }
  }

  b {
    font-weight: 600;
  }

  li,
  h3 {
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    color: var(--button-text-graphite-primary-text);

    margin-top: 16px;
  }
`;

interface Props {
  code: string;
  siteFormPages: SiteFormElementsPageFormData[];
}

const HeadlessSiteFormBuilderStep3 = observer((props: Props) => {
  const { code, siteFormPages } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.headless_site_form_builder_page.site_form_builder_step3',
  });

  return (
    <Root>
      <BuilderStepBiggerTitle>{t('title')}</BuilderStepBiggerTitle>

      <BuilderStepSubtitle $withIndent>{t('formdata_integration_title')}</BuilderStepSubtitle>

      <Content as="ul">
        <p>{t('formdata_integration_instruction')}</p>

        <li>{t('formdata_webhook_url')}</li>

        <code>{`${determineApiHost()}/api/site-forms/builder/plain/${code}`}</code>

        <li>{t('formdata_fields_title')}</li>

        <p>{t('formdata_fields_explanation')}</p>

        <HeadlessSiteFormPlainFieldsTable siteFormPages={siteFormPages} />
      </Content>

      <BuilderStepSubtitle $withIndent>{t('json_integration_title')}</BuilderStepSubtitle>

      <Content as="ul">
        <p>{t('api_integration_instruction', { company: envUtil.appName })}</p>

        <li>{t('request_parameters_title')}</li>

        <span>
          <Trans
            t={t}
            i18nKey={'api_integration_request_annotation'}
            values={{
              endpoint: `${determineApiHost()}/api/site-forms/builder/${code}`,
            }}
            components={{
              code: <code />,
            }}
          />
        </span>

        <li>{t('request_body_title')}</li>

        <CodeBlock>
          {`{\n  fields: [${siteFormPages[0]?.fields.map(f => `\n  {\n    id: ${f.id},\n    value: ${t('field_value', { label: f.label.value })}\n  }`)}\n  ]\n}`}
        </CodeBlock>

        <li>{t('field_value_title')}</li>

        <p>{t('field_value_explanation')}</p>

        <HeadlessSiteFormFieldsTable siteFormPages={siteFormPages} />

        <li>{t('response_title')}</li>

        <p>{t('response_explanation')}</p>
      </Content>
    </Root>
  );
});

export { HeadlessSiteFormBuilderStep3 };
