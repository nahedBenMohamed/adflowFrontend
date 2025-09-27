import { TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SiteFormElementsPageFormData } from '../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: auto;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 0 0 12px;
`;

const Element = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 12px 24px 12px 12px;

  ${TruncateMixin};
`;

interface Props {
  siteFormPages: SiteFormElementsPageFormData[];
}

const HeadlessSiteFormPlainFieldsTable = observer((props: Props) => {
  const { siteFormPages } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.headless_site_form_builder_page.site_form_builder_step3.fields_table',
  });

  return (
    <Root>
      <Header>{t('field_title')}</Header>
      <Header>{t('field_id')}</Header>

      {siteFormPages[0]?.fields.map(f => (
        <Fragment key={f.id}>
          <Element>{f.title}</Element>
          <Element>{f.id}</Element>
        </Fragment>
      ))}
    </Root>
  );
});

HeadlessSiteFormPlainFieldsTable.displayName = 'HeadlessSiteFormPlainFieldsTable';
export { HeadlessSiteFormPlainFieldsTable };
