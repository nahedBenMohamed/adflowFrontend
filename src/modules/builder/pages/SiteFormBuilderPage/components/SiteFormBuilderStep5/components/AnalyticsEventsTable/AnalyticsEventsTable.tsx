import { TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SiteFormElementsPageFormData } from '../../../../../../shared';
import { AnalyticsEventCode } from '../AnalyticsEventCode/AnalyticsEventCode';

const Root = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-auto-rows: auto;
`;

const Header = styled.div<{ $withIndent?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 0 0 12px;

  ${p => p.$withIndent && 'padding: 0 0 12px 12px'};
`;

const Element = styled.div`
  min-width: 300px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 12px 24px 12px 12px;

  ${TruncateMixin};
`;

const EVENT_PREFIX = 'WORKSPACE_FORM';

interface Props {
  code: string;
  siteFormPages: SiteFormElementsPageFormData[];
}

const AnalyticsEventsTable = observer((props: Props) => {
  const { code, siteFormPages } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step5.analytics',
  });

  return (
    <Root>
      <Header $withIndent>{t('event_title')}</Header>
      <Header>{t('event_id')}</Header>

      <Element>{t('form_view')}</Element>
      <AnalyticsEventCode>{`${EVENT_PREFIX}_${code}_VIEW`}</AnalyticsEventCode>

      <Element>{t('form_start')}</Element>
      <AnalyticsEventCode>{`${EVENT_PREFIX}_${code}_START`}</AnalyticsEventCode>

      {siteFormPages[0]?.fillableFields.map(f => (
        <Fragment key={f.id}>
          <Element>{t('field_fill', { field: f.title })}</Element>
          <AnalyticsEventCode>{`${EVENT_PREFIX}_${code}_FIELD_${f.id}`}</AnalyticsEventCode>
        </Fragment>
      ))}

      <Element>{t('form_submit')}</Element>
      <AnalyticsEventCode>{`${EVENT_PREFIX}_${code}_SUBMIT`}</AnalyticsEventCode>
    </Root>
  );
});

AnalyticsEventsTable.displayName = 'AnalyticsEventsTable';
export { AnalyticsEventsTable };
