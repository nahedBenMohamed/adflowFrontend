import { type BooleanModel, PrimaryButton } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SiteFormElementsPageFormData } from '../../../../shared';
import {
  BuilderStepBiggerTitle,
  BuilderStepBox,
  BuilderStepSubtitle,
  SiteFormBuilderPageStepRoot,
  SwitchBlock,
} from '../../../../shared';
import { AnalyticsEventsTable, CodeBlock, SiteFormCodeBlock } from './components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SwitchWrapper = styled.div`
  padding-left: 24px;
`;

const Content = styled(BuilderStepBox)`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 32px 48px;

  p,
  b {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: var(--button-text-graphite-priory-text);
  }

  p {
    code {
      font-weight: 500;
      border: 1px solid var(--graphite-graphite-80);
      font-family: var(--font-family-mono);

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
  previewUrl: string;
  multiformEnabled: BooleanModel;
  siteFormPages: SiteFormElementsPageFormData[];
}

const SiteFormBuilderStep5 = observer((props: Props) => {
  const { code, previewUrl, multiformEnabled, siteFormPages } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step5',
  });

  return (
    <Root>
      <BuilderStepBiggerTitle>{t('title')}</BuilderStepBiggerTitle>

      <SwitchWrapper>
        <SwitchBlock
          justifyStart
          text={t('multiform_mode')}
          hint={t('multiform_mode_hint')}
          model={multiformEnabled}
        />
      </SwitchWrapper>

      <Content>
        <SiteFormCodeBlock code={code} multiform={multiformEnabled.value} />
      </Content>

      <BuilderStepSubtitle $withIndent>{t('public_link_title')}</BuilderStepSubtitle>

      <Content>
        <p>{t('public_link_annotation')}</p>

        <PrimaryButton
          variant="outlined"
          linkProps={{
            to: previewUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
          }}
        >
          {t('view_form')}
        </PrimaryButton>
      </Content>

      <BuilderStepSubtitle $withIndent>{t('instruction_title')}</BuilderStepSubtitle>

      <Content as="ul">
        <li>{t('static_site_integration_title')}</li>

        {!multiformEnabled.value && <b>{t('first_point.title')}</b>}

        <p>
          <Trans
            t={t}
            i18nKey={'first_point.annotation'}
            values={{
              mountClass: multiformEnabled.value
                ? `workspace-form-builder-mount-container-${code}`
                : 'workspace-form-builder-mount-container',
            }}
            components={{
              b: <b />,
              code: <code />,
            }}
          />
        </p>
        <CodeBlock>
          {`<html>
  <head>
    <!-- ${t('form_code')} -->
  </head>
  <body>
    <div>📊</div>
    <div>📈</div>
    <div class="workspace-form-builder-mount-container${multiformEnabled.value ? `-${code}` : ''}">
      <ul>
        <li>1️⃣</li>
        <li>2️⃣</li>
        <li>3️⃣</li>
      </ul>

      <!-- ${t('form_will_be_mounted_here')} -->
    </div>
  </body>
</html>`}
        </CodeBlock>

        {!multiformEnabled.value && (
          <>
            <b>{t('second_point.title')}</b>
            <p>
              <Trans
                t={t}
                i18nKey={'second_point.annotation'}
                components={{
                  code: <code />,
                  b: <b />,
                }}
              />
            </p>
            <CodeBlock>
              {`<html>
  <body>
    <div>📊</div>
    <div>📈</div>
    <div>
      <!-- ${t('form_code')} -->
      <!-- ${t('form_will_be_mounted_here')} -->
    </div>
  </body>
</html>`}
            </CodeBlock>

            <li>{t('ssr_integration_title')}</li>

            <p>
              <Trans
                t={t}
                i18nKey={'ssr_integration_annotation'}
                components={{
                  b: <b />,
                  code: <code />,
                }}
              />
            </p>
          </>
        )}
      </Content>

      <BuilderStepSubtitle $withIndent>{t('analytics.title')}</BuilderStepSubtitle>

      <Content>
        <p>{t('analytics.annotation')}</p>

        <h3>{t('analytics.table_title')}</h3>

        <AnalyticsEventsTable code={code} siteFormPages={siteFormPages} />
      </Content>
    </Root>
  );
});

export { SiteFormBuilderStep5 };
