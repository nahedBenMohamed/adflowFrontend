import { entityTypeStore } from '@/app';
import { TruncateMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  type SiteFormElementsFieldModel,
  type SiteFormElementsPageFormData,
  type SiteFormFieldEntityFieldModel,
  SiteFormFieldType,
} from '../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: auto;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  border-bottom: 1px solid var(--graphite-graphite-80);
  padding: 0 0 12px 12px;
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

const HeadlessSiteFormFieldsTable = observer((props: Props) => {
  const { siteFormPages } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.headless_site_form_builder_page.site_form_builder_step3.fields_table',
  });

  const getFieldType = useCallback(
    (field: SiteFormElementsFieldModel) =>
      field.settings && field.type === SiteFormFieldType.ENTITY_FIELD
        ? entityTypeStore
            .getById(field.settings.entityTypeId)
            .getFieldById((field.settings as SiteFormFieldEntityFieldModel).fieldId).type
        : null,
    []
  );

  return (
    <Root>
      <Header>{t('field_title')}</Header>
      <Header>{t('field_format')}</Header>
      <Header>{t('field_example')}</Header>

      {siteFormPages[0]?.fields.map(f => (
        <Fragment key={f.id}>
          <Element>{f.title}</Element>
          <Element>{t(`format.${getFieldType(f) ?? 'text'}`)}</Element>
          <Element>{t(`example.${getFieldType(f) ?? 'text'}`)}</Element>
        </Fragment>
      ))}
    </Root>
  );
});

HeadlessSiteFormFieldsTable.displayName = 'HeadlessSiteFormFieldsTable';
export { HeadlessSiteFormFieldsTable };
